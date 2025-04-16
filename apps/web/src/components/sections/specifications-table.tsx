'use client';

import React from 'react';
import { cn } from "@workspace/ui/lib/utils";
import type { PagebuilderType } from "@/types";
import { RichText } from "@/components/richtext";
import { TitleDescriptionBlock } from "@/components/title-description-block";

interface SpecificationItemProps {
    label: string;
    content: any; // Using a more generic type to avoid type errors
    isHeader?: boolean;
    isOdd?: boolean;
    className?: string;
}

const SpecificationItem = ({ label, content, isHeader = false, isOdd = false, className }: SpecificationItemProps) => {
    return (
        <>
            <div className={cn(
                "py-3 px-4 font-medium",
                isHeader ? "bg-gray-300 text-gray-800" : "text-gray-700",
                isOdd && !isHeader ? "" : "",
                className
            )}>
                {label}
            </div>
            <div className={cn(
                "py-3 px-4 prose prose-sm max-w-none ",
                isHeader ? "bg-gray-300 text-gray-800 font-medium" : "",
                className
            )}>
                {content && <RichText richText={content} className="prose-p:first:mt-0 prose-p:last-of-type:mb-0" />}
            </div>
        </>
    );
};

export type SpecificationsTableProps = PagebuilderType<"specificationsTable">;

export function SpecificationsTable({
    title,
    description,
    specifications = [],
    variant = 'default',
}: SpecificationsTableProps) {
    if (!specifications || specifications.length === 0) {
        return null;
    }

    const getGridClassName = () => {
        // Base styles for all variants
        const baseGridStyle = "grid grid-cols-1 md:grid-cols-2";

        if (variant === 'striped') {
            return cn(baseGridStyle, "");
        } else if (variant === 'bordered') {
            return cn(baseGridStyle, "divide-y divide-gray-200");
        } else if (variant === 'compact') {
            return cn(baseGridStyle, "divide-y divide-gray-200 text-sm");
        }

        // Default variant
        return cn(baseGridStyle, "divide-y divide-gray-200");
    };

    const getItemClassName = (index: number) => {
        if (variant === 'striped' || variant === 'default') {
            return index % 2 === 0 ? "bg-gray-100" : "bg-white";
        }
        return "";
    };

    // Find and process header rows - anything with "Características" label is a header
    const headerItems = specifications.filter(spec =>
        spec.label === "Características" ||
        spec.label?.toLowerCase() === "caracteristicas" ||
        spec.label?.toLowerCase() === "características"
    );
    const regularItems = specifications.filter(spec =>
        spec.label !== "Características" &&
        spec.label?.toLowerCase() !== "caracteristicas" &&
        spec.label?.toLowerCase() !== "características"
    );

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-12">
            {(title || description) && (
                <div className="mb-8">
                    <TitleDescriptionBlock
                        title={title || "Especificaciones"}
                        description={description}
                        headingLevel="h2"
                        variant="compact"
                    />
                </div>
            )}

            <div className={getGridClassName()}>
                {/* Header rows */}
                {headerItems.length > 0 && headerItems.map((item) => (
                    <SpecificationItem
                        key={item._key}
                        label={item.label || ''}
                        content={item.content || []}
                        isHeader={true}
                        className="border-gray-300 border-b"
                    />
                ))}

                {/* Regular specification items */}
                {regularItems.map((item, index) => (
                    <SpecificationItem
                        key={item._key}
                        label={item.label || ''}
                        content={item.content || []}
                        isOdd={index % 2 === 0}
                        className={cn(
                            getItemClassName(index),
                            "border-b border-gray-200"
                        )}
                    />
                ))}
            </div>
        </section>
    );
} 