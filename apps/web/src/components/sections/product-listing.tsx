"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { client } from "@/lib/sanity/client";

interface ProductListingProps {
    title?: string;
    productType?: 'camiones' | 'buses' | 'motoresPenta';
    taxonomyFilter?: {
        _ref: string;
    };
}

// Define a more specific interface for the processed data
interface ProcessedCategory {
    prefLabel: string;
    conceptId: string;
    _id: string;
    products: Array<{
        _id: string;
        title: string;
        slug: string;
        description: string;
        image: any;
        taxonomy: {
            prefLabel: string;
            conceptId: string;
        };
    }>;
}

interface ComponentData {
    title?: string;
    productType: 'camiones' | 'buses' | 'motoresPenta';
    taxonomyId: string;
    categories: ProcessedCategory[];
}

export function ProductListing(props: ProductListingProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [componentData, setComponentData] = useState<ComponentData | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            if (!props.productType || !props.taxonomyFilter?._ref) {
                setError("Missing productType or taxonomyFilter");
                setLoading(false);
                return;
            }

            try {
                // 1. Get the taxonomy document
                const taxonomyDoc = await client.fetch(
                    `*[_type == "skosConcept" && _id == $id][0]{
                        _id,
                        prefLabel,
                        conceptId
                    }`,
                    { id: props.taxonomyFilter._ref }
                );

                if (!taxonomyDoc) {
                    throw new Error("Taxonomy document not found");
                }

                // 2. Get products that reference this taxonomy
                const productsQuery = `*[
                    _type == $productType && 
                    taxonomias._ref == $taxonomyId
                ]{
                    _id,
                    title,
                    "slug": slug.current,
                    description,
                    "image": image {
                        "asset": asset->,
                        "_type": "image"
                    },
                    "taxonomy": taxonomias->{
                        prefLabel,
                        conceptId
                    }
                }`;

                // Fetch products that match this taxonomy
                const products = await client.fetch(
                    productsQuery,
                    {
                        productType: props.productType,
                        taxonomyId: props.taxonomyFilter._ref
                    }
                );

                // Organize products - since you only have one taxonomy
                // we'll use a single category
                const categoryProducts = products?.filter((p: any) =>
                    p._id && p.title && p.slug && p.description
                );

                const categories: ProcessedCategory[] = [];

                if (categoryProducts && categoryProducts.length > 0) {
                    categories.push({
                        _id: taxonomyDoc._id,
                        prefLabel: taxonomyDoc.prefLabel || "Products",
                        conceptId: taxonomyDoc.conceptId || "",
                        products: categoryProducts.map((p: any) => ({
                            _id: p._id,
                            title: p.title,
                            slug: p.slug,
                            description: p.description,
                            image: p.image,
                            taxonomy: p.taxonomy || {
                                prefLabel: taxonomyDoc.prefLabel,
                                conceptId: taxonomyDoc.conceptId
                            }
                        }))
                    });
                }

                // 3. If no products found directly referencing the taxonomy,
                // we don't need a fallback to category anymore since we're migrating away from it
                if (categories.length === 0) {
                    // Instead, we can try to find products using a broader taxonomy match
                    try {
                        // Get products with taxonomies that are in the same branch/hierarchy
                        const broaderTaxonomyProducts = await client.fetch(
                            `*[
                                _type == $productType && 
                                references(*[
                                    _type == "skosConcept" && 
                                    count(broader[_ref in *[_type == "skosConcept" && _id == $taxonomyId]._id]) > 0
                                ]._id)
                            ]{
                                _id,
                                title,
                                "slug": slug.current,
                                description,
                                "image": image {
                                    "asset": asset->,
                                    "_type": "image"
                                },
                                "taxonomy": taxonomias->{
                                    prefLabel,
                                    conceptId
                                }
                            }`,
                            {
                                productType: props.productType,
                                taxonomyId: props.taxonomyFilter._ref
                            }
                        );

                        if (broaderTaxonomyProducts && broaderTaxonomyProducts.length > 0) {
                            categories.push({
                                _id: taxonomyDoc._id,
                                prefLabel: taxonomyDoc.prefLabel || "Products",
                                conceptId: taxonomyDoc.conceptId || "",
                                products: broaderTaxonomyProducts.map((p: any) => ({
                                    _id: p._id,
                                    title: p.title,
                                    slug: p.slug,
                                    description: p.description,
                                    image: p.image,
                                    taxonomy: p.taxonomy || {
                                        prefLabel: taxonomyDoc.prefLabel,
                                        conceptId: taxonomyDoc.conceptId
                                    }
                                }))
                            });
                        }
                    } catch (err) {
                        console.warn("Error fetching broader taxonomy products:", err);
                    }
                }

                setComponentData({
                    title: props.title,
                    productType: props.productType,
                    taxonomyId: props.taxonomyFilter._ref,
                    categories: categories
                });
            } catch (err) {
                setError(`Error fetching data: ${err instanceof Error ? err.message : String(err)}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [props.productType, props.taxonomyFilter?._ref, props.title]);

    // Show loading state
    if (loading) {
        return (
            <section className="py-12 md:py-16 lg:py-20 container">
                <div className="space-y-8 animate-pulse">
                    <div className="bg-gray-200 rounded w-1/4 h-6"></div>
                    <div className="gap-6 grid grid-cols-1 sm:grid-cols-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-200 rounded h-64"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Show errors
    if (error) {
        return (
            <section className="py-12 md:py-16 lg:py-20 container">
                <h2 className="mb-4 font-bold text-2xl">Error</h2>
                <div className="bg-red-100 p-4 rounded text-red-800">
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    // Render the products
    return (
        <section className="py-12 md:py-16 lg:py-20 container">
            {!componentData ? (
                <div className="bg-yellow-100 p-4 rounded">
                    <p>No data provided</p>
                </div>
            ) : !componentData.categories?.length ? (
                <div className="bg-yellow-100 p-4 rounded">
                    <p>No products found for this category</p>
                </div>
            ) : (
                <>
                    {componentData.title && (
                        <div className="mb-8 text-center">
                            <h2 className="font-bold text-3xl tracking-tight">{componentData.title}</h2>
                        </div>
                    )}

                    {componentData.categories.map((category) => (
                        <div key={category._id} className="mb-12 last:mb-0">
                            <h3 className="mb-6 font-semibold text-2xl">{category.prefLabel}</h3>
                            <div className="gap-6 grid grid-cols-1 sm:grid-cols-2">
                                {category.products?.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={{
                                            ...product,
                                            taxonomy: {
                                                prefLabel: category.prefLabel,
                                                conceptId: category.conceptId
                                            }
                                        }}
                                        productType={componentData.productType}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </>
            )}
        </section>
    );
}