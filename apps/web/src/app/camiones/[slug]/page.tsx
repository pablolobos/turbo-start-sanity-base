import { notFound } from "next/navigation";
import { PageBuilder } from "@/components/pagebuilder";

import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { queryCamionBySlug, queryCamionesPaths } from "@/lib/sanity/query";
import type { QueryCamionBySlugResult } from "@/lib/sanity/sanity.types";
import { getMetaData } from "@/lib/seo";

async function fetchCamionData(slug: string): Promise<{ data: QueryCamionBySlugResult }> {
    const fullSlug = `/camiones/${slug}`;
    return await sanityFetch({
        query: queryCamionBySlug,
        params: { slug: fullSlug },
    });
}

async function fetchCamionPaths(): Promise<{ slug: string }[]> {
    const slugs: (string | null)[] | null = await client.fetch(queryCamionesPaths);
    const paths: { slug: string }[] = [];
    if (slugs) {
        for (const slug of slugs) {
            if (!slug) continue;
            // Extract the part after '/camiones/'
            const slugPart = slug.split("/").filter(Boolean)[1];
            if (slugPart) {
                paths.push({ slug: slugPart });
            }
        }
    }
    return paths;
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}) {
    const { data: camionData } = await fetchCamionData(params.slug);
    if (!camionData) {
        return getMetaData({});
    }
    return getMetaData(camionData);
}

export async function generateStaticParams() {
    return await fetchCamionPaths();
}

export default async function CamionPage({
    params,
}: {
    params: { slug: string };
}) {
    const { data: camionData } = await fetchCamionData(params.slug);

    if (!camionData) {
        return notFound();
    }

    // TODO: Regenerate types (pnpm --filter studio typegen) instead of using 'as any'
    const { title, pageBuilder, _id, _type, description } = camionData as any;

    // Render using PageBuilder if content exists, otherwise show a fallback
    return (
        <>
            {!Array.isArray(pageBuilder) || pageBuilder?.length === 0 ? (
                <div className="flex flex-col justify-center items-center mx-auto p-4 min-h-[50vh] text-center container">
                    <h1 className="mb-4 font-semibold text-2xl capitalize">{title}</h1>
                    <p className="mb-6 text-muted-foreground">
                        Esta página de camión aún no tiene bloques de contenido.
                    </p>
                </div>
            ) : (
                <>
                    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 py-12 lg:py-20 container-padding padding-center max-container">
                        <h1 className="mb-4 font-semibold text-4xl capitalize">{title}</h1>
                        <p className="text-base">{description}</p>
                    </div>
                    <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
                </>
            )}
        </>
    );
} 