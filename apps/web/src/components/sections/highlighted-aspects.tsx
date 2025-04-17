import { AspectCard } from "@/components/aspect-card";
import { TitleDescriptionBlock } from "@/components/title-description-block";
import type { PagebuilderType } from "@/types";

type HighlightedAspectsProps = PagebuilderType<"highlightedAspects">;

function getGridClass(columns: string | null | undefined) {
    switch (columns) {
        case "2":
            return "md:grid-cols-2";
        case "4":
            return "md:grid-cols-2 lg:grid-cols-4";
        case "3":
        default:
            return "md:grid-cols-2 lg:grid-cols-3";
    }
}

export function HighlightedAspects({
    title,
    description,
    aspects,
    columns,
}: HighlightedAspectsProps) {
    // If no aspects, don't render the component
    if (!aspects || aspects.length === 0) return null;

    // Get the grid classes based on the columns configuration
    const gridClass = getGridClass(columns);

    return (
        <section className="bg-background py-16 md:py-24 max-container">
            <div className="flex flex-col gap-8">
                {/* Title and description area */}
                {(title || description) && (
                    <div className="mb-8">
                        <TitleDescriptionBlock
                            title={title || ""}
                            description={description || ""}
                            variant="default"
                            headingLevel="h2"
                        />
                    </div>
                )}

                {/* Grid of aspect cards */}
                <div className={`grid-gap grid grid-cols-1 ${gridClass} mb-8 padding-center`}>
                    {aspects.map((aspect) => (
                        <AspectCard
                            key={aspect._key}
                            aspect={aspect}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
} 