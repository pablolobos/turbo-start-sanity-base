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
  ...props
}: ImageProps) {
  if (!asset?.asset) return null;
  const dimensions = getImageDimensions(asset.asset);

  const url = urlFor({ ...asset, _id: asset.asset._ref })
    .width(width ? Number(width) : dimensions.width)
    .dpr(2)
    .height(height ? Number(height) : dimensions.height)
    .auto("format")
    .url();

  return (
    <Image
      alt={alt ?? asset.alt ?? "Image"}
      src={url}
      width={width ?? dimensions.width}
      height={height ?? dimensions.height}
      className={cn(className)}
      // This sizes attribute tells the browser what image size to load at different viewport widths:
      // - Mobile first approach using min-width
      // - Above 1200px (large desktop): Image takes 33% viewport width
      // - Above 768px (small desktop): Image takes 50% viewport width
      // - Above 640px (tablet): Image takes 75% viewport width
      // - Below 640px (mobile): Image takes full viewport width (100vw)
      sizes="(min-width: 1200px) 33vw, (min-width: 768px) 50vw, (min-width: 640px) 75vw, 100vw"
      // - The height attribute is set to the original image height
      {...props}
      {...getBlurDataURL(asset)}
    />
  );
}
