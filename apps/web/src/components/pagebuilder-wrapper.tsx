"use client";

import { Suspense, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import the client-pagebuilder component for client-side rendering only
const ClientPageBuilder = dynamic(
    () => import("@/components/client-pagebuilder"),
    { ssr: false }
);

interface PageBuilderWrapperProps {
    pageBuilder: any[];
    id: string;
    type: string;
}

export function PageBuilderWrapper({ pageBuilder, id, type }: PageBuilderWrapperProps) {
    // This is a client component that wraps the dynamic import
    return (
        <Suspense fallback={<div className="py-8 text-center">Loading content...</div>}>
            <ClientPageBuilder pageBuilder={pageBuilder} id={id} type={type} />
        </Suspense>
    );
} 