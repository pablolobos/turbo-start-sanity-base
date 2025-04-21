import { getImageDimensions } from "@sanity/asset-utils";
import { cn } from "@workspace/ui/lib/utils";
import Image, { type ImageProps as NextImageProps } from "next/image";

import { urlFor } from "@/lib/sanity/client";
import type { SanityImageProps } from "@/types";

type ImageProps = {
  asset: SanityImageProps;
  alt?: string;
  priority?: boolean;
  preserveAspectRatio?: boolean;
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

// Helper to calculate optimal dimensions
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
  preserveAspectRatio = false,
  ...props
}: ImageProps) {
  if (!asset?.asset) return null;
  const dimensions = getImageDimensions(asset.asset);

  // If preserveAspectRatio is true, use original dimensions
  const finalDimensions = preserveAspectRatio
    ? dimensions
    : getOptimalDimensions(dimensions.width, dimensions.height);

  // Calculate dynamic quality based on image size
  const dynamicQuality = dimensions.width > 1200 ? 80 : quality;

  const url = urlFor({ ...asset, _id: asset?.asset?._ref })
    .size(
      preserveAspectRatio ? dimensions.width : Number(width ?? finalDimensions.width),
      preserveAspectRatio ? dimensions.height : Number(height ?? finalDimensions.height),
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
        width={preserveAspectRatio ? dimensions.width : (width ?? finalDimensions.width)}
        height={preserveAspectRatio ? dimensions.height : (height ?? finalDimensions.height)}
      />
    );
  }

  return <Image {...imageProps} fill={fill} />;
}
