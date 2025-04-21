'use client';

import React from 'react';
import { cn } from "@workspace/ui/lib/utils";
import type { PagebuilderType } from "@/types";
import { RichText } from "@/components/richtext";
import { TitleDescriptionBlock } from "@/components/title-description-block";

interface TableCellProps {
    content: any;
    isHeader?: boolean;
    isLastColumn?: boolean;
    className?: string;
}

const TableCell = ({ content, isHeader = false, isLastColumn = false, className }: TableCellProps) => {
    return (
        <div className={cn(
            "py-3 px-4",
            isHeader ? "bg-gray-300 text-gray-800 font-medium" : "text-gray-700",
            isLastColumn ? "prose prose-sm max-w-none" : "",
            className
        )}>
            {isLastColumn && typeof content === 'object' ? (
                <RichText richText={content} className="prose-p:first:mt-0 prose-p:last-of-type:mb-0" />
            ) : (
                content
            )}
        </div>
    );
};

export type GenericTableProps = PagebuilderType<"genericTable">;

export function GenericTable({
    title,
    description,
    columnHeaders = [],
    rows = [],
    columnCount = 4,
    variant = 'default',
}: GenericTableProps) {
    if (!rows || rows.length === 0 || !columnHeaders || columnHeaders.length === 0) {
        return null;
    }

    const getGridClassName = () => {
        // Create a dynamic grid template based on columnCount
        const gridCols = `grid-cols-1 md:grid-cols-${columnCount}`;
        const baseGridStyle = `grid ${gridCols} gap-px grid-flow-row auto-rows-auto`;

        switch (variant) {
            case 'striped':
                return cn(baseGridStyle, "bg-gray-200");
            case 'bordered':
                return cn(baseGridStyle, "divide-y divide-gray-200");
            case 'compact':
                return cn(baseGridStyle, "divide-y divide-gray-200 text-sm");
            default:
                return cn(baseGridStyle, "divide-y divide-gray-200");
        }
    };

    const getRowClassName = (index: number) => {
        if (variant === 'striped') {
            return index % 2 === 0 ? "bg-gray-50" : "bg-white";
        }
        return "bg-white";
    };

    return (
        <section className="max-container padding-center section-y-padding">
            {(title || description) && (
                <div className="mb-8">
                    <TitleDescriptionBlock
                        title={title || ''}
                        description={description || ''}
                        headingLevel="h2"
                        variant="compact"
                    />
                </div>
            )}

            <div className={cn(
                "grid grid-cols-1 gap-px auto-rows-auto",
                `md:grid-cols-${columnCount}`
            )}>
                {/* Headers */}
                {columnHeaders.map((header, index) => (
                    <TableCell
                        key={`header-${index}`}
                        content={header}
                        isHeader={true}
                        isLastColumn={index === columnHeaders.length - 1}
                        className="border-gray-300 border-b"
                    />
                ))}


                {/* Rows */}
                {rows.flatMap((row, rowIndex) =>
                    (row.cells || []).map((cell, cellIndex) => (
                        <TableCell
                            key={`cell-${rowIndex}-${cellIndex}`}
                            content={cell.content}
                            isLastColumn={cell.isLastColumn || false}
                            className={cn(
                                getRowClassName(rowIndex),
                                "border-b border-gray-200"
                            )}
                        />
                    ))
                )}
            </div>
        </section>
    );
} 