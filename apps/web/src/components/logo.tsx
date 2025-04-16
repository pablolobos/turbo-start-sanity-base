import Image from "next/image";
import Link from "next/link";

import type { Maybe, SanityImageProps } from "@/types";

import { SanityImage } from "./sanity-image";

const LOGO_URL =
  "/volvo-chile.svg";

interface LogoProps {
  src?: Maybe<string>;
  image?: Maybe<SanityImageProps>;
  alt?: Maybe<string>;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function Logo({
  src,
  alt = "logo",
  image,
  width = 200,
  height = 70,
  priority = true,
}: LogoProps) {
  return (
    <Link href="/" className="">
      {image ? (
        <SanityImage
          asset={image}
          alt={alt ?? "logo"}
          width={width}
          className="w-[200px] h-[70px]"
          height={height}
          priority={priority}
          loading="eager"
          decoding="sync"
          quality={100}
        />
      ) : (
        <Image
          src={src ?? LOGO_URL}
          alt={alt ?? "logo"}
          width={width}
          className="w-[200px] h-[70px]"
          height={height}
          loading="eager"
          priority={priority}
          decoding="sync"
        />
      )}
    </Link>
  );
}
