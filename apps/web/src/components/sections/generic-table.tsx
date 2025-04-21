'use client';

import React from 'react';
import { cn } from "@workspace/ui/lib/utils";
import type { PagebuilderType } from "@/types";
import { RichText } from "@/components/richtext";
import { TitleDescriptionBlock } from "@/components/title-description-block";

interface TableCellProps {
    content: any;
    header?: string;
    isHeader?: boolean;
    isLastColumn?: boolean;
    className?: string;
}

const TableCell = ({ content, header, isHeader = false, isLastColumn = false, className }: TableCellProps) => {
    return (
        <div className={cn(
            "py-3 px-4",
            isHeader ? "bg-gray-300 text-gray-800 font-medium" : "text-gray-700",
            isLastColumn ? "prose prose-sm max-w-none" : "",
            className
        )}>
            {!isHeader && header && (
                <span className="md:hidden block mb-1 font-medium text-gray-800 text-sm">
                    {header}
                </span>
            )}
            {isLastColumn && typeof content === 'object' ? (
                <RichText richText={content} className="prose-p:first-of-type:mt-0 prose-p:last-of-type:mb-0" />
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
                return cn(baseGridStyle);
            case 'bordered':
                return cn(baseGridStyle);
            case 'compact':
                return cn(baseGridStyle, "text-sm");
            default:
                return baseGridStyle;
        }
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

            <div className="border border-gray-200 md:border-0 divide-y divide-gray-200 overflow-hidden">
                {/* Header row - hidden on mobile */}
                <div className={cn(
                    getGridClassName(),
                    "hidden md:grid bg-gray-100"
                )}>
                    {columnHeaders.map((header, index) => (
                        <TableCell
                            key={`header-${index}`}
                            content={header}
                            isHeader={true}
                        />
                    ))}
                </div>

                {/* Data rows */}
                {rows.map((row, rowIndex) => (
                    <div
                        key={`row-${rowIndex}`}
                        className={cn(
                            getGridClassName(),
                            rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50",
                            "border-b border-gray-200 last:border-b-0 grid grid-cols-4 "
                        )}
                    >
                        {(row.cells || []).map((cell, cellIndex) => (
                            <TableCell
                                key={`cell-${rowIndex}-${cellIndex}`}
                                content={cell.content}
                                header={columnHeaders[cellIndex]}
                                isLastColumn={cell.isLastColumn || false}
                                className={cn(
                                    "border-b-0 first:col-span-4 md:first:col-span-1 last:col-span-4 md:last:col-span-1",
                                    cellIndex === 0 && "font-medium"
                                )}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </section>
    );
} 