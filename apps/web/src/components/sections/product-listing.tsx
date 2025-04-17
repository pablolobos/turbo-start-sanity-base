"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { client, clientFetch } from "@/lib/sanity/client";

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
                // 1. Get the taxonomy document using clientFetch instead of sanityFetch
                const taxonomyQuery = `*[_type == "skosConcept" && _id == $id][0]{
                    _id,
                    prefLabel,
                    conceptId
                }`;

                const taxonomyResult = await clientFetch(taxonomyQuery, { id: props.taxonomyFilter._ref });
                const taxonomyDoc = taxonomyResult?.data || null;

                if (!taxonomyDoc) {
                    throw new Error("Taxonomy document not found");
                }

                // 2. Get products that reference this taxonomy - using clientFetch
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

                const productsResult = await clientFetch(productsQuery, {
                    productType: props.productType,
                    taxonomyId: props.taxonomyFilter._ref
                });
                const products = productsResult?.data || [];

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
                // we'll try a broader search
                if (categories.length === 0) {
                    // Try a more general query using a simplified approach
                    const broaderProductsQuery = `*[
                        _type == $productType
                    ][0...10]{
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

                    try {
                        const broaderProductsResult = await clientFetch(broaderProductsQuery, {
                            productType: props.productType
                        });
                        const broaderProducts = broaderProductsResult?.data || [];

                        if (broaderProducts && broaderProducts.length > 0) {
                            // Filter to only include products with valid data
                            const validProducts = broaderProducts.filter((p: any) =>
                                p._id && p.title && p.slug && p.description
                            ).map((p: any) => ({
                                _id: p._id,
                                title: p.title,
                                slug: p.slug,
                                description: p.description,
                                image: p.image,
                                taxonomy: p.taxonomy || {
                                    prefLabel: taxonomyDoc.prefLabel,
                                    conceptId: taxonomyDoc.conceptId
                                }
                            }));

                            if (validProducts.length > 0) {
                                categories.push({
                                    _id: taxonomyDoc._id,
                                    prefLabel: taxonomyDoc.prefLabel || "Products",
                                    conceptId: taxonomyDoc.conceptId || "",
                                    products: validProducts
                                });
                            }
                        }
                    } catch (broadErr) {
                        console.warn("Error fetching broader products:", broadErr);
                    }
                }

                setComponentData({
                    title: props.title,
                    productType: props.productType,
                    taxonomyId: props.taxonomyFilter._ref,
                    categories: categories
                });
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                console.error("Error fetching product data:", errorMessage);
                setError(`Error fetching data: ${errorMessage}`);
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