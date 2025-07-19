import React, { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  validateImageFile, 
  createOptimizedImage, 
  formatFileSize,
  type ImageOptimizationOptions 
} from '@/lib/imageUtils';

interface OptimizedImageUploadProps {
  id: string;
  label: string;
  description?: string;
  onImageChange: (optimizedImage: string, placeholder: string) => void;
  onImageRemove: () => void;
  currentImage?: string;
  options?: ImageOptimizationOptions;
  disabled?: boolean;
  maxUploads?: number;
  uploadCount?: number;
}

export function OptimizedImageUpload({
  id,
  label,
  description,
  onImageChange,
  onImageRemove,
  currentImage,
  options = { maxWidth: 800, maxHeight: 600, quality: 0.8 },
  disabled = false,
  maxUploads = 1,
  uploadCount = 0
}: OptimizedImageUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [optimizationStats, setOptimizationStats] = useState<{
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
  } | null>(null);
  
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (file: File) => {
    // Check upload limits
    if (uploadCount >= maxUploads) {
      toast({
        title: "Upload limit reached",
        description: `Maximum ${maxUploads} image${maxUploads > 1 ? 's' : ''} allowed per user`,
        variant: "destructive",
      });
      return;
    }

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Optimize image
      const result = await createOptimizedImage(file, options);
      
      clearInterval(progressInterval);
      setProcessingProgress(100);

      // Calculate compression stats
      const compressionRatio = Math.round(
        ((result.originalSize - result.optimizedSize) / result.originalSize) * 100
      );

      setOptimizationStats({
        originalSize: result.originalSize,
        optimizedSize: result.optimizedSize,
        compressionRatio
      });

      // Pass optimized image to parent
      onImageChange(result.optimized, result.placeholder);

      toast({
        title: "Image optimized successfully",
        description: `Reduced size by ${compressionRatio}% (${formatFileSize(result.originalSize)} → ${formatFileSize(result.optimizedSize)})`,
      });

    } catch (error) {
      toast({
        title: "Image processing failed",
        description: "Please try again with a different image",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setProcessingProgress(0);
        setOptimizationStats(null);
      }, 3000);
    }
  }, [uploadCount, maxUploads, options, onImageChange, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || isProcessing) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      handleFileSelect(files[0]);
    }
  }, [disabled, isProcessing, handleFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleRemove = useCallback(() => {
    onImageRemove();
    setOptimizationStats(null);
  }, [onImageRemove]);

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
        {maxUploads > 1 && (
          <p className="text-xs text-gray-500 mt-1">
            {uploadCount}/{maxUploads} uploads used
          </p>
        )}
      </div>

      {currentImage ? (
        <div className="relative group">
          <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden">
            <img
              src={currentImage}
              alt="Uploaded preview"
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={disabled}
              >
                <X size={16} className="mr-1" />
                Remove
              </Button>
            </div>
          </div>
          
          {optimizationStats && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
              <div className="flex items-center gap-1 text-green-700">
                <CheckCircle size={12} />
                <span className="font-medium">Optimized</span>
              </div>
              <div className="text-green-600 mt-1">
                Size reduced by {optimizationStats.compressionRatio}%
                <br />
                {formatFileSize(optimizationStats.originalSize)} → {formatFileSize(optimizationStats.optimizedSize)}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div
            className={`
              border-2 border-dashed rounded-lg p-6 text-center transition-colors
              ${disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-300 hover:border-gray-400'}
              ${isProcessing ? 'bg-blue-50 border-blue-300' : ''}
            `}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {isProcessing ? (
              <div className="space-y-3">
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-blue-700 font-medium">Optimizing image...</p>
                  <Progress value={processingProgress} className="w-full" />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <ImageIcon size={24} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Drag & drop an image here, or{' '}
                    <label
                      htmlFor={id}
                      className="text-blue-600 hover:text-blue-700 cursor-pointer underline"
                    >
                      browse
                    </label>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, WebP • Max 5MB • Auto-optimized to WebP
                  </p>
                </div>
              </div>
            )}
          </div>

          <input
            id={id}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInput}
            disabled={disabled || isProcessing}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}