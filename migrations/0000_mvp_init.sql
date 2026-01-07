CREATE TABLE "applications" (
        "id" serial PRIMARY KEY NOT NULL,
        "campaign_id" integer NOT NULL,
        "creator_id" integer NOT NULL,
        "status" text DEFAULT 'applied' NOT NULL,
        "proposed_fee" integer,
        "cover_letter" text,
        "portfolio_samples" json DEFAULT '[]'::json,
        "notes" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "assignments" (
        "id" serial PRIMARY KEY NOT NULL,
        "campaign_id" integer NOT NULL,
        "creator_id" integer NOT NULL,
        "application_id" integer NOT NULL,
        "agreed_base_fee" integer NOT NULL,
        "bonus_eligible" boolean DEFAULT true,
        "status" text DEFAULT 'active' NOT NULL,
        "delivery_deadline" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "brand_profiles" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "company_name" text NOT NULL,
        "website" text,
        "handle" text,
        "description" text,
        "industry" text,
        "size" text,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
        "id" serial PRIMARY KEY NOT NULL,
        "brand_id" integer NOT NULL,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "brief_description" text,
        "platforms" json NOT NULL,
        "category" text NOT NULL,
        "deliverables" json NOT NULL,
        "base_fee_formula" text NOT NULL,
        "bonus_pool" integer NOT NULL,
        "kpi_metric" text NOT NULL,
        "kpi_target" integer NOT NULL,
        "target_audience" json,
        "requirements" text,
        "budget" integer NOT NULL,
        "status" text DEFAULT 'draft' NOT NULL,
        "application_deadline" timestamp,
        "delivery_deadline" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "creator_profiles" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "location" text,
        "bio" text,
        "niches" json DEFAULT '[]'::json,
        "platforms" json DEFAULT '[]'::json,
        "languages" json DEFAULT '[]'::json,
        "engagement_rate" numeric(5, 2),
        "average_reach" integer,
        "response_rate" numeric(5, 2),
        "content_quality_score" numeric(3, 1),
        "hive_score" numeric(5, 2),
        "is_available" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "deliverables" (
        "id" serial PRIMARY KEY NOT NULL,
        "assignment_id" integer NOT NULL,
        "type" text NOT NULL,
        "url" text NOT NULL,
        "description" text,
        "attachments" json DEFAULT '[]'::json,
        "is_approved" boolean DEFAULT false,
        "approved_at" timestamp,
        "feedback" text,
        "submitted_at" timestamp DEFAULT now(),
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inquiries" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL,
        "company" text,
        "user_type" text NOT NULL,
        "message" text NOT NULL,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "legacy_campaigns" (
        "id" serial PRIMARY KEY NOT NULL,
        "brand_name" text NOT NULL,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "budget" integer NOT NULL,
        "platform" text NOT NULL,
        "category" text NOT NULL,
        "metrics" json NOT NULL,
        "testimonial" text,
        "client_name" text,
        "client_title" text,
        "campaign_image" text NOT NULL,
        "rating" integer DEFAULT 5 NOT NULL,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "legacy_creators" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL,
        "bio" text NOT NULL,
        "location" text NOT NULL,
        "category" text NOT NULL,
        "platforms" json NOT NULL,
        "follower_count" integer NOT NULL,
        "engagement_rate" text NOT NULL,
        CONSTRAINT "legacy_creators_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "metrics_snapshots" (
        "id" serial PRIMARY KEY NOT NULL,
        "assignment_id" integer NOT NULL,
        "deliverable_id" integer,
        "captured_at" timestamp NOT NULL,
        "metrics" json NOT NULL,
        "source" text NOT NULL,
        "is_verified" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payouts" (
        "id" serial PRIMARY KEY NOT NULL,
        "creator_wallet_id" integer NOT NULL,
        "amount" integer NOT NULL,
        "stripe_payout_id" text,
        "scheduled_for" timestamp,
        "status" text DEFAULT 'pending' NOT NULL,
        "failure_reason" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recommendations" (
        "id" serial PRIMARY KEY NOT NULL,
        "campaign_id" integer NOT NULL,
        "creator_id" integer NOT NULL,
        "hive_match_score" numeric(5, 2) NOT NULL,
        "estimated_base_fee" integer,
        "reasoning_factors" json,
        "is_viewed" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "social_accounts" (
        "id" serial PRIMARY KEY NOT NULL,
        "creator_id" integer NOT NULL,
        "platform" text NOT NULL,
        "handle" text NOT NULL,
        "external_id" text,
        "follower_count" integer,
        "is_verified" boolean DEFAULT false,
        "metrics" json,
        "last_sync_at" timestamp,
        "created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
        "id" serial PRIMARY KEY NOT NULL,
        "wallet_id" integer NOT NULL,
        "type" text NOT NULL,
        "amount" integer NOT NULL,
        "description" text NOT NULL,
        "campaign_id" integer,
        "assignment_id" integer,
        "stripe_reference" text,
        "status" text DEFAULT 'pending' NOT NULL,
        "metadata" json,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" text NOT NULL,
        "role" text NOT NULL,
        "display_name" text NOT NULL,
        "avatar_url" text,
        "is_verified" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "waitlist" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar(255) NOT NULL,
        "email" varchar(255) NOT NULL,
        "interest" varchar(50),
        "company_name" varchar(255),
        "role" varchar(100),
        "creator_preference" varchar(100),
        "budget" varchar(100),
        "campaign_timing" varchar(100),
        "campaign_ready" varchar(50),
        "company_website" varchar(255),
        "company_handle" varchar(100),
        "brand_logo" text,
        "niches" text,
        "selected_platforms" text,
        "profile_picture" text,
        "instagram" varchar(255),
        "instagram_followers" varchar(50),
        "instagram_image" text,
        "tiktok" varchar(255),
        "tiktok_followers" varchar(50),
        "tiktok_image" text,
        "youtube" varchar(255),
        "youtube_subs" varchar(50),
        "youtube_image" text,
        "twitter" varchar(255),
        "twitter_image" text,
        "facebook" varchar(255),
        "facebook_image" text,
        "location" varchar(255),
        "languages" text,
        "ai_content" boolean,
        "rate_range" varchar(100),
        "portfolio" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "waitlist_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wallets" (
        "id" serial PRIMARY KEY NOT NULL,
        "owner_type" text NOT NULL,
        "owner_id" integer NOT NULL,
        "stripe_account_id" text,
        "available_balance" integer DEFAULT 0,
        "pending_balance" integer DEFAULT 0,
        "lifetime_earnings" integer DEFAULT 0,
        "is_active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_creator_id_creator_profiles_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creator_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_creator_id_creator_profiles_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creator_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brand_profiles" ADD CONSTRAINT "brand_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_brand_id_brand_profiles_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brand_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creator_profiles" ADD CONSTRAINT "creator_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliverables" ADD CONSTRAINT "deliverables_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metrics_snapshots" ADD CONSTRAINT "metrics_snapshots_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "metrics_snapshots" ADD CONSTRAINT "metrics_snapshots_deliverable_id_deliverables_id_fk" FOREIGN KEY ("deliverable_id") REFERENCES "public"."deliverables"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_creator_wallet_id_wallets_id_fk" FOREIGN KEY ("creator_wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_creator_id_creator_profiles_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creator_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "social_accounts" ADD CONSTRAINT "social_accounts_creator_id_creator_profiles_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."creator_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_wallets_id_fk" FOREIGN KEY ("wallet_id") REFERENCES "public"."wallets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE no action ON UPDATE no action;