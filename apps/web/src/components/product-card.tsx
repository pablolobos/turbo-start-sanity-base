import { SanityImage } from "@/components/sanity-image";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    product: {
        _id: string;
        title: string;
        slug: string;
        description: string;
        image: any; // Sanity image can come in different formats
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

    // Ensure taxonomy exists
    const taxonomyLabel = taxonomy?.prefLabel || "Uncategorized";

    const routes = {
        camiones: '/camiones',
        buses: '/buses',
        motoresPenta: '/motores-penta'
    };

    // Handle different image formats from Sanity
    const renderImage = () => {
        // If image is a direct URL string (from the simplified query)
        if (typeof image === 'string') {
            return (
                <Image
                    src={image}
                    width={800}
                    height={400}
                    alt={title}
                    className="bg-gray-100 rounded-none w-full h-full object-cover"
                />
            );
        }

        // If image has asset property (from standard Sanity image object)
        if (image && image.asset) {
            return (
                <SanityImage
                    asset={image}
                    width={800}
                    height={400}
                    alt={title}
                    className="bg-gray-100 rounded-none w-full h-full object-cover"
                />
            );
        }

        // Fallback for missing image
        return (
            <div className="flex justify-center items-center bg-gray-100 rounded-none w-full h-full">
                <span className="text-gray-400">No image</span>
            </div>
        );
    };

    return (
        <article className="content-start gap-2 grid grid-cols-1 grid-rows-[auto_auto_1fr] w-full">
            <div className="relative rounded-none w-full h-auto aspect-[16/9] overflow-hidden">
                {renderImage()}
                <div className="absolute inset-0 ring-1 ring-gray-900/10 ring-inset" />
            </div>
            <div className="content-start grid grid-rows-subgrid row-span-2 w-full">
                <h3 className="group relative heading-4">
                    <Link href={`${slug}`}>
                        <span className="absolute inset-0" />
                        {title}
                    </Link>
                </h3>

                <p className="text-muted-foreground text-base leading-6">
                    {description}
                </p>
            </div>
        </article>
    );
}
