import React from 'react';
import { cn } from "@workspace/ui/lib/utils";

interface TitleDescriptionBlockProps {
    title: string;
    description?: string | React.ReactNode;
    className?: string;
    headingLevel?: 'h1' | 'h2';
    variant?: 'default' | 'compact';
}

export function TitleDescriptionBlock({
    title,
    description,
    className,
    headingLevel = 'h1',
    variant = 'default',
}: TitleDescriptionBlockProps) {
    const Heading = headingLevel;

    return (
        <div className={cn(
            "flex flex-col gap-8 lg:grid lg:grid-cols-2 py-12 lg:py-20  padding-center max-container",
            variant === 'compact' ? 'lg:py-2 px-4' : 'container-padding gap-8',
            className
        )}>
            <Heading className="mb-4 font-semibold text-4xl capitalize">{title}</Heading>
            {description && <p className="text-base">{description}</p>}
        </div>
    );
} 