import { Container } from "@/components/ui/container";
import { RepuestoCard } from "@/components/repuesto-card";
import { queryRepuestosCategories, queryRepuestosData } from "@/lib/sanity/query";
import { client } from "@/lib/sanity/client";
import { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";

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
                    <h1 className="heading-1">
                        Repuestos Originales Volvo
                    </h1>
                    <p className="text-muted-foreground text-xl">
                        Descubre nuestra amplia gama de repuestos originales para garantizar el máximo rendimiento de tu vehículo Volvo.
                    </p>
                </div>

                {categories.length > 0 ? (
                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="flex flex-wrap gap-2 mb-8">
                            <TabsTrigger value="all">Todos</TabsTrigger>
                            {categories.map((category: string) => (
                                <TabsTrigger key={category} value={category}>
                                    {category}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent value="all" className="mt-0">
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
                            <TabsContent key={category} value={category} className="mt-0">
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
                ) : (
                    <p className="py-8 text-muted-foreground text-center">
                        No hay categorías de repuestos disponibles en este momento.
                    </p>
                )}
            </div>
        </main>
    );
} 