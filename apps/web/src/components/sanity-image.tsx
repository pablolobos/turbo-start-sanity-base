import { urlFor } from "@/lib/sanity/client";
import type { SanityImageProps } from "@/types";
import { getImageDimensions } from "@sanity/asset-utils";
import { cn } from "@workspace/ui/lib/utils";
import Image, { type ImageProps as NextImageProps } from "next/image";

type ImageProps = {
  asset: SanityImageProps;
  alt?: string;
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

export function SanityImage({
  asset,
  alt,
  width,
  height,
  className,
  quality = 75,
  ...props
}: ImageProps) {
  if (!asset?.asset) return null;
  const dimensions = getImageDimensions(asset.asset);

  const url = urlFor({ ...asset, _id: asset.asset._ref })
    .size(
      Number(width ?? dimensions.width),
      Number(height ?? dimensions.height)
    )
    .dpr(2) // Reduced from 3 to 2 for faster loading
    .auto("format")
    .format("webp") // Explicitly use WebP format
    .quality(Number(quality))
    .url();

  return (
    <Image
      alt={alt ?? asset.alt ?? "Image"}
      aria-label={alt ?? asset.alt ?? "Image"}
      src={url}
      width={width ?? dimensions.width}
      height={height ?? dimensions.height}
      className={cn(className)}
      sizes="(max-width: 640px) 100vw, (max-width: 768px) 75vw, (max-width: 1200px) 50vw, 33vw"
      {...props}
      {...getBlurDataURL(asset)}
    />
  );
}
