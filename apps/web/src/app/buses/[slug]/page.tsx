import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Suspense } from "react";

type PageParams = {
    slug: string;
};

type Props = {
    params: Promise<PageParams>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CotizadorButton } from "@/components/cotizador-button";
import { PageBuilderWrapper } from "@/components/pagebuilder-wrapper";

import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBusOrPageBySlug, queryBusesPaths } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

// Define the structure for a breadcrumb item
interface BreadcrumbItem {
    label: string;
    href: string;
}

// Helper function to generate breadcrumbs from taxonomy data
function generateBreadcrumbs(
    categoryData: any,
    currentTitle: string,
    docType: string,
): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [];
    // Use the base path for the main buses page as the category parent
    const categoryBase = "/buses";

    const staticCrumbs: BreadcrumbItem[] = [
        { label: "Buses", href: "/buses" },
    ];

    // Only add category path for actual 'buses' type
    if (docType === "buses" && categoryData) {
        // Add the category if it exists
        if (categoryData.label) {
            breadcrumbs.push({
                label: categoryData.label, // Use the taxonomy prefLabel directly
                href: categoryData.iri || `${categoryBase}/${categoryData.slug}`
            });
        }
    }

    const finalBreadcrumbs = [
        ...staticCrumbs,
        ...breadcrumbs,
        { label: currentTitle, href: "#" },
    ];

    return finalBreadcrumbs.filter((crumb) => crumb.label);
}

async function fetchBusOrPageData(slug: string): Promise<{ data: any }> {
    const fullSlug = `/buses/${slug}`;
    return await sanityFetch({
        query: queryBusOrPageBySlug,
        params: { slug: fullSlug },
    });
}

async function fetchBusAndPagePaths(): Promise<{ slug: string }[]> {
    // Fetch slugs for 'buses' documents
    const busSlugsResult: (string | null)[] | null = await client.fetch(queryBusesPaths);
    // Filter out nulls explicitly
    const busSlugs: string[] = (busSlugsResult ?? []).filter((s): s is string => s !== null);

    // Fetch slugs for 'page' documents under /buses/
    const pageSlugsQuery = `*[_type == "page" && defined(slug.current) && slug.current match "/buses/*"].slug.current`;
    const pageSlugsResult: (string | null)[] | null = await client.fetch(pageSlugsQuery);
    // Filter out nulls explicitly
    const pageSlugs: string[] = (pageSlugsResult ?? []).filter((s): s is string => s !== null);

    const combinedSlugs = [...busSlugs, ...pageSlugs];

    const paths: { slug: string }[] = [];
    for (const slug of combinedSlugs) {
        if (!slug) continue;
        const slugPart = slug.split("/").filter(Boolean)[1]; // Get part after /buses/
        if (slugPart) {
            paths.push({ slug: slugPart });
        }
    }
    // Deduplicate paths in case a page and bus share the same final slug segment
    const uniquePaths = Array.from(new Map(paths.map(p => [p.slug, p])).values());
    return uniquePaths;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<PageParams>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const { data } = await fetchBusOrPageData(resolvedParams.slug);
    if (!data) {
        return getMetaData({});
    }
    return getMetaData(data);
}

export async function generateStaticParams(): Promise<PageParams[]> {
    return await fetchBusAndPagePaths();
}

export default async function BusPage({
    params,
    searchParams,
}: Props) {
    const resolvedParams = await params;
    const { data } = await fetchBusOrPageData(resolvedParams.slug);

    if (!data) {
        return notFound();
    }

    // Destructure the data
    const { title, pageBuilder, _id, _type, description, image } = data as any;

    // Get taxonomy data from the document if it exists
    let taxonomyData = null;
    if (_type === "buses" && data.taxonomias) {
        // Fetch the taxonomy details
        const taxonomyRef = data.taxonomias._ref;
        if (taxonomyRef) {
            const taxonomyDoc = await client.fetch(
                `*[_type == "skosConcept" && _id == $id][0]{
                    "label": prefLabel,
                    "slug": lower(prefLabel),
                    "iri": "/buses/" + lower(prefLabel)
                }`,
                { id: taxonomyRef }
            );

            // Format the slug and IRI in JavaScript
            if (taxonomyDoc) {
                taxonomyData = {
                    ...taxonomyDoc,
                    slug: taxonomyDoc.slug?.replace(/\s+/g, '-'),
                    iri: taxonomyDoc.iri?.replace(/\s+/g, '-')
                };
            }
        }
    }

    // Generate breadcrumbs, passing the document type
    const breadcrumbItems = generateBreadcrumbs(taxonomyData, title, _type);

    // Conditional rendering based on type
    return (
        <>
            <div className="pt-8 lg:pt-12 container-padding padding-center max-container">
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            {/* Render PageBuilder directly if it's a page type or a bus without specific layout */}
            {(_type === "page" || !image) && (!Array.isArray(pageBuilder) || pageBuilder?.length === 0) ? (
                // Fallback for empty content (applies to both types)
                <div className="flex flex-col justify-center items-center mx-auto p-4 min-h-[50vh] text-center container">
                    <h1 className="mb-4 font-semibold text-2xl capitalize">{title}</h1>
                    <p className="mb-6 text-muted-foreground">
                        {_type === 'page'
                            ? "Esta página aún no tiene bloques de contenido."
                            : "Este bus aún no tiene bloques de contenido."
                        }
                    </p>
                    <div className="mt-6">
                        <CotizadorButton pageTitle={title} />
                    </div>
                </div>
            ) : _type === "buses" ? (
                // Specific layout for 'buses' type
                <>
                    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 py-12 lg:py-20 container-padding padding-center max-container">
                        <div>
                            <h1 className="mb-4 font-semibold text-4xl capitalize">{title}</h1>
                            {description && <p className="text-base">{description}</p>}
                            <div className="mt-6">
                                <CotizadorButton buttonVariant="default" pageTitle={title} />
                            </div>
                        </div>
                        {/* TODO: Add image display here if needed for bus layout */}
                    </div>
                    {/* Render page builder content for buses */}
                    {pageBuilder && pageBuilder.length > 0 &&
                        <PageBuilderWrapper pageBuilder={pageBuilder} id={_id} type={_type} />
                    }
                </>
            ) : (
                // Default rendering for 'page' type using PageBuilder
                <>
                    <div className="flex justify-end mx-auto mb-8 px-4 max-w-screen-xl">
                        <CotizadorButton buttonVariant="default" pageTitle={title} />
                    </div>
                    {pageBuilder && pageBuilder.length > 0 &&
                        <PageBuilderWrapper pageBuilder={pageBuilder} id={_id} type={_type} />
                    }
                </>
            )}
        </>
    );
} 