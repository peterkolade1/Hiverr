import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true, // Allow creating table in development
    ttl: sessionTtl,
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only secure in production
      sameSite: "lax",
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  // Adapted for our schema: use externalId for Replit sub mapping
  await storage.upsertUser({
    externalId: claims["sub"], // Use externalId for Replit's sub field
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await getOidcConfig();

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  // Support both production domains and localhost for development
  const domains = process.env.REPLIT_DOMAINS ? process.env.REPLIT_DOMAINS.split(",") : [];
  
  // Add localhost support for development
  if (process.env.NODE_ENV === 'development') {
    domains.push('localhost');
  }
  
  for (const domain of domains) {
    const protocol = domain === 'localhost' ? 'http' : 'https';
    const port = domain === 'localhost' ? ':5000' : '';
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `${protocol}://${domain}${port}/api/callback`,
      },
      verify,
    );
    passport.use(strategy);
  }

  // Store minimal session data to distinguish between OAuth and custom users
  passport.serializeUser((user: any, cb) => {
    console.log('SerializeUser called with:', { id: user.id, claims: !!user.claims, access_token: !!user.access_token });
    if (user.claims && user.access_token) {
      // OAuth user (from Replit Auth)
      console.log('Serializing OAuth user');
      cb(null, {
        type: 'oidc',
        claims: user.claims,
        access_token: user.access_token,
        refresh_token: user.refresh_token,
        expires_at: user.expires_at
      });
    } else if (user.id) {
      // Custom user (from email/password login)
      console.log('Serializing custom user with ID:', user.id);
      cb(null, {
        type: 'local',
        userId: user.id
      });
    } else {
      console.log('Invalid user object for serialization:', user);
      cb(new Error('Invalid user object for serialization'));
    }
  });

  passport.deserializeUser((sessionData: any, cb) => {
    // Reconstruct session object based on type
    cb(null, sessionData);
  });

  app.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const sessionData = req.user as any;

  // Handle OAuth users (OIDC)
  if (sessionData.type === 'oidc') {
    if (!sessionData.expires_at) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const now = Math.floor(Date.now() / 1000);
    if (now <= sessionData.expires_at) {
      return next();
    }

    const refreshToken = sessionData.refresh_token;
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const config = await getOidcConfig();
      const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
      // Update session data with new tokens
      sessionData.claims = tokenResponse.claims();
      sessionData.access_token = tokenResponse.access_token;
      sessionData.refresh_token = tokenResponse.refresh_token;
      sessionData.expires_at = tokenResponse.claims()?.exp;
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  }
  
  // Handle local users (email/password)
  if (sessionData.type === 'local') {
    if (!sessionData.userId) {
      return res.status(401).json({ message: "Invalid session" });
    }
    // Local users don't need token refresh - session is valid
    return next();
  }

  // Unknown session type
  return res.status(401).json({ message: "Invalid session type" });
};

// Role-based access control middleware
export const requireRole = (allowedRoles: string[]): RequestHandler => {
  return async (req, res, next) => {
    try {
      // First check if user is authenticated
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const sessionData = req.user as any;
      let dbUser;

      // Get user from database based on session type
      if (sessionData.type === 'oidc') {
        // OAuth user - get by externalId from claims
        const externalId = sessionData.claims?.sub;
        if (!externalId) {
          return res.status(401).json({ message: "Invalid OAuth session" });
        }
        dbUser = await storage.getUserByExternalId(externalId);
      } else if (sessionData.type === 'local') {
        // Custom user - get by userId
        const userId = sessionData.userId;
        if (!userId) {
          return res.status(401).json({ message: "Invalid local session" });
        }
        dbUser = await storage.getUser(userId);
      } else {
        return res.status(401).json({ message: "Unknown session type" });
      }

      if (!dbUser) {
        return res.status(401).json({ message: "User not found" });
      }

      // Check if user has required role
      if (!allowedRoles.includes(dbUser.role)) {
        return res.status(403).json({ 
          message: "Forbidden: Insufficient permissions",
          required: allowedRoles,
          current: dbUser.role
        });
      }

      // Attach user data to request for use in route handlers
      (req as any).dbUser = dbUser;
      next();
    } catch (error) {
      console.error("Error in requireRole middleware:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

// Convenience middleware for specific roles
export const requireAdmin = requireRole(['admin']);
export const requireBrand = requireRole(['brand', 'admin']);
export const requireCreator = requireRole(['creator', 'admin']);
export const requireBrandOrCreator = requireRole(['brand', 'creator', 'admin']);