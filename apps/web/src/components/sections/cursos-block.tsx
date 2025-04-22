'use client';

import { cn } from "@workspace/ui/lib/utils";
import { RichText } from "../richtext";
import { SanityImage } from "../sanity-image";
import type { SanityImageProps, SanityRichTextProps } from "@/types";

interface FechaCapacitacion {
    nombre: string | null;
    profesor: "Patricio Barahona" | "Abraham Medina" | null;
    fecha: string | null;
    hora: string | null;
    _key?: string;
}

interface CursoType {
    _id: string;
    _type: string;
    title: string | null;
    description: SanityRichTextProps | null;
    slug: string | null;
    image: SanityImageProps;
    fechasCapacitacion: FechaCapacitacion[] | null;
}

interface CursosBlockProps {
    _type: 'cursosBlock';
    _key?: string;
    title?: string | null;
    description?: string | null;
    displayMode: 'grid' | 'list';
    showAllDates: boolean;
    cursos: CursoType[];
}

export type { CursosBlockProps, CursoType, FechaCapacitacion };

export function CursosBlock({
    title,
    description,
    displayMode = 'grid',
    showAllDates,
    cursos,
}: CursosBlockProps) {
    return (
        <section className="space-y-8 py-12 w-full container">
            {/* Header */}
            {(title || description) && (
                <div className="space-y-4 text-center">
                    {title && <h2 className="font-bold text-3xl tracking-tight">{title}</h2>}
                    {description && <p className="text-muted-foreground">{description}</p>}
                </div>
            )}

            {/* Cursos Grid/List */}
            <div
                className={cn(
                    "grid gap-8",
                    displayMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                )}
            >
                {cursos?.map((curso) => (
                    <div
                        key={curso._id}
                        className={cn(
                            "group relative overflow-hidden rounded-lg border bg-background p-6",
                            displayMode === 'list' && "flex gap-6"
                        )}
                    >
                        {/* Image */}
                        <div className={cn(
                            "aspect-video overflow-hidden rounded-md",
                            displayMode === 'list' && "w-1/3"
                        )}>
                            <SanityImage
                                asset={curso.image}
                                width={800}
                                height={600}
                                alt={curso.title || 'Curso'}
                                className="object-cover group-hover:scale-105 transition-transform"
                            />
                        </div>

                        {/* Content */}
                        <div className={cn(
                            "space-y-4 pt-6",
                            displayMode === 'list' && "w-2/3 pt-0"
                        )}>
                            <h3 className="font-bold text-2xl">{curso.title}</h3>
                            {curso.description && (
                                <div className="text-muted-foreground">
                                    <RichText richText={curso.description} />
                                </div>
                            )}

                            {/* Fechas de Capacitación */}
                            {curso.fechasCapacitacion && curso.fechasCapacitacion.length > 0 && (
                                <div className="space-y-4 pt-4">
                                    <h4 className="font-semibold">Próximas fechas:</h4>
                                    <div className="space-y-2">
                                        {curso.fechasCapacitacion.map((fecha, index) => (
                                            <div
                                                key={fecha._key || `${curso._id}-fecha-${index}`}
                                                className="flex flex-col gap-1 p-4 border rounded-lg"
                                            >
                                                <p className="font-medium">{fecha.nombre}</p>
                                                <p className="text-muted-foreground text-sm">
                                                    Profesor: {fecha.profesor}
                                                </p>
                                                {fecha.fecha && (
                                                    <div className="flex items-center gap-4 text-sm">
                                                        <span>
                                                            {new Date(fecha.fecha).toLocaleDateString('es-CL', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                        <span>{fecha.hora}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default CursosBlock; 