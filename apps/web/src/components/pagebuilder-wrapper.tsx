"use client";

import { Suspense } from "react";
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
    // Simple wrapper to render the client component
    return <ClientPageBuilder pageBuilder={pageBuilder} id={id} type={type} />;
} 