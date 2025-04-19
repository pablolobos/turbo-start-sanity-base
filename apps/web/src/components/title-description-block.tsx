import React from 'react';
import { cn } from "@workspace/ui/lib/utils";

interface TitleDescriptionBlockProps {
    title: string;
    subtitle?: string;
    description?: string | React.ReactNode;
    className?: string;
    headingLevel?: 'h1' | 'h2';
    variant?: 'default' | 'compact' | 'center';
}

export function TitleDescriptionBlock({
    title,
    subtitle,
    description,
    className,
    headingLevel = 'h1',
    variant = 'default',
}: TitleDescriptionBlockProps) {
    const Heading = headingLevel;

    return (
        <div className={cn(
            "flex flex-col gap-8  py-12 lg:py-20  padding-center max-container",
            variant === 'compact' ? 'lg:py-2 px-4' : 'container-padding gap-8',
            variant === 'center' ? 'text-center lg:flex-col lg:items-center' : 'lg:grid lg:grid-cols-2',
            className
        )}>
            <Heading className={cn("mb-4 ", headingLevel === 'h1' ? 'heading-1' : 'heading-2')}>{title}. {subtitle && <span>{subtitle}</span>}</Heading>
            {description && <p className="text-base">{description}</p>}
        </div>
    );
} 