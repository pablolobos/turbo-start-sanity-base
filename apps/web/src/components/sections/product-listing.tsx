"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/product-card";
import { client, clientFetch } from "@/lib/sanity/client";
import { useSearchParams } from 'next/navigation';

interface ProductListingProps {
    title?: string;
    productType?: 'camiones' | 'buses' | 'motoresPenta';
    taxonomyFilter?: {
        _ref: string;
    };
    // New prop for initial/static data
    initialData?: ComponentData;
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

// Cache for product data to prevent redundant fetches
const dataCache = new Map<string, ComponentData>();

export function ProductListing(props: ProductListingProps) {
    // Use initialData if provided
    const [loading, setLoading] = useState(!props.initialData);
    const [error, setError] = useState<string | null>(null);
    const [componentData, setComponentData] = useState<ComponentData | undefined>(props.initialData);

    // Use search params to detect navigation changes
    const searchParams = useSearchParams();

    // Key used for caching
    const cacheKey = `${props.productType}-${props.taxonomyFilter?._ref}`;

    useEffect(() => {
        // If we already have initialData, no need to fetch
        if (props.initialData) {
            setComponentData(props.initialData);
            setLoading(false);
            return;
        }

        // Check cache first
        if (dataCache.has(cacheKey)) {
            setComponentData(dataCache.get(cacheKey));
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            if (!props.productType || !props.taxonomyFilter?._ref) {
                setError("Missing productType or taxonomyFilter");
                setLoading(false);
                return;
            }

            try {
                // More efficient query with projections for only what's needed
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

                const productsResult = await clientFetch(productsQuery, {
                    productType: props.productType,
                    taxonomyId: props.taxonomyFilter._ref
                });

                const products = productsResult?.data || [];

                if (products && products.length > 0) {
                    // Extract taxonomy details from the first product
                    const taxonomyData = products[0].taxonomyDetails || {
                        _id: props.taxonomyFilter._ref,
                        prefLabel: "Products",
                        conceptId: ""
                    };

                    // Create a category for the products
                    const category: ProcessedCategory = {
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

                    const data = {
                        title: props.title,
                        productType: props.productType,
                        taxonomyId: props.taxonomyFilter._ref,
                        categories: [category]
                    };

                    // Store in cache
                    dataCache.set(cacheKey, data);
                    setComponentData(data);
                } else {
                    // More streamlined fallback logic for all products 
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

                    const allProductsResult = await clientFetch(allProductsQuery, {
                        productType: props.productType
                    });

                    const allProducts = allProductsResult?.data || [];

                    if (allProducts && allProducts.length > 0) {
                        // Category for all products
                        const category: ProcessedCategory = {
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
                        };

                        const data = {
                            title: props.title,
                            productType: props.productType,
                            taxonomyId: props.taxonomyFilter._ref,
                            categories: [category]
                        };

                        // Store in cache
                        dataCache.set(cacheKey, data);
                        setComponentData(data);
                    } else {
                        // No products found
                        const data = {
                            title: props.title,
                            productType: props.productType,
                            taxonomyId: props.taxonomyFilter._ref,
                            categories: []
                        };

                        // Store in cache
                        dataCache.set(cacheKey, data);
                        setComponentData(data);
                    }
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                console.error("Error fetching product data:", errorMessage);
                setError(`Error fetching data: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [props.productType, props.taxonomyFilter?._ref, props.title, cacheKey, props.initialData]);

    // Only render loading state on first load
    if (loading) {
        return (
            <section className="container section-y-padding">
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