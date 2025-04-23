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

// Helper function to group dates by month
function groupFechasByMonth(fechas: FechaCapacitacion[]): Map<string, FechaCapacitacion[]> {
    const grouped = new Map<string, FechaCapacitacion[]>();

    // Sort fechas by date first to ensure chronological order
    const sortedFechas = [...fechas].sort((a, b) => {
        if (!a.fecha || !b.fecha) return 0;
        return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });

    sortedFechas.forEach((fecha) => {
        if (!fecha.fecha) return;

        const month = new Date(fecha.fecha).toLocaleDateString('es-CL', {
            month: 'long',
        });

        if (!grouped.has(month)) {
            grouped.set(month, []);
        }

        grouped.get(month)?.push(fecha);
    });

    return grouped;
}

export function CursosBlock({
    title,
    description,
    displayMode = 'grid',
    showAllDates,
    cursos,
}: CursosBlockProps) {
    return (
        <section className="space-y-8 py-12 w-full max-container padding-center">
            {/* Header */}
            {(title || description) && (
                <div className="space-y-4 text-left padding-center">
                    {title && <h2 className="heading-2">{title}</h2>}
                    {description && <p className="text-muted-foreground">{description}</p>}
                </div>
            )}

            {/* Cursos Grid/List */}
            <div
                className={cn(
                    "grid gap-8",
                )}
            >
                {cursos?.map((curso) => (
                    <div
                        key={curso._id}
                        className={cn(
                            "group relative overflow-hidden rounded border bg-v-accent-sea p-6 lg:p-8",
                            displayMode === 'list' && "flex gap-6"
                        )}
                    >
                        {/* Image */}
                        {curso.image && (
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
                        )}

                        {/* Content */}
                        <div className={cn(
                            "space-y-4 pt-6 lg:pt-12 w-full",
                            displayMode === 'list' && "w-2/3 flex flex-col gap-8 pt-0 flex-1"
                        )}>
                            <h3 className="text-white heading-2">{curso.title}</h3>

                            {/* Fechas de Capacitación */}
                            {curso.fechasCapacitacion && curso.fechasCapacitacion.length > 0 && (
                                <div className="space-y-6 pt-4 w-full">
                                    {Array.from(groupFechasByMonth(curso.fechasCapacitacion)).map(([month, fechas]) => (
                                        <div key={`${curso._id}-${month}-${fechas[0]?.fecha}`} className="gap-6 md:gap-8 grid grid-cols-1 md:grid-cols-[minmax(0,150px)_1fr]">
                                            <h4 className="text-white capitalize heading-4">{month}</h4>
                                            <div className="space-y-[2px] w-full">
                                                {fechas.map((fecha, index) => (
                                                    <div
                                                        key={fecha._key || `${curso._id}-fecha-${fecha.fecha}-${index}`}
                                                        className="items-center content-start gap-2 grid grid-cols-2 md:grid-cols-[5em_1fr_1fr_1fr] bg-white/10 p-4 md:p-0 rounded-sm w-full text-white"
                                                    >
                                                        {fecha.fecha && (
                                                            <div className="flex md:flex-col md:justify-center items-center gap-1 p-0 md:p-2 text-sm leading-none">
                                                                <span className="md:text-sm text-lg uppercase">
                                                                    {new Date(fecha.fecha).toLocaleDateString('es-CL', {
                                                                        weekday: 'short',
                                                                    })}
                                                                </span>
                                                                <span className="md:font-bold text-lg md:text-3xl">
                                                                    {new Date(fecha.fecha).toLocaleDateString('es-CL', {
                                                                        day: 'numeric'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {fecha.fecha && (
                                                            <div className="flex items-center gap-4 p-0 md:p-4 text-base">
                                                                <span>{fecha.hora}</span>
                                                            </div>
                                                        )}
                                                        <p className="col-span-2 md:col-span-1 font-bold text-base">{fecha.nombre}</p>
                                                        <p className="col-span-2 md:col-span-1 text-base">
                                                            Profesor: {fecha.profesor}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
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