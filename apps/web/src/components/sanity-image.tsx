import { getImageDimensions } from "@sanity/asset-utils";
import { cn } from "@workspace/ui/lib/utils";
import Image, { type ImageProps as NextImageProps } from "next/image";

import { urlFor } from "@/lib/sanity/client";
import type { SanityImageProps } from "@/types";

type ImageProps = {
  asset: SanityImageProps;
  alt?: string;
  priority?: boolean;
} & Omit<NextImageProps, "alt" | "src">;

function getBlurDataURL(asset: SanityImageProps) {
  if (asset?.blurData) {
    return {
      blurDataURL: asset.blurData,
      placeholder: "blur" as const,
    };
  }
  return {};
}

// Helper to calculate optimal image dimensions
function getOptimalDimensions(originalWidth: number, originalHeight: number, maxWidth = 2048) {
  if (originalWidth <= maxWidth) {
    return { width: originalWidth, height: originalHeight };
  }
  const aspectRatio = originalWidth / originalHeight;
  const newWidth = maxWidth;
  const newHeight = Math.round(maxWidth / aspectRatio);
  return { width: newWidth, height: newHeight };
}

export function SanityImage({
  asset,
  alt,
  width,
  height,
  className,
  quality = 85,
  fill,
  priority = false,
  ...props
}: ImageProps) {
  if (!asset?.asset) return null;
  const dimensions = getImageDimensions(asset.asset);

  // Calculate optimal dimensions
  const optimalDimensions = getOptimalDimensions(dimensions.width, dimensions.height);

  // Calculate dynamic quality based on image size
  const dynamicQuality = dimensions.width > 1200 ? 75 : quality;

  const url = urlFor({ ...asset, _id: asset?.asset?._ref })
    .size(
      Number(width ?? optimalDimensions.width),
      Number(height ?? optimalDimensions.height),
    )
    .dpr(2)
    .auto("format")
    .quality(Number(dynamicQuality))
    .url();

  // Base image props
  const imageProps = {
    alt: alt ?? asset.alt ?? "Image",
    "aria-label": alt ?? asset.alt ?? "Image",
    src: url,
    className: cn(className),
    priority,
    // Optimize sizes attribute based on image dimensions and layout
    sizes: fill
      ? "(min-width: 1200px) 100vw, (min-width: 768px) 90vw, 100vw"
      : "(min-width: 1200px) 50vw, (min-width: 768px) 70vw, 90vw",
    ...getBlurDataURL(asset),
    ...props,
  };

  // Add width and height only if fill is not true
  if (!fill) {
    return (
      <Image
        {...imageProps}
        width={width ?? optimalDimensions.width}
        height={height ?? optimalDimensions.height}
      />
    );
  }

  return <Image {...imageProps} fill={fill} />;
}
