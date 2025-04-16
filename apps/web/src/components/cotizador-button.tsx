"use client";

import { CotizadorDialog } from "./cotizador-dialog";
import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
interface CotizadorButtonProps {
    buttonLabel?: string;
    buttonVariant?: "default" | "secondary" | "outline" | "ghost" | "link";
    buttonSize?: "default" | "sm" | "lg" | "icon";
    className?: string;
    pageTitle?: string;
}

interface CotizadorData {
    cotizadorFormTitle?: string;
    cotizadorFormDescription?: string;
    cotizadorForm?: any; // Use any to bypass the type checking for now
}

export function CotizadorButton({
    buttonLabel = "Cotizar ahora",
    buttonVariant = "default",
    buttonSize = "default",
    className,
    pageTitle,
}: CotizadorButtonProps) {
    const [cotizadorData, setCotizadorData] = useState<CotizadorData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCotizadorData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch("/api/cotizador");

                if (!response.ok) {
                    throw new Error("Failed to fetch cotizador data");
                }

                const result = await response.json();

                if (result && result._id) {
                    setCotizadorData({
                        cotizadorFormTitle: result.cotizadorFormTitle || undefined,
                        cotizadorFormDescription: result.cotizadorFormDescription || undefined,
                        cotizadorForm: result.cotizadorForm || undefined,
                    });
                } else {
                    setError("No form data available");
                }
            } catch (error) {
                console.error("Error loading cotizador data:", error);
                setError(error instanceof Error ? error.message : "Unknown error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCotizadorData();
    }, []);

    const handleButtonClick = () => {
        if (!isLoading && cotizadorData?.cotizadorForm) {
            setIsDialogOpen(true);
        } else {
            alert("El formulario de cotización no está disponible en este momento.");
        }
    };

    return (
        <>
            <Button
                variant="default"
                size="lg"
                className={cn(
                    "transition-colors duration-200",
                    "border-white/30 border",
                    "hover:opacity-90",
                    "focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                    "fixed bottom-4 right-8 z-[100]",
                    className
                )}
                onClick={handleButtonClick}
                disabled={isLoading}
            >
                {buttonLabel}
            </Button>

            {!isLoading && cotizadorData?.cotizadorForm && (
                <CotizadorDialog
                    cotizadorData={cotizadorData}
                    isOpen={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                    pageTitle={pageTitle}
                />
            )}
        </>
    );
} 