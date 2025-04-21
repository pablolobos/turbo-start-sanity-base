import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export function Container({
    children,
    className = "",
    ...props
}: ContainerProps) {
    return (
        <div
            className={`container mx-auto px-4 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
} 