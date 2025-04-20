import { notFound } from "next/navigation";
import type { Metadata } from "next";

type PageParams = {
    slug: string;
};

type Props = {
    params: Promise<PageParams>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageBuilder } from "@/components/pagebuilder";
import { TitleDescriptionBlock } from "@/components/title-description-block";
import { CotizadorButton } from "@/components/cotizador-button";

import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { getMetaData } from "@/lib/seo";
import { CAMION_BY_SLUG_QUERY } from "@/lib/sanity/query";

// Define the structure for a breadcrumb item
interface BreadcrumbItem {
    label: string;
    href: string;
}

// Define types for our data
interface CamionData {
    _id: string;
    _type: string;
    title: string;
    subtitle?: string;
    description?: string;
    image?: any;
    pageBuilder?: any[];
    taxonomias?: { _ref: string };
    slug: { current: string };
}

interface TaxonomyData {
    _id: string;
    prefLabel: string;
    slug: string;
    iri: string;
}

// GROQ query to fetch all camiones slugs for static generation
const queryCamionesPaths = `*[_type == "camiones" && defined(slug.current)].slug.current`;

// Helper function to generate breadcrumbs
function generateBreadcrumbs(
    categoryData: TaxonomyData | null,
    currentTitle: string
): BreadcrumbItem[] {
    return [
        { label: "Camiones", href: "/camiones" },
        ...(categoryData ? [{
            label: categoryData.prefLabel,
            href: `/${categoryData.slug}`
        }] : []),
        { label: currentTitle, href: "#" }
    ];
}

async function fetchCamionData(slug: string): Promise<{ data: CamionData | null }> {
    const fullSlug = `/camiones/${slug}`;
    try {
        const response = await sanityFetch({
            query: CAMION_BY_SLUG_QUERY,
            params: { slug: fullSlug },
        });
        return { data: response.data as CamionData };
    } catch (error) {
        console.error("Error fetching camion data:", error);
        return { data: null };
    }
}

async function fetchTaxonomyData(taxonomyRef: string): Promise<TaxonomyData | null> {
    if (!taxonomyRef) return null;

    try {
        const taxonomyDoc = await client.fetch(
            `*[_type == "skosConcept" && _id == $id][0]{
                "_id": _id,
                "prefLabel": prefLabel,
                "slug": lower(prefLabel),
                "iri": "/camiones/" + lower(prefLabel)
            }`,
            { id: taxonomyRef }
        );

        if (taxonomyDoc) {
            return {
                ...taxonomyDoc,
                slug: taxonomyDoc.slug?.replace(/\s+/g, '-'),
                iri: taxonomyDoc.iri?.replace(/\s+/g, '-')
            };
        }
    } catch (error) {
        console.error("Error fetching taxonomy data:", error);
    }

    return null;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<PageParams>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const { data } = await fetchCamionData(resolvedParams.slug);
    return getMetaData(data || {});
}

export async function generateStaticParams(): Promise<PageParams[]> {
    try {
        const slugs = await client.fetch(queryCamionesPaths);
        return (slugs || [])
            .filter((slug: string) => slug !== null)
            .map((slug: string) => {
                const slugPart = slug.split("/").filter(Boolean)[1];
                return { slug: slugPart };
            });
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

export default async function CamionPage({
    params,
}: {
    params: Promise<PageParams>
}) {
    const resolvedParams = await params;
    const { data } = await fetchCamionData(resolvedParams.slug);

    if (!data) {
        return notFound();
    }

    // Destructure the data
    const { title, subtitle, pageBuilder, _id, description, image, taxonomias } = data;

    // Fetch taxonomy data if it exists
    let taxonomyData = null;

    if (taxonomias?._ref) {
        taxonomyData = await fetchTaxonomyData(taxonomias._ref);
    }

    // Generate breadcrumbs
    const breadcrumbItems = generateBreadcrumbs(taxonomyData, title);

    return (
        <>
            <div className="pt-8 lg:pt-12 container-padding padding-center max-container">
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            {/* Fallback for empty content */}
            {(!pageBuilder || pageBuilder.length === 0) && !image ? (
                <div className="flex flex-col justify-center items-center mx-auto p-4 min-h-[50vh] text-center container">
                    <h1 className="mb-4 font-semibold text-2xl capitalize">{title}</h1>
                    <p className="mb-6 text-muted-foreground">
                        Este camión aún no tiene bloques de contenido.
                    </p>
                    <div className="mt-6">
                        <CotizadorButton buttonVariant="default" pageTitle={title} />
                    </div>
                </div>
            ) : (
                <>
                    {/* Title and description block */}
                    {(title || description) && (
                        <div className="mb-8">
                            <TitleDescriptionBlock
                                title={title}
                                subtitle={subtitle}
                                description={description}
                            />
                            <div className="flex justify-end mx-auto mt-6 px-4 max-w-screen-xl">
                                <CotizadorButton pageTitle={title} />
                            </div>
                        </div>
                    )}

                    {/* Page builder content */}
                    {pageBuilder && pageBuilder.length > 0 && (
                        <PageBuilder
                            pageBuilder={pageBuilder}
                            id={_id}
                            type="camiones"
                        />
                    )}
                </>
            )}
        </>
    );
} 