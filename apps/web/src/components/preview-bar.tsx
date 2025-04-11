"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { FC } from "react";

export const PreviewBar: FC = () => {
  const path = usePathname();
  return (
    <div className="right-0 bottom-1 md:bottom-2 left-0 z-10 fixed px-2 md:px-4">
      <div className="bg-zinc-100/80 backdrop-blur-sm mx-auto p-2 border border-zinc-200 rounded-md max-w-96">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-zinc-700 text-xs">
              Viewing the website in preview mode.
            </p>
          </div>
          <Link
            className="text-zinc-500 hover:text-zinc-700 text-xs transition-colors"
            href={`/api/disable-draft?slug=${path}`}
            prefetch={false}
          >
            Exit
          </Link>
        </div>
      </div>
    </div>
  );
};
