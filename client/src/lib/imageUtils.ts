// Image optimization utilities for better performance and storage
export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  file?: File;
}

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

// Validate image file before upload
export function validateImageFile(file: File): ImageValidationResult {
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "Image must be smaller than 5MB"
    };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Only JPG, PNG, and WebP formats are allowed"
    };
  }

  return {
    isValid: true,
    file
  };
}

// Convert image to WebP format with optimization
export function convertToWebP(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<string> {
  const {
    maxWidth = 800,
    maxHeight = 600,
    quality = 0.8,
    format = 'webp'
  } = options;

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        
        if (width > height) {
          width = maxWidth;
          height = width / aspectRatio;
        } else {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to WebP
      const dataUrl = canvas.toDataURL(`image/${format}`, quality);
      resolve(dataUrl);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Generate blur hash placeholder (simplified version)
export function generateBlurPlaceholder(canvas: HTMLCanvasElement): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  
  // Create a tiny 4x4 version for blur effect
  const tinyCanvas = document.createElement('canvas');
  const tinyCtx = tinyCanvas.getContext('2d');
  tinyCanvas.width = 4;
  tinyCanvas.height = 4;
  
  tinyCtx?.drawImage(canvas, 0, 0, 4, 4);
  return tinyCanvas.toDataURL('image/jpeg', 0.1);
}

// Create optimized image with blur placeholder
export async function createOptimizedImage(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<{
  optimized: string;
  placeholder: string;
  originalSize: number;
  optimizedSize: number;
}> {
  try {
    const originalSize = file.size;
    
    // Convert to WebP with optimization
    const optimizedDataUrl = await convertToWebP(file, options);
    
    // Calculate optimized size (approximate)
    const optimizedSize = Math.round(optimizedDataUrl.length * 0.75);
    
    // Create blur placeholder
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        canvas.width = 20;
        canvas.height = 15;
        ctx?.drawImage(img, 0, 0, 20, 15);
        
        const placeholder = canvas.toDataURL('image/jpeg', 0.1);
        
        resolve({
          optimized: optimizedDataUrl,
          placeholder,
          originalSize,
          optimizedSize
        });
      };
      
      img.onerror = () => reject(new Error('Failed to create placeholder'));
      img.src = optimizedDataUrl;
    });
  } catch (error) {
    throw new Error('Image optimization failed');
  }
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Check if WebP is supported
export function isWebPSupported(): boolean {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}