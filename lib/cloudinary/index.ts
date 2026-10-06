import { v2 as cloudinary } from "cloudinary";

if (process.env.CLOUDINARY_URL) {
  cloudinary.config({ secure: true });
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export { cloudinary };

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
}

/**
 * Server-side stream upload to Cloudinary.
 * Never exposes credentials to client.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = "moneywise"
): Promise<CloudinaryUploadResult> {
  if (
    !process.env.CLOUDINARY_URL &&
    (!process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET)
  ) {
    throw new Error("Cloudinary environment variables are not configured.");
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Upload to Cloudinary failed"));
        } else {
          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );
    stream.end(buffer);
  });
}

/**
 * Generates an optimized Cloudinary delivery URL with standard dimensions.
 */
export function getOptimizedImageUrl(
  publicId: string,
  options: { width?: number; height?: number; crop?: string; quality?: string } = {}
): string {
  if (!publicId) return "";
  if (publicId.startsWith("http://") || publicId.startsWith("https://")) {
    return publicId;
  }

  const { width = 1200, height = 630, crop = "fill", quality = "auto" } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    crop,
    quality,
    fetch_format: "auto",
    secure: true,
  });
}
