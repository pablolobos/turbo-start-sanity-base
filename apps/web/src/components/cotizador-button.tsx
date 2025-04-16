"use client";

import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamically import the dialog component to avoid hydration issues
const CotizadorDialog = dynamic(() => import("./cotizador-dialog"), {
    ssr: false,
    loading: () => null
});

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
            <AnimatePresence>
                {!isDialogOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{
                            duration: 0.2,
                            ease: "easeInOut",
                            delay: 0.2
                        }}
                        className="right-8 bottom-4 z-[100] fixed"
                    >
                        <Button
                            variant="default"
                            size="lg"
                            className={cn(
                                "transition-colors duration-200",
                                "border-white/30 border",
                                "hover:opacity-90",
                                "focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                                "uppercase",
                                className
                            )}
                            onClick={handleButtonClick}
                            disabled={isLoading}
                        >
                            {buttonLabel}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

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