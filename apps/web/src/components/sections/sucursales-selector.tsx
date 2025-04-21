"use client";

import React, { useState, useEffect } from "react";
import { querySucursalesData } from "@/lib/sanity/query";
import { createClient } from "next-sanity";
import { MapPin, Phone, Mail, User } from "lucide-react";
import { dataset, projectId } from "@/lib/sanity/api";

// Create a Sanity client
const client = createClient({
    projectId,
    dataset,
    apiVersion: "2023-03-01",
    useCdn: false,
});

// Simplified type definitions to avoid type errors
type Sucursal = any;

interface SucursalesSelectorProps {
    title?: string;
    description?: string;
    showMap?: boolean;
    showAllRegions?: boolean;
    selectedRegions?: string[];
    variant?: 'default' | 'cards' | 'compact';
}

export function SucursalesSelector({
    title = "Nuestras Sucursales",
    description,
    showMap = true,
    showAllRegions = true,
    selectedRegions = [],
    variant = "default",
}: SucursalesSelectorProps) {
    const [allSucursales, setAllSucursales] = useState<Sucursal[]>([]);
    const [filteredSucursales, setFilteredSucursales] = useState<Sucursal[]>([]);
    const [regions, setRegions] = useState<string[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string>("");
    const [loading, setLoading] = useState(true);

    // Fetch all sucursales data
    useEffect(() => {
        const fetchSucursales = async () => {
            try {
                setLoading(true);
                const data = await client.fetch(querySucursalesData);
                setAllSucursales(data || []);

                // Extract unique regions and filter out null/undefined values
                const uniqueRegions = [...new Set(data.map((s: any) => s.region).filter(Boolean))];
                setRegions(uniqueRegions || []);

                // Set initial region
                if (uniqueRegions && uniqueRegions.length > 0) {
                    setSelectedRegion(uniqueRegions[0] || "");
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching sucursales:", error);
                setLoading(false);
            }
        };

        fetchSucursales();
    }, []);

    // Filter sucursales when region changes
    useEffect(() => {
        if (selectedRegion) {
            const filtered = allSucursales.filter(
                (sucursal) => sucursal.region === selectedRegion
            );
            setFilteredSucursales(filtered);
        }
    }, [selectedRegion, allSucursales]);

    // Filter regions based on props
    const availableRegions = showAllRegions
        ? regions
        : regions.filter((region) => selectedRegions.includes(region));

    // Loading state
    if (loading) {
        return (
            <div className="mx-auto px-4 container">
                <div className="flex justify-center py-12">
                    <div className="text-center">
                        <p>Cargando sucursales...</p>
                    </div>
                </div>
            </div>
        );
    }

    // No regions found
    if (availableRegions.length === 0) {
        return (
            <div className="mx-auto px-4 container">
                <div className="py-12 text-center">
                    <h2 className="mb-4 font-bold text-2xl">{title}</h2>
                    <p>No se encontraron regiones disponibles.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 container">
            <div className="py-12">
                <div className="mb-8 text-center">
                    <h2 className="mb-2 font-bold text-3xl">{title}</h2>
                    {description && <p className="text-gray-600">{description}</p>}
                </div>

                {/* Region selector */}
                <div className="mx-auto mb-8 max-w-xs">
                    <select
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                        className="p-2 border rounded-md w-full"
                    >
                        {availableRegions.map((region) => (
                            <option key={region} value={region}>
                                {region}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sucursales list */}
                <div className={variant === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
                    {filteredSucursales.length > 0 ? (
                        filteredSucursales.map((sucursal) => (
                            <SucursalCard key={sucursal._id} sucursal={sucursal} variant={variant} />
                        ))
                    ) : (
                        <div className="text-center">
                            <p>No hay sucursales disponibles en esta región.</p>
                        </div>
                    )}
                </div>

                {/* Map section */}
                {showMap && selectedRegion && filteredSucursales.length > 0 && (
                    <div className="mt-12">
                        <h3 className="mb-4 font-bold text-xl text-center">Ubicaciones</h3>
                        <div className="flex justify-center items-center bg-gray-100 rounded-lg h-[400px]">
                            <p className="text-gray-500">
                                Mapa será implementado aquí
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function SucursalCard({ sucursal, variant }: { sucursal: any, variant: string }) {
    if (variant === 'compact') {
        return (
            <div className="p-4 border rounded-lg">
                <h3 className="font-bold">{sucursal.title}</h3>
                <div className="flex items-start mt-2">
                    <MapPin className="flex-shrink-0 mt-1 w-4 h-4 text-gray-500" />
                    <span className="ml-2 text-sm">{sucursal.direccion}</span>
                </div>
                {sucursal.telefono && (
                    <div className="flex items-center mt-2">
                        <Phone className="flex-shrink-0 w-4 h-4 text-gray-500" />
                        <span className="ml-2 text-sm">{sucursal.telefono}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`p-4 border rounded-lg overflow-hidden ${variant === 'cards' ? '' : 'max-w-4xl mx-auto'}`}>
            <div className="flex flex-col gap-4 p-4">
                <h3 className="font-bold text-lg heading-3">{sucursal.title}</h3>
                <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="mr-1 w-4 h-4" /> {sucursal.direccion}
                </div>
            </div>
            <div className="p-4">
                <div className="space-y-2 pb-4 border-b">
                    {/* Contact information */}
                    {sucursal.telefono && (
                        <div className="flex items-center">
                            <Phone className="mr-2 w-4 h-4 text-gray-500" />
                            <span>{sucursal.telefono}</span>
                        </div>
                    )}
                    {sucursal.email && (
                        <div className="flex items-center">
                            <Mail className="mr-2 w-4 h-4 text-gray-500" />
                            <span>{sucursal.email}</span>
                        </div>
                    )}
                </div>

                {/* Personas */}
                {sucursal.personas && sucursal.personas.length > 0 && (
                    <div className="mt-4">
                        <div className="gap-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                            {sucursal.personas.map((persona: any, index: number) => (
                                <div
                                    key={`${sucursal._id}-persona-${index}`}
                                    className="pt-2"
                                >
                                    <div className="flex items-center mb-1">
                                        <User className="mr-2 w-4 h-4 text-gray-500" />
                                        <span className="font-medium">{persona.nombre}</span>
                                    </div>
                                    <div className="ml-6 text-gray-600 text-sm">
                                        <p>{persona.cargo}</p>
                                        {persona.telefono && <p>Tel: {persona.telefono}</p>}
                                        {persona.email && <p>Email: {persona.email}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 