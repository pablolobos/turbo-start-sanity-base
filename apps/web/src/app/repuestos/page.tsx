import { RepuestoCard } from "@/components/repuesto-card";
import { queryRepuestosCategories, queryRepuestosData } from "@/lib/sanity/query";
import { client } from "@/lib/sanity/client";
import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { CategoryFilter } from "@/components/category-filter";
import { TitleDescriptionBlock } from "@/components/title-description-block";

export const metadata: Metadata = {
    title: "Repuestos | Volvo Chile",
    description: "Explora nuestra amplia gama de repuestos originales Volvo",
};

export default async function RepuestosPage() {
    const repuestos = await client.fetch(queryRepuestosData) || [];
    const categoriesData = await client.fetch(queryRepuestosCategories) || [];

    // Extract unique categories
    const categories: string[] = [];
    categoriesData.forEach((item: { category: string }) => {
        if (!categories.includes(item.category)) {
            categories.push(item.category);
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

    return (
        <main className="flex-1">
            <div className="flex flex-col gap-8 lg:gap-20 max-container padding-center section-y-padding">
                <div className="space-y-4">
                    <TitleDescriptionBlock
                        variant="default"
                        title="Repuestos Originales Volvo"
                        description="Descubre nuestra amplia gama de repuestos originales para garantizar el máximo rendimiento de tu vehículo Volvo."
                    />
                </div>

                {categories.length > 0 ? (
                    <div className="w-full">
                        {/* Mobile Select Filter - Client Component */}
                        <CategoryFilter categories={categories} />

                        {/* Desktop Tabs */}
                        <div className="hidden md:block">
                            <Tabs defaultValue="all" className="w-full">
                                <div className="pb-2">
                                    <TabsList className="flex flex-wrap gap-4 bg-muted mb-6 h-auto">
                                        <TabsTrigger value="all">Todos</TabsTrigger>
                                        {categories.map((category: string) => (
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

                                {categories.map((category: string) => (
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
                            {categories.map((category: string) => {
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
                )
                }
            </div >
        </main >
    );
} 