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
                <span className="md:block">
                    {content}
                </span>
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
        const gridCols = `md:grid-cols-${columnCount}`;
        const baseGridStyle = `grid grid-cols-1 ${gridCols} gap-px`;

        switch (variant) {
            case 'striped':
                return cn(baseGridStyle, "bg-gray-200 divide-y divide-gray-200 md:divide-y-0");
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
            return cn(
                index % 2 === 0 ? "bg-gray-50" : "bg-white",
                "md:divide-x divide-gray-200"
            );
        }
        return cn("bg-white", "md:divide-x divide-gray-200");
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

            <div className={getGridClassName()}>
                {/* Headers - only visible on desktop */}
                {columnHeaders.map((header, index) => (
                    <TableCell
                        key={`header-${index}`}
                        content={header}
                        isHeader={true}
                        isLastColumn={index === columnHeaders.length - 1}
                        className={cn(
                            "border-gray-300 border-b",
                            "hidden md:block" // Hide on mobile
                        )}
                    />
                ))}
            </div>
            <div className={getGridClassName()}>
                {/* Rows */}
                {rows.map((row, rowIndex) =>
                    (row.cells || []).map((cell, cellIndex) => (
                        <div key={`cell-${rowIndex}-${cellIndex}`} className="md:block flex md:mb-0">
                            {/* Mobile header label */}
                            <div className="md:hidden px-4 w-1/3 font-medium text-gray-800">
                                {columnHeaders[cellIndex]}
                            </div>
                            {/* Cell content */}
                            <div className="flex-1 md:w-full">
                                <TableCell
                                    content={cell.content}
                                    isLastColumn={cell.isLastColumn || false}
                                    className={getRowClassName(rowIndex)}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
} 