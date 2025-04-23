import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { SanityImage } from "@/components/sanity-image";
import { queryRepuestoBySlug, queryRepuestosPaths } from "@/lib/sanity/query";
import { client } from "@/lib/sanity/client";
import { Metadata } from "next";
import { PortableText } from "next-sanity";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageBuilder } from "@/components/pagebuilder";

type PageParams = {
    slug: string;
};

type Props = {
    params: Promise<PageParams>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

interface Repuesto {
    _id: string;
    title: string;
    slug: string;
    category: string;
    content: any[];
    image: any;
    pageBuilder?: any[];
    globalPageBuilder?: any[];
}

export async function generateStaticParams() {
    const slugs = await client.fetch(queryRepuestosPaths);
    return slugs.map((slug: string) => ({ slug }));
}

export async function generateMetadata({
    params
}: {
    params: Promise<PageParams>
}): Promise<Metadata> {
    const resolvedParams = await params;
    const repuesto = await client.fetch<Repuesto | null>(queryRepuestoBySlug, { slug: resolvedParams.slug });

    if (!repuesto) {
        return {
            title: "Repuesto no encontrado | Volvo Chile",
            description: "El repuesto que buscas no existe",
        };
    }

    return {
        title: `${repuesto.title} | Repuestos | Volvo Chile`,
        description: "Repuesto original Volvo",
    };
}

export default async function RepuestoPage({
    params
}: {
    params: Promise<PageParams>
}) {
    const resolvedParams = await params;
    const repuesto = await client.fetch<Repuesto | null>(queryRepuestoBySlug, { slug: resolvedParams.slug });

    if (!repuesto) {
        notFound();
    }

    return (
        <main className="flex-1">
            <Container className="py-12 md:py-16">
                <div className="space-y-8">
                    <div className="flex items-center space-x-2">
                        <Link
                            href="/repuestos"
                            className="inline-flex items-center font-medium text-primary text-sm hover:underline-dotted"
                        >
                            <ChevronLeft className="mr-1 w-4 h-4" />
                            Volver a repuestos
                        </Link>
                    </div>

                    <div className="gap-8 grid md:grid-cols-2">
                        <div className="rounded-none w-full lg:max-w-xl aspect-square overflow-hidden">
                            {repuesto.image ? (
                                <SanityImage
                                    asset={repuesto.image}
                                    alt={repuesto.title}
                                    width={800}
                                    height={800}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex justify-center items-center bg-gray-100 w-full h-full">
                                    <span className="text-gray-400">Repuesto sin imagen</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="font-medium text-muted-foreground text-sm">
                                    {repuesto.category}
                                </div>
                                <h1 className="heading-2">
                                    {repuesto.title}
                                </h1>
                            </div>

                            <div className="max-w-none prose prose-gray">
                                {repuesto.content && repuesto.content.length > 0 && (
                                    <PortableText value={repuesto.content} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Individual page builder blocks (if any) */}
            {repuesto.pageBuilder && repuesto.pageBuilder.length > 0 && (
                <PageBuilder pageBuilder={repuesto.pageBuilder} id={repuesto._id} type="repuestos" />
            )}

            {/* Global page builder blocks from repuestosIndex */}
            {repuesto.globalPageBuilder && repuesto.globalPageBuilder.length > 0 && (
                <PageBuilder pageBuilder={repuesto.globalPageBuilder} id={repuesto._id} type="repuestos" />
            )}
        </main>
    );
} 