import Link from "next/link";
import { SanityImage } from "@/components/sanity-image";
import type { SanityImageProps } from "@/types";

type Product = {
    _id: string;
    _type: "buses" | "camiones" | "motoresPenta";
    title: string | null;
    description: string | null;
    slug: string | null;
    category: string | null;
    image: SanityImageProps | null;
};

type ProductCategoryListingData = {
    _type: "productCategoryListing";
    title: string | null;
    description: string | null;
    productType: "buses" | "camiones" | "motoresPenta";
    category: string;
    displayMode: "grid" | "list";
    showViewAllButton: "yes" | "no";
    viewAllButtonText?: string;
    products: Product[];
};

interface ProductCardProps {
    product: Product;
    displayMode?: "grid" | "list";
}

function ProductImage({ image, title }: { image: SanityImageProps | null; title?: string | null }) {
    if (!image?.asset) return null;

    return (
        <SanityImage
            asset={image}
            width={800}
            height={400}
            alt={title ?? "Imagen de producto"}
            className="bg-gray-100 rounded-none w-full h-full object-cover"
        />
    );
}

function ProductCard({ product, displayMode = "grid" }: ProductCardProps) {
    if (!product) {
        return (
            <article className="gap-4 grid grid-cols-1 w-full">
                <div className="bg-muted rounded-none h-48 animate-pulse" />
                <div className="space-y-2">
                    <div className="bg-muted rounded w-24 h-4 animate-pulse" />
                    <div className="bg-muted rounded w-full h-6 animate-pulse" />
                    <div className="bg-muted rounded w-3/4 h-4 animate-pulse" />
                </div>
            </article>
        );
    }

    const { title, slug, description, image, category } = product;

    if (displayMode === "list") {
        return (
            <article className="gap-6 grid grid-cols-1 md:grid-cols-[300px_1fr] w-full">
                <div className="relative rounded-none w-full h-auto aspect-[4/3] overflow-hidden">
                    <ProductImage image={image} title={title} />
                    <div className="absolute inset-0 ring-1 ring-gray-900/10 ring-inset" />
                </div>
                <div className="flex flex-col justify-center">
                    {category && (
                        <div className="mb-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full font-medium text-sm bg-accent-brand/10 text-accent-brand">
                                {category}
                            </span>
                        </div>
                    )}
                    <h3 className="heading-3">
                        <Link href={slug ?? "#"}>
                            <span className="absolute inset-0" />
                            {title}
                        </Link>
                    </h3>
                    {description && (
                        <p className="mt-2 text-muted-foreground text-base line-clamp-2">
                            {description}
                        </p>
                    )}
                </div>
            </article>
        );
    }

    return (
        <article className="content-start gap-2 grid grid-cols-1 grid-rows-[auto_1fr] w-full">
            <div className="relative rounded-none w-full h-auto aspect-[4/3] overflow-hidden">
                <ProductImage image={image} title={title} />
                <div className="absolute inset-0 ring-1 ring-gray-900/10 ring-inset" />
            </div>
            <div className="content-start grid grid-rows-subgrid row-span-1 w-full">
                {category && (
                    <div className="mb-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full font-medium text-sm bg-accent-brand/10 text-accent-brand">
                            {category}
                        </span>
                    </div>
                )}
                <h3 className="heading-3">
                    <Link href={slug ?? "#"}>
                        <span className="absolute inset-0" />
                        {title}
                    </Link>
                </h3>
                {description && (
                    <p className="mt-2 text-muted-foreground text-base line-clamp-2">
                        {description}
                    </p>
                )}
            </div>
        </article>
    );
}

interface ProductCategoryListingProps {
    data: ProductCategoryListingData;
}

export function ProductCategoryListing({ data }: ProductCategoryListingProps) {
    if (!data) {
        return (
            <section className="py-24 sm:py-32">
                <div className="mx-auto px-6 lg:px-8 max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <div className="space-y-4">
                            <div className="bg-muted mx-auto rounded w-3/4 h-8 animate-pulse" />
                            <div className="bg-muted rounded w-full h-4 animate-pulse" />
                        </div>
                    </div>
                    <div className="gap-x-8 gap-y-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto mt-16 max-w-7xl">
                        {[...Array(3)].map((_, i) => (
                            <article key={i} className="gap-4 grid grid-cols-1 w-full">
                                <div className="bg-muted rounded-none h-48 animate-pulse" />
                                <div className="space-y-2">
                                    <div className="bg-muted rounded w-24 h-4 animate-pulse" />
                                    <div className="bg-muted rounded w-full h-6 animate-pulse" />
                                    <div className="bg-muted rounded w-3/4 h-4 animate-pulse" />
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const {
        title,
        description,
        products,
        displayMode = "grid",
        showViewAllButton,
        viewAllButtonText = "Ver todos",
    } = data;

    if (!products?.length) {
        return (
            <section className="py-24 sm:py-32">
                <div className="mx-auto px-6 lg:px-8 max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="heading-2">{title}</h2>
                        {description && (
                            <p className="mt-2 text-muted-foreground text-lg leading-8">
                                {description}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-center mt-16">
                        <p className="text-muted-foreground">No hay productos disponibles</p>
                    </div>
                </div>
            </section>
        );
    }

    const firstProduct = products[0];
    const viewAllHref = firstProduct ? `/${firstProduct._type}` : "#";

    return (
        <section className="py-24 sm:py-32">
            <div className="mx-auto px-6 lg:px-8 max-w-7xl">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="heading-2">{title}</h2>
                    {description && (
                        <p className="mt-2 text-muted-foreground text-lg leading-8">
                            {description}
                        </p>
                    )}
                </div>
                <div className={`mx-auto mt-16 max-w-7xl ${displayMode === "grid"
                    ? "grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
                    : "flex flex-col gap-8"
                    }`}>
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                            displayMode={displayMode}
                        />
                    ))}
                </div>
                {showViewAllButton === "yes" && products.length > 0 && (
                    <div className="flex justify-center mt-16">
                        <Link
                            href={viewAllHref}
                            className="shadow-sm px-6 py-3 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-brand focus-visible:outline-offset-2 font-semibold text-white text-sm bg-accent-brand hover:bg-accent-brand/90"
                        >
                            {viewAllButtonText}
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
} 