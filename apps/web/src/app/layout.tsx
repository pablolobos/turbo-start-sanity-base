import "@workspace/ui/globals.css";

import { revalidatePath, revalidateTag } from "next/cache";
import { Geist, Geist_Mono } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity";
import { Suspense } from "react";
import { preconnect, prefetchDNS } from "react-dom";

import { FooterServer, FooterSkeleton } from "@/components/footer";
import { NavbarServer, NavbarSkeleton } from "@/components/navbar";
import { PreviewBar } from "@/components/preview-bar";
import { SanityLive } from "@/lib/sanity/live";

import { Providers } from "../components/providers";

import localFont from 'next/font/local'

export const volvoNovum = localFont({
  src: [
    {
      path: '../../public/fonts/novum/VolvoNovum3-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/novum/VolvoNovum3-LightItalic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/fonts/novum/VolvoNovum3-SemiLight.woff2',
      weight: '350',
      style: 'normal',
    },
    {
      path: '../../public/fonts/novum/VolvoNovum3-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/novum/VolvoNovum3-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/novum/VolvoNovum3-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/novum/VolvoNovum3-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-volvo-novum',
})

export const volvoBroad = localFont({
  src: [
    {
      path: '../../public/fonts/broad/VolvoBroad.ttf',
      weight: '700',
      style: 'bold',
    }
  ],
  variable: '--font-volvo-broad',
})


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preconnect("https://cdn.sanity.io");
  prefetchDNS("https://cdn.sanity.io");
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${volvoNovum.variable} ${volvoBroad.variable} font-novum antialiased`}
      >
        <Providers>
          <Suspense fallback={<NavbarSkeleton />}>
            <NavbarServer />
          </Suspense>
          {(await draftMode()).isEnabled ? (
            <>
              {children}
              <VisualEditing
                refresh={async (payload) => {
                  "use server";
                  if (payload.source === "manual") {
                    revalidatePath("/", "layout");
                    return;
                  }
                  const id = payload?.document?._id?.startsWith("drafts.")
                    ? payload?.document?._id.slice(7)
                    : payload?.document?._id;
                  const slug = payload?.document?.slug?.current;
                  const type = payload?.document?._type;
                  for (const tag of [slug, id, type]) {
                    if (tag) revalidateTag(tag);
                  }
                }}
              />
              <PreviewBar />
            </>
          ) : (
            children
          )}
          <Suspense fallback={<FooterSkeleton />}>
            <FooterServer />
          </Suspense>
          <SanityLive />
        </Providers>
      </body>
    </html>
  );
}
