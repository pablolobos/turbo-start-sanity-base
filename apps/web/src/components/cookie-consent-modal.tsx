"use client";

import { useState, useCallback, useEffect } from "react";
import { useCookieConsent } from "@/context/cookie-consent-provider";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@workspace/ui/components/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@workspace/ui/components/button";
import { Plus, X } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Logo } from "./logo";

type CookieType = {
    id: string;
    title: string;
    description: string;
    required: boolean;
};

const cookieTypes: CookieType[] = [
    {
        id: "necessary",
        title: "Cookies estrictamente necesarias",
        description: "Estas cookies son esenciales para que el sitio web funcione correctamente.",
        required: true,
    },
    {
        id: "performance",
        title: "Cookies de rendimiento",
        description: "Nos ayudan a entender cómo los visitantes interactúan con nuestro sitio web, recopilando información anónima.",
        required: false,
    },
    {
        id: "functionality",
        title: "Cookies de funcionalidad",
        description: "Permiten que el sitio web recuerde las elecciones que hace (como su nombre de usuario, idioma o la región en la que se encuentra).",
        required: false,
    },
    {
        id: "targeting",
        title: "Cookies dirigidas",
        description: "Estas cookies registran su visita al sitio web, las páginas que ha visitado y los enlaces que ha seguido para mostrarle anuncios relevantes.",
        required: false,
    },
];

export function CookieConsentModal() {
    const {
        consent,
        updateConsent,
        acceptAll,
        rejectAll,
        savePreferences,
        isConsentModalOpen,
        closeConsentModal,
        isInitialized
    } = useCookieConsent();

    const [expandedTypes, setExpandedTypes] = useState<string[]>([]);

    // Don't render anything until the provider is initialized
    if (!isInitialized) return null;

    const toggleExpand = (id: string) => {
        setExpandedTypes((prev) =>
            prev.includes(id)
                ? prev.filter((itemId) => itemId !== id)
                : [...prev, id]
        );
    };

    // Handle the modal being closed
    const handleCloseModal = useCallback(() => {
        closeConsentModal();
    }, [closeConsentModal]);

    return (
        <Dialog open={isConsentModalOpen} onOpenChange={handleCloseModal}>
            <DialogContent className="flex flex-col items-start gap-4 sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                {/* Custom close button that calls our closeConsentModal function */}
                <DialogPrimitive.Close asChild>
                    <button
                        onClick={handleCloseModal}
                        className="top-4 right-4 absolute data-[state=open]:bg-accent opacity-70 hover:opacity-100 rounded-sm focus:outline-none focus:ring-2 focus:ring-ring ring-offset-background focus:ring-offset-2 data-[state=open]:text-muted-foreground transition-opacity disabled:pointer-events-none"
                    >
                        <X className="w-4 h-4" />
                        <span className="sr-only">Close</span>
                    </button>
                </DialogPrimitive.Close>

                <div className="flex justify-center">
                    <div className="w-[200px]">
                        <Logo width={200} height={70} priority />
                    </div>
                </div>
                <DialogTitle className="font-bold text-xl text-center">
                    Centro de preferencia de la privacidad
                </DialogTitle>
                <DialogDescription className="text-sm">
                    Cuando visita cualquier sitio web, el mismo podría obtener o guardar información en
                    su navegador, generalmente mediante el uso de cookies. Esta información
                    puede ser acerca de usted, sus preferencias o su dispositivo, y se usa
                    principalmente para que el sitio funcione según lo esperado. Por lo
                    general, la información no lo identifica directamente, pero puede
                    proporcionarle una experiencia web más personalizada. Ya que respetamos
                    su derecho a la privacidad, usted puede escoger no permitirnos usar
                    ciertas cookies. Haga clic en los encabezados de cada categoría para
                    saber más y cambiar nuestras configuraciones predeterminadas. Sin
                    embargo, el bloqueo de algunos tipos de cookies puede afectar su
                    experiencia en el sitio y los servicios que podemos ofrecer.
                </DialogDescription>

                <div className="w-full">
                    <Button
                        onClick={acceptAll}
                        className="w-full"
                        variant="primary"
                    >
                        Permitirlas todas
                    </Button>
                </div>

                <div className="flex flex-col gap-6 pt-6 w-full">
                    <h3 className="font-bold text-lg">
                        Gestionar las preferencias de consentimiento
                    </h3>
                    <div className="space-y-2 mb-6 w-full">
                        {cookieTypes.map((type) => (
                            <div
                                key={type.id}
                                className="border rounded-sm overflow-hidden"
                            >
                                <div
                                    className="flex justify-between items-center p-4 cursor-pointer"
                                    onClick={() => toggleExpand(type.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        <Plus
                                            className={cn(
                                                "h-5 w-5 transform transition-transform",
                                                expandedTypes.includes(type.id) && "rotate-45"
                                            )}
                                        />
                                        <span className="font-medium">{type.title}</span>
                                    </div>
                                    <div className="flex items-center">
                                        {type.required ? (
                                            <span className="font-medium text-blue-600 text-sm">
                                                Activas siempre
                                            </span>
                                        ) : (
                                            <label className="inline-flex relative items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={consent[type.id as keyof typeof consent] || false}
                                                    onChange={(e) =>
                                                        updateConsent(
                                                            type.id as "necessary" | "performance" | "functionality" | "targeting",
                                                            e.target.checked
                                                        )
                                                    }
                                                    className="sr-only peer"
                                                    disabled={type.required}
                                                />
                                                <div className="peer after:top-[2px] after:left-[2px] after:absolute bg-gray-200 after:bg-white peer-checked:bg-blue-600 after:border after:border-gray-300 peer-checked:after:border-white rounded-full after:rounded-full peer-focus:outline-none w-11 after:w-5 h-6 after:h-5 after:content-[''] after:transition-all rtl:peer-checked:after:-translate-x-full peer-checked:after:translate-x-full"></div>
                                            </label>
                                        )}
                                    </div>
                                </div>
                                {expandedTypes.includes(type.id) && (
                                    <div className="bg-gray-50 p-4 border-t">
                                        <p className="text-sm">{type.description}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between gap-4 mt-4 w-full">
                    <Button
                        onClick={rejectAll}
                        variant="outline"
                        className="flex-1"
                    >
                        Rechazarlas todas
                    </Button>
                    <Button
                        onClick={savePreferences}
                        variant="primary"
                        className="flex-1"
                    >
                        Confirmar mis preferencias
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Fixed banner for when someone has closed the modal but not consented yet
export function CookieConsentBanner() {
    const {
        consent,
        openConsentModal,
        acceptAll,
        isInitialized
    } = useCookieConsent();

    // Don't render anything until the provider is initialized or if user has already interacted
    if (!isInitialized || consent.hasInteracted) return null;

    return (
        <div className="right-0 bottom-0 left-0 z-50 fixed bg-white shadow-lg p-4 border-t">
            <div className="flex sm:flex-row flex-col justify-between items-center gap-4 mx-auto max-w-7xl">
                <p className="flex-1 text-sm">
                    Usamos cookies para mejorar su experiencia en nuestro sitio web.
                    Al continuar navegando, acepta nuestro uso de cookies.
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={openConsentModal}
                        size="sm"
                    >
                        Preferencias
                    </Button>
                    <Button
                        variant="primary"
                        onClick={acceptAll}
                        size="sm"
                    >
                        Aceptar todas
                    </Button>
                </div>
            </div>
        </div>
    );
} 