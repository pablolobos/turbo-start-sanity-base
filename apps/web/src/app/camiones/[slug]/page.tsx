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
import { PageBuilder } from "@/components/pagebuilder";
import { TitleDescriptionBlock } from "@/components/title-description-block";
import { CotizadorButton } from "@/components/cotizador-button";
import { ProductListing } from "@/components/sections/product-listing";

import { client } from "@/lib/sanity/client";
import { sanityFetch } from "@/lib/sanity/live";
import { queryCamionOrPageBySlug, queryCamionesPaths } from "@/lib/sanity/query";
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
    // Use the base path for the main trucks page as the category parent
    const categoryBase = "/camiones";

    const staticCrumbs: BreadcrumbItem[] = [
        { label: "Camiones", href: "/camiones" },
    ];

    // Only add category path for actual 'camiones' type
    if (docType === "camiones" && categoryData) {
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
    params: Promise<PageParams>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const { data } = await fetchCamionOrPageData(resolvedParams.slug);
    if (!data) {
        return getMetaData({});
    }
    return getMetaData(data);
}

export async function generateStaticParams(): Promise<PageParams[]> {
    return await fetchCamionAndPagePaths();
}

export default async function CamionPage({
    params,
    searchParams,
}: Props) {
    const resolvedParams = await params;
    const { data } = await fetchCamionOrPageData(resolvedParams.slug);

    if (!data) {
        return notFound();
    }

    // Destructure the data
    const { title, pageBuilder, _id, _type, description, image, subtitle } = data as any;

    // Get taxonomy data from the document if it exists
    let taxonomyData = null;
    let productData = null;

    if (_type === "camiones" && data.taxonomias) {
        // Fetch the taxonomy details
        const taxonomyRef = data.taxonomias._ref;
        if (taxonomyRef) {
            try {
                const taxonomyDoc = await client.fetch(
                    `*[_type == "skosConcept" && _id == $id][0]{
                        "label": prefLabel,
                        "slug": lower(prefLabel),
                        "iri": "/camiones/" + lower(prefLabel)
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

                // Pre-fetch product data for static generation
                productData = await fetchCategoryProducts(taxonomyRef, "camiones");
            } catch (error) {
                console.error("Error fetching taxonomy data:", error);
                // Fallback to default taxonomy data
                taxonomyData = {
                    label: "Productos",
                    slug: "productos",
                    iri: "/camiones/productos"
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
                    <div className="mt-6">
                        <CotizadorButton buttonVariant="default" pageTitle={title} />
                    </div>
                </div>
            ) : _type === "camiones" ? (
                // Specific layout for 'camiones' type
                <>
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

                    {/* Check if a block in pageBuilder is ProductListing */}
                    {pageBuilder && pageBuilder.length > 0 ? (
                        pageBuilder.some((block: any) => block._type === 'productListing') ? (
                            <PageBuilder pageBuilder={pageBuilder.map((block: any) => {
                                // If it's a ProductListing, pass the initial data
                                if (block._type === 'productListing' && productData) {
                                    return {
                                        ...block,
                                        initialData: productData
                                    };
                                }
                                return block;
                            })} id={_id} type={_type} />
                        ) : (
                            <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
                        )
                    ) : null}

                    {/* If there's taxonomy data but no ProductListing in pageBuilder, add one */}
                    {taxonomyData && (!pageBuilder || !pageBuilder.some((block: any) => block._type === 'productListing')) && (
                        <div className="mt-12">
                            {productData && <ProductListing
                                productType="camiones"
                                taxonomyFilter={{ _ref: data.taxonomias._ref }}
                                title={`Productos ${taxonomyData.label}`}
                                initialData={productData}
                            />}
                        </div>
                    )}
                </>
            ) : (
                // Default rendering for 'page' type using PageBuilder
                <>
                    <div className="flex justify-end mx-auto mb-8 px-4 max-w-screen-xl">
                        <CotizadorButton buttonVariant="default" pageTitle={title} />
                    </div>
                    {pageBuilder && pageBuilder.length > 0 &&
                        <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
                    }
                </>
            )}
        </>
    );
}

// Function to fetch product data for static generation
async function fetchCategoryProducts(taxonomyId: string, productType: 'camiones' | 'buses' | 'motoresPenta') {
    const productsQuery = `*[
        _type == $productType && 
        taxonomias._ref == $taxonomyId
    ] | order(title asc) {
        _id,
        title,
        "slug": slug.current,
        description,
        "image": image {
            "asset": asset->,
            "_type": "image"
        },
        "taxonomyDetails": coalesce(
            taxonomias->{
                "_id": _id,
                "prefLabel": prefLabel,
                "conceptId": conceptId
            }, 
            {"_id": $taxonomyId, "prefLabel": "Products", "conceptId": ""}
        )
    }`;

    try {
        const products = await client.fetch(productsQuery, {
            productType,
            taxonomyId
        });

        if (products && products.length > 0) {
            // Extract taxonomy details from the first product
            const taxonomyData = products[0].taxonomyDetails || {
                _id: taxonomyId,
                prefLabel: "Products",
                conceptId: ""
            };

            // Create a category for the products
            const category = {
                _id: taxonomyData._id,
                prefLabel: taxonomyData.prefLabel || "Products",
                conceptId: taxonomyData.conceptId || "",
                products: products.map((p: any) => ({
                    _id: p._id,
                    title: p.title,
                    slug: p.slug,
                    description: p.description,
                    image: p.image,
                    taxonomy: {
                        prefLabel: taxonomyData.prefLabel,
                        conceptId: taxonomyData.conceptId
                    }
                }))
            };

            return {
                title: taxonomyData.prefLabel,
                productType,
                taxonomyId,
                categories: [category]
            };
        }

        // Fallback if specific taxonomy products not found
        const allProductsQuery = `*[
            _type == $productType
        ] | order(title asc)[0...10]{
            _id,
            title,
            "slug": slug.current,
            description,
            "image": image {
                "asset": asset->,
                "_type": "image"
            }
        }`;

        const allProducts = await client.fetch(allProductsQuery, { productType });

        if (allProducts && allProducts.length > 0) {
            return {
                title: "All Products",
                productType,
                taxonomyId,
                categories: [{
                    _id: 'all',
                    prefLabel: "All Products",
                    conceptId: "",
                    products: allProducts.map((p: any) => ({
                        _id: p._id,
                        title: p.title,
                        slug: p.slug,
                        description: p.description,
                        image: p.image,
                        taxonomy: {
                            prefLabel: "All Products",
                            conceptId: ""
                        }
                    }))
                }]
            };
        }

        return {
            title: "",
            productType,
            taxonomyId,
            categories: []
        };
    } catch (error) {
        console.error("Error pre-fetching products:", error);
        return {
            title: "",
            productType,
            taxonomyId,
            categories: []
        };
    }
} 