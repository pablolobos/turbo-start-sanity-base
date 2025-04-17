"use client";

import { useState, useEffect } from "react";
import { type SanityDocument } from "next-sanity";
import { ProductCard } from "@/components/product-card";
import { client } from "@/lib/sanity/client";
import { PRODUCT_TYPE_CONCEPTS } from "@/lib/sanity/query";

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
        category: string;
    }>;
}

interface ComponentData {
    title?: string;
    productType: 'camiones' | 'buses' | 'motoresPenta';
    taxonomyId: string;
    categories: ProcessedCategory[];
    debugInfo?: any;
}

export function ProductListing(props: ProductListingProps) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [componentData, setComponentData] = useState<ComponentData | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            if (!props.productType || !props.taxonomyFilter?._ref) {
                console.error("Missing required props for ProductListing", props);
                setError("Missing productType or taxonomyFilter");
                setLoading(false);
                return;
            }

            const debugInfo: any = {
                props,
                taxonomyDoc: null,
                productData: null
            };

            try {
                console.log("ProductListing - Fetching with:", {
                    productType: props.productType,
                    taxonomyFilterRef: props.taxonomyFilter._ref
                });

                // 1. Get the taxonomy document
                const taxonomyDoc = await client.fetch(
                    `*[_type == "skosConcept" && _id == $id][0]{
                        _id,
                        prefLabel,
                        conceptId
                    }`,
                    { id: props.taxonomyFilter._ref }
                );

                debugInfo.taxonomyDoc = taxonomyDoc;
                console.log("Taxonomy document:", taxonomyDoc);

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
                    "image": image.asset->url,
                    category
                }`;

                console.log("Executing query:", productsQuery);

                // Fetch products that match this taxonomy
                const products = await client.fetch(
                    productsQuery,
                    {
                        productType: props.productType,
                        taxonomyId: props.taxonomyFilter._ref
                    }
                );

                debugInfo.products = products;
                console.log("Products matching taxonomy:", products);

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
                            category: p.category
                        }))
                    });
                }

                // 3. If no products found directly referencing the taxonomy,
                // try using the category field as a fallback
                if (categories.length === 0) {
                    console.log("No products found via direct reference, trying category field...");

                    // Get category slug from taxonomy name
                    const categorySlug = taxonomyDoc.prefLabel?.toLowerCase().replace(/\s+/g, '-');

                    const productsByCategory = await client.fetch(
                        `*[
                            _type == $productType && 
                            category == $categorySlug
                        ]{
                            _id,
                            title,
                            "slug": slug.current,
                            description,
                            "image": image.asset->url,
                            category
                        }`,
                        {
                            productType: props.productType,
                            categorySlug: categorySlug
                        }
                    );

                    debugInfo.productsByCategory = productsByCategory;
                    console.log("Products matching category:", productsByCategory);

                    if (productsByCategory && productsByCategory.length > 0) {
                        categories.push({
                            _id: taxonomyDoc._id,
                            prefLabel: taxonomyDoc.prefLabel || "Products",
                            conceptId: taxonomyDoc.conceptId || "",
                            products: productsByCategory.map((p: any) => ({
                                _id: p._id,
                                title: p.title,
                                slug: p.slug,
                                description: p.description,
                                image: p.image,
                                category: p.category
                            }))
                        });
                    }
                }

                setComponentData({
                    title: props.title,
                    productType: props.productType,
                    taxonomyId: props.taxonomyFilter._ref,
                    categories: categories,
                    debugInfo
                });
            } catch (err) {
                console.error("Error fetching product data", err);
                setError(`Error fetching data: ${err instanceof Error ? err.message : String(err)}`);

                // Still set debug info even on error
                setComponentData({
                    title: props.title,
                    productType: props.productType,
                    taxonomyId: props.taxonomyFilter._ref,
                    categories: [],
                    debugInfo
                });
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
                <h2 className="mb-4 font-bold text-2xl">Loading Products...</h2>
                <div className="space-y-8 animate-pulse">
                    <div className="bg-gray-200 rounded w-1/4 h-6"></div>
                    <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
                <div className="bg-red-100 p-4 rounded text-red-800">
                    <p>{error}</p>
                    <pre className="mt-2 text-sm">
                        {JSON.stringify({
                            productType: props.productType,
                            taxonomyId: props.taxonomyFilter?._ref
                        }, null, 2)}
                    </pre>
                    <details className="mt-4">
                        <summary className="font-medium cursor-pointer">Debug Information</summary>
                        <pre className="mt-2 max-h-[400px] overflow-auto text-xs">
                            {JSON.stringify(componentData?.debugInfo, null, 2)}
                        </pre>
                    </details>
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
                    <p>No categories found</p>
                    <pre className="mt-2 text-sm">
                        {JSON.stringify({
                            productType: componentData.productType,
                            taxonomyId: componentData.taxonomyId
                        }, null, 2)}
                    </pre>
                    <details className="mt-4">
                        <summary className="font-medium cursor-pointer">Debug Information</summary>
                        <pre className="mt-2 max-h-[400px] overflow-auto text-xs">
                            {JSON.stringify(componentData.debugInfo, null, 2)}
                        </pre>
                    </details>
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
                            <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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