export interface CompressedImage {
  file: File;
  dataUrl: string;
  size: number;
  originalSize: number;
  compressionRatio: number;
}

export const compressImage = async (
  file: File,
  maxSizeMB: number = 1,
  quality: number = 0.8
): Promise<CompressedImage> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate dimensions to maintain aspect ratio
      const maxWidth = 1200;
      const maxHeight = 800;
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image on canvas
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to WebP with quality
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to compress image'));
            return;
          }

          // Check if size is within limit
          const sizeMB = blob.size / (1024 * 1024);
          if (sizeMB > maxSizeMB) {
            // If still too large, reduce quality and try again
            if (quality > 0.3) {
              compressImage(file, maxSizeMB, quality - 0.1)
                .then(resolve)
                .catch(reject);
            } else {
              reject(new Error(`Image too large. Maximum size is ${maxSizeMB}MB`));
            }
            return;
          }

          // Create File object
          const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
            type: 'image/webp',
            lastModified: Date.now(),
          });

          // Create data URL for preview
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              file: compressedFile,
              dataUrl: reader.result as string,
              size: compressedFile.size,
              originalSize: file.size,
              compressionRatio: (1 - compressedFile.size / file.size) * 100,
            });
          };
          reader.readAsDataURL(compressedFile);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const validateImage = (file: File): string | null => {
  const maxSize = 5 * 1024 * 1024; // 5MB original limit
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (file.size > maxSize) {
    return 'Image size must be less than 5MB';
  }

  if (!allowedTypes.includes(file.type)) {
    return 'Only JPEG, PNG, and WebP images are allowed';
  }

  return null;
}; 