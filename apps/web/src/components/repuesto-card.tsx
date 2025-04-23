import { SanityImage } from "@/components/sanity-image";
import Link from "next/link";

interface RepuestoCardProps {
    repuesto: {
        _id: string;
        title: string;
        slug: string;
        category: string;
        image: any; // Sanity image
    };
}

export function RepuestoCard({ repuesto }: RepuestoCardProps) {
    if (!repuesto) {
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

    const { title, slug, category, image } = repuesto;

    return (
        <article className="content-start gap-2 grid grid-cols-1 grid-rows-[auto_auto_1fr] w-full">
            <div className="relative rounded-none w-full h-auto aspect-[16/9] overflow-hidden">
                {image ? (
                    <SanityImage
                        asset={image}
                        width={500}
                        height={500}
                        alt={title}
                        quality={80}
                        preserveAspectRatio={true}
                        className="bg-white rounded-none w-full h-full object-contain"
                    />
                ) : (
                    <div className="flex justify-center items-center bg-gray-100 rounded-none w-full h-full">
                        <span className="text-gray-400">No image</span>
                    </div>
                )}
                <div className="absolute inset-0 ring-1 ring-gray-900/10 ring-inset" />
            </div>
            <div className="content-start grid grid-rows-subgrid row-span-2 w-full">
                <div className="font-medium text-muted-foreground text-sm">
                    {category}
                </div>
                <h3 className="group relative heading-4">
                    <Link href={`/repuestos/${slug}`}>
                        <span className="absolute inset-0" />
                        {title}
                    </Link>
                </h3>
            </div>
        </article>
    );
} 