import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageBuilder } from "@/components/pagebuilder";

import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { queryCamionOrPageBySlug, queryCamionesPaths } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";

// Define the structure for a breadcrumb item
interface BreadcrumbItem {
    label: string;
    href: string;
}

// Helper function to generate breadcrumbs from category data
function generateBreadcrumbs(
    categoryData: any,
    currentTitle: string,
    docType: string,
): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [];
    // Use the base path for the main trucks page as the category parent
    const categoryBase = "/camiones";

    const staticCrumbs: BreadcrumbItem[] = [
        { label: "Camiones", href: "/camiones" },
    ];

    // Only add category path for actual 'camiones' type
    if (docType === "camiones" && categoryData) {
        let current = categoryData;
        const ancestors: BreadcrumbItem[] = [];
        while (current) {
            if (current.label) {
                let href = "#"; // Default to no link
                if (current.iri) {
                    try {
                        // Parse the IRI and get the pathname
                        const url = new URL(current.iri);
                        href = url.pathname; // Use the path part, e.g., /camiones/larga-distancia
                    } catch (e) {
                        console.error("Error parsing IRI for breadcrumb:", current.iri, e);
                        // Keep href as "#" if IRI is invalid
                    }
                }
                ancestors.push({
                    label: current.label,
                    href: href,
                });
            }
            current = current.parent;
        }
        breadcrumbs.push(...ancestors.reverse());
    }

    const finalBreadcrumbs = [
        ...staticCrumbs,
        ...breadcrumbs,
        { label: currentTitle, href: "#" },
    ];

    return finalBreadcrumbs.filter((crumb) => crumb.label);
}

async function fetchCamionOrPageData(slug: string): Promise<{ data: any }> {
    const fullSlug = `/camiones/${slug}`;
    return await sanityFetch({
        query: queryCamionOrPageBySlug,
        params: { slug: fullSlug },
    });
}

async function fetchCamionAndPagePaths(): Promise<{ slug: string }[]> {
    // Fetch slugs for 'camiones' documents
    const camionSlugsResult: (string | null)[] | null = await client.fetch(queryCamionesPaths);
    // Filter out nulls explicitly
    const camionSlugs: string[] = (camionSlugsResult ?? []).filter((s): s is string => s !== null);

    // Fetch slugs for 'page' documents under /camiones/
    const pageSlugsQuery = `*[_type == "page" && defined(slug.current) && slug.current match "/camiones/*"].slug.current`;
    const pageSlugsResult: (string | null)[] | null = await client.fetch(pageSlugsQuery);
    // Filter out nulls explicitly
    const pageSlugs: string[] = (pageSlugsResult ?? []).filter((s): s is string => s !== null);

    const combinedSlugs = [...camionSlugs, ...pageSlugs];

    const paths: { slug: string }[] = [];
    for (const slug of combinedSlugs) {
        if (!slug) continue;
        const slugPart = slug.split("/").filter(Boolean)[1]; // Get part after /camiones/
        if (slugPart) {
            paths.push({ slug: slugPart });
        }
    }
    // Deduplicate paths in case a page and truck share the same final slug segment
    const uniquePaths = Array.from(new Map(paths.map(p => [p.slug, p])).values());
    return uniquePaths;
}

export async function generateMetadata({
    params,
}: {
    params: { slug: string };
}) {
    const { data } = await fetchCamionOrPageData(params.slug);
    if (!data) {
        return getMetaData({});
    }
    return getMetaData(data);
}

export async function generateStaticParams() {
    return await fetchCamionAndPagePaths();
}

export default async function CamionPage({
    params,
}: {
    params: { slug: string };
}) {
    const { data } = await fetchCamionOrPageData(params.slug);

    if (!data) {
        return notFound();
    }

    // TODO: Use generated types and refine destructuring
    const { title, pageBuilder, _id, _type, description, categoryData, image } = data as any;

    // Generate breadcrumbs, passing the document type
    const breadcrumbItems = generateBreadcrumbs(categoryData, title, _type);

    // Conditional rendering based on type
    return (
        <>
            <div className="pt-8 lg:pt-12 container-padding padding-center max-container">
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            {/* Render PageBuilder directly if it's a page type or a truck without specific layout */}
            {(_type === "page" || !image) && (!Array.isArray(pageBuilder) || pageBuilder?.length === 0) ? (
                // Fallback for empty content (applies to both types)
                <div className="flex flex-col justify-center items-center mx-auto p-4 min-h-[50vh] text-center container">
                    <h1 className="mb-4 font-semibold text-2xl capitalize">{title}</h1>
                    <p className="mb-6 text-muted-foreground">
                        {_type === 'page'
                            ? "Esta página aún no tiene bloques de contenido."
                            : "Este camión aún no tiene bloques de contenido."
                        }
                    </p>
                </div>
            ) : _type === "camiones" ? (
                // Specific layout for 'camiones' type
                <>
                    <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 py-12 lg:py-20 container-padding padding-center max-container">
                        <h1 className="mb-4 font-semibold text-4xl capitalize">{title}</h1>
                        {description && <p className="text-base">{description}</p>}
                        {/* TODO: Add image display here if needed for truck layout */}
                    </div>
                    {/* Render page builder content for trucks */}
                    {pageBuilder && pageBuilder.length > 0 &&
                        <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
                    }
                </>
            ) : (
                // Default rendering for 'page' type using PageBuilder
                pageBuilder && pageBuilder.length > 0 &&
                <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
            )}
        </>
    );
} 