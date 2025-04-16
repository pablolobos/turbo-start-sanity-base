"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Formularios } from "@/lib/sanity/sanity.types";
import { X } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import dynamic from "next/dynamic";

// Dynamically import the form component to avoid server/client hydration issues
const FormBlock = dynamic(() => import("./sections/form-block"), { ssr: false });

// FormData interface required by FormBlock component
interface FormData {
    _id: string;
    title: string;
    description?: string;
    fields: Array<{
        label: string;
        name: string;
        type: string;
        required: "yes" | "no";
        options?: string[];
        placeholder?: string;
    }>;
    submitButtonText: string;
    successMessage: string;
    errorMessage: string;
    emailRecipients: string;
}

interface CotizadorDialogProps {
    cotizadorData: {
        cotizadorFormTitle?: string;
        cotizadorFormDescription?: string;
        cotizadorForm?: Formularios;
    };
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    pageTitle?: string;
    buttonLabel?: string;
    buttonVariant?: "default" | "secondary" | "outline" | "ghost" | "link";
    buttonSize?: "default" | "sm" | "lg" | "icon";
    className?: string;
}

export function CotizadorDialog({
    cotizadorData,
    isOpen,
    onOpenChange,
    pageTitle,
    buttonLabel = "Cotizar ahora",
    buttonVariant = "default",
    buttonSize = "default",
    className,
}: CotizadorDialogProps) {
    // If no form data is available, don't render anything
    if (!cotizadorData?.cotizadorForm) {
        return null;
    }

    // Adapt Sanity Formularios type to the FormData interface expected by FormBlock
    const formData: FormData = {
        _id: cotizadorData.cotizadorForm._id || "",
        title: cotizadorData.cotizadorForm.title || "",
        description: cotizadorData.cotizadorForm.description || undefined,
        fields: cotizadorData.cotizadorForm.fields?.map(field => ({
            label: field.label || "",
            name: field.name || "",
            type: field.type || "text",
            required: field.required || "no",
            options: field.options || undefined,
            placeholder: field.placeholder || undefined
        })) || [],
        submitButtonText: cotizadorData.cotizadorForm.submitButtonText || "Enviar",
        successMessage: cotizadorData.cotizadorForm.successMessage || "Gracias por contactarnos. Nos pondremos en contacto contigo pronto.",
        errorMessage: cotizadorData.cotizadorForm.errorMessage || "Ha ocurrido un error. Por favor, intenta nuevamente.",
        emailRecipients: cotizadorData.cotizadorForm.emailRecipients || ""
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="z-50 fixed inset-0 bg-black/50 backdrop-blur-sm data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="top-[50%] data-[state=closed]:slide-out-to-top-[48%] left-[50%] data-[state=closed]:slide-out-to-left-1/2 z-50 fixed gap-4 grid bg-background data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] shadow-lg p-6 border sm:rounded-lg w-full max-w-3xl max-h-screen lg:max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] data-[state=closed]:animate-out data-[state=open]:animate-in duration-200 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                    <Dialog.Title className="sr-only font-bold text-xl leading-none tracking-tight">
                        {pageTitle ? `Cotizar ${pageTitle}` : (cotizadorData.cotizadorFormTitle || "Solicita una cotización")}
                    </Dialog.Title>
                    {cotizadorData.cotizadorFormDescription && (
                        <Dialog.Description className="sr-only text-muted-foreground text-sm">
                            {cotizadorData.cotizadorFormDescription}
                        </Dialog.Description>
                    )}

                    <div className="mt-4">
                        <FormBlock
                            title={pageTitle ? `Cotizar ${pageTitle}` : (cotizadorData.cotizadorFormTitle || "Solicita una cotización")}
                            description={cotizadorData.cotizadorFormDescription || ""}
                            variant="default"
                            form={formData}
                        />
                    </div>

                    <Dialog.Close asChild>
                        <button
                            className="top-4 right-4 absolute data-[state=open]:bg-accent opacity-70 hover:opacity-100 rounded-sm focus:outline-none focus:ring-2 focus:ring-ring ring-offset-background focus:ring-offset-2 data-[state=open]:text-muted-foreground transition-opacity disabled:pointer-events-none"
                            aria-label="Cerrar"
                        >
                            <X className="w-4 h-4" />
                            <span className="sr-only">Cerrar</span>
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
} 