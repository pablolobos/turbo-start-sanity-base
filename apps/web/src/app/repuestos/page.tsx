import { notFound } from "next/navigation";

import { RepuestoCard } from "@/components/repuesto-card";
import { queryRepuestosIndexPageData } from "@/lib/sanity/query";
import { sanityFetch } from "@/lib/sanity/live";
import { getMetaData } from "@/lib/seo";
import { handleErrors } from "@/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { CategoryFilter } from "@/components/category-filter";
import { TitleDescriptionBlock } from "@/components/title-description-block";
import { PageBuilder } from "@/components/pagebuilder";

async function fetchRepuestosData() {
    return await handleErrors(sanityFetch({ query: queryRepuestosIndexPageData }));
}

export async function generateMetadata() {
    const result = await sanityFetch({ query: queryRepuestosIndexPageData });
    return await getMetaData(result?.data ?? {});
}

export default async function RepuestosPage() {
    const [res, err] = await fetchRepuestosData();
    if (err || !res?.data) notFound();

    const {
        repuestos = [],
        title,
        description,
        pageBuilder = [],
        _id,
        _type,
        displayFeaturedCategories,
        featuredCategoriesCount,
        featuredCategories = [] as string[],
    } = res.data;

    // Extract unique categories
    const categories: string[] = [];
    repuestos.forEach((repuesto: any) => {
        if (repuesto.category && !categories.includes(repuesto.category)) {
            categories.push(repuesto.category);
        }
    });

    // Group repuestos by category
    const repuestosByCategory = repuestos.reduce(
        (acc: Record<string, any[]>, repuesto: any) => {
            const category = repuesto.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(repuesto);
            return acc;
        },
        {}
    );

    // Check if we have valid featured data
    const shouldDisplayFeaturedCategories =
        displayFeaturedCategories &&
        featuredCategories.length > 0;

    // If featured categories are enabled, sort them according to the order in the CMS
    const sortedCategories = [...categories];
    if (shouldDisplayFeaturedCategories) {
        sortedCategories.sort((a, b) => {
            const aIndex = featuredCategories.indexOf(a);
            const bIndex = featuredCategories.indexOf(b);

            // If both are featured, sort by their position in featuredCategories
            if (aIndex !== -1 && bIndex !== -1) {
                return aIndex - bIndex;
            }

            // If only a is featured, it comes first
            if (aIndex !== -1) return -1;

            // If only b is featured, it comes first
            if (bIndex !== -1) return 1;

            // If neither is featured, maintain alphabetical order
            return a.localeCompare(b);
        });
    }

    return (
        <main className="bg-background">
            <div className="max-container padding-center section-y-padding">
                {(title || description) && (
                    <div className="mb-8">
                        <TitleDescriptionBlock
                            title={title || "Repuestos Originales Volvo"}
                            description={description || "Descubre nuestra amplia gama de repuestos originales para garantizar el máximo rendimiento de tu vehículo Volvo."}
                            variant="default"
                            headingLevel="h1"
                        />
                    </div>
                )}

                {categories.length > 0 ? (
                    <div className="w-full">
                        {/* Mobile Select Filter - Client Component */}
                        <CategoryFilter categories={sortedCategories} />

                        {/* Desktop Tabs */}
                        <div className="hidden md:block mt-8">
                            <Tabs defaultValue="all" className="w-full">
                                <div className="pb-2">
                                    <TabsList className="flex flex-wrap gap-4 bg-muted mb-6 h-auto">
                                        <TabsTrigger value="all">Todos</TabsTrigger>
                                        {sortedCategories.map((category: string) => (
                                            <TabsTrigger key={category} value={category}>
                                                {category}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </div>

                                <TabsContent value="all" className="mt-0" id="desktop-todos">
                                    {repuestos.length > 0 ? (
                                        <div className="gap-6 lg:gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                            {repuestos.map((repuesto: any) => (
                                                <RepuestoCard key={repuesto._id} repuesto={repuesto} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="py-8 text-muted-foreground text-center">
                                            No hay repuestos disponibles en este momento. Por favor revise más tarde.
                                        </p>
                                    )}
                                </TabsContent>

                                {sortedCategories.map((category: string) => (
                                    <TabsContent
                                        key={category}
                                        value={category}
                                        className="mt-0"
                                        id={`desktop-${category.replace(/\s+/g, '-').toLowerCase()}`}
                                    >
                                        {repuestosByCategory[category] && repuestosByCategory[category].length > 0 ? (
                                            <div className="gap-6 lg:gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                {repuestosByCategory[category].map((repuesto: any) => (
                                                    <RepuestoCard key={repuesto._id} repuesto={repuesto} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="py-8 text-muted-foreground text-center">
                                                No hay repuestos disponibles en esta categoría.
                                            </p>
                                        )}
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>

                        {/* Mobile Category View */}
                        <div className="md:hidden">
                            {/* Todos Section */}
                            <div id="todos" className="category-section">
                                <h2 className="mb-4 font-semibold text-xl">Todos los repuestos</h2>
                                {repuestos.length > 0 ? (
                                    <div className="gap-6 grid grid-cols-1 sm:grid-cols-2">
                                        {repuestos.map((repuesto: any) => (
                                            <RepuestoCard key={repuesto._id} repuesto={repuesto} />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="py-8 text-muted-foreground text-center">
                                        No hay repuestos disponibles en este momento. Por favor revise más tarde.
                                    </p>
                                )}
                            </div>

                            {/* Individual Category Sections */}
                            {sortedCategories.map((category: string) => {
                                const categoryId = category.replace(/\s+/g, '-').toLowerCase();
                                return (
                                    <div
                                        key={category}
                                        id={categoryId}
                                        className="category-section"
                                        style={{ display: 'none' }}
                                    >
                                        <h2 className="mb-4 font-semibold text-xl">{category}</h2>
                                        {repuestosByCategory[category] && repuestosByCategory[category].length > 0 ? (
                                            <div className="gap-6 grid grid-cols-1 sm:grid-cols-2">
                                                {repuestosByCategory[category].map((repuesto: any) => (
                                                    <RepuestoCard key={repuesto._id} repuesto={repuesto} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="py-8 text-muted-foreground text-center">
                                                No hay repuestos disponibles en esta categoría.
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <p className="py-8 text-muted-foreground text-center">
                        No hay categorías de repuestos disponibles en este momento.
                    </p>
                )}
            </div>

            {pageBuilder && pageBuilder.length > 0 && (
                <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
            )}
        </main>
    );
} 