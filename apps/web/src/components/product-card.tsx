import { SanityImage } from "@/components/sanity-image";
import Link from "next/link";

interface ProductCardProps {
    product: {
        _id: string;
        title: string;
        slug: string;
        description: string;
        image: any; // Update this to match your Sanity image type
        taxonomy: {
            prefLabel: string;
            conceptId: string;
        };
    };
    productType: 'camiones' | 'buses' | 'motoresPenta';
}

export function ProductCard({ product, productType }: ProductCardProps) {
    if (!product) {
        return (
            <article className="gap-4 grid grid-cols-1 w-full">
                <div className="bg-muted rounded-none h-48 animate-pulse" />
                <div className="space-y-2">
                    <div className="bg-muted rounded-none w-24 h-4 animate-pulse" />
                    <div className="bg-muted rounded-none w-full h-6 animate-pulse" />
                    <div className="bg-muted rounded-none w-3/4 h-4 animate-pulse" />
                </div>
            </article>
        );
    }

    const { title, slug, description, image, taxonomy } = product;

    const routes = {
        camiones: '/camiones',
        buses: '/buses',
        motoresPenta: '/motores-penta'
    };

    return (
        <article className="content-start gap-2 grid grid-cols-1 grid-rows-[auto_auto_1fr] w-full">
            <div className="relative rounded-none w-full h-auto aspect-[16/9] overflow-hidden">
                <SanityImage
                    asset={image}
                    width={800}
                    height={400}
                    alt={title}
                    className="bg-gray-100 rounded-none w-full h-full object-cover"
                />
                <div className="absolute inset-0 ring-1 ring-gray-900/10 ring-inset" />
            </div>
            <div className="content-start grid grid-rows-subgrid row-span-2 w-full">
                <h3 className="group relative heading-4">
                    <Link href={`${routes[productType]}${slug}`}>
                        <span className="absolute inset-0" />
                        {title}
                    </Link>
                </h3>
                <div className="flex items-center gap-x-4 my-1">
                    <span className="inline-flex items-center bg-muted px-2.5 py-0.5 rounded-full font-semibold text-sm">
                        {taxonomy.prefLabel}
                    </span>
                </div>
                <p className="text-muted-foreground text-base leading-6">
                    {description}
                </p>
            </div>
        </article>
    );
}
