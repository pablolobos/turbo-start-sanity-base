"use client";

import { Search as SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger
} from "@workspace/ui/components/dialog";
import Link from "next/link";
import Image from "next/image";
import { type SEARCH_QUERYResult } from "@/lib/sanity/query";
import { Loader } from "@/components/ui/loader";

export function Search() {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<SEARCH_QUERYResult["results"]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleSearch = async () => {
        if (!searchTerm || !searchTerm.trim()) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm.trim())}`);
            const data = await response.json();
            console.log("Search response:", data);

            if (data && Array.isArray(data.results)) {
                setResults(data.results);
            } else {
                console.error("Invalid search results format:", data);
                setResults([]);
            }
        } catch (error) {
            console.error("Search error:", error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm && searchTerm.trim()) {
                handleSearch();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };

    // Focus the search input when dialog opens
    useEffect(() => {
        if (open && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 100);
        }
    }, [open]);

    const clearSearch = () => {
        setSearchTerm("");
        setResults([]);
    };

    // Helper function to generate the correct URL for each content type
    const getContentTypeUrl = (result: SEARCH_QUERYResult["results"][0]) => {
        if (!result.slug) return "#";

        // Extract the last part of the slug to avoid duplication
        const extractSlugLastPart = (slug: string, prefix: string) => {
            if (slug.startsWith(prefix)) {
                // If the slug already has the prefix, extract just the last part
                return slug.replace(prefix, '');
            }
            return slug;
        };

        switch (result._type) {
            case "page":
                // For a page, just use the slug as is or remove any prefix
                return result.slug.startsWith('/')
                    ? result.slug
                    : `/${result.slug}`;
            case "blog":
                // For blogs, extract just the last part after /noticias/ if present
                return `/noticias/${extractSlugLastPart(result.slug, '/noticias/')}`;
            case "camiones":
                // For camiones, extract just the last part after /camiones/ if present
                return `/camiones/${extractSlugLastPart(result.slug, '/camiones/')}`;
            case "buses":
                // For buses, extract just the last part after /buses/ if present
                return `/buses/${extractSlugLastPart(result.slug, '/buses/')}`;
            case "motoresPenta":
                // For motores penta, extract just the last part after /motores-penta/ if present
                return `/motores-penta/${extractSlugLastPart(result.slug, '/motores-penta/')}`;
            default:
                return `/${result.slug}`;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="right-10 relative" aria-label="Search">
                    <SearchIcon className="w-5 h-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="z-[101] flex flex-col pt-20 sm:max-w-[550px] h-screen lg:max-h-[80vh]">
                <DialogTitle className="sr-only">Búsqueda</DialogTitle>
                <div className="flex items-center mb-4 border rounded-md h- h-[50px] overflow-hidden">
                    <SearchIcon className="ml-2 w-5 h-5 text-muted-foreground" />
                    <Input
                        ref={searchInputRef}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Buscar en toda la web..."
                    />
                    {searchTerm && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="mr-1 w-8 h-8"
                            onClick={clearSearch}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                <div className="max-h-[60vh] overflow-y-auto">
                    <div className="h-full">
                        {isLoading ? (
                            <div className="flex flex-col justify-center items-center py-16">
                                <Loader size="lg" color="primary" className="mb-3" />
                            </div>
                        ) : results && results.length > 0 ? (
                            <ul className="space-y-4">
                                {results.map((result) => (
                                    <li key={result._id} className="pb-4 border-b">
                                        <Link
                                            href={getContentTypeUrl(result)}
                                            onClick={() => setOpen(false)}
                                            className="flex gap-4 hover:bg-muted p-2 rounded-md transition-colors"
                                        >
                                            {result.image?.asset && (
                                                <div className="relative flex-shrink-0 w-16 h-16">
                                                    <Image
                                                        src={`${result.image.blurData || ''}`}
                                                        alt={result.image.alt || "Search result image"}
                                                        fill
                                                        className="rounded-md object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-secondary px-2 py-0.5 rounded-full text-xs">
                                                        {result._type === 'page' ? 'Página' :
                                                            result._type === 'blog' ? 'Blog' :
                                                                result._type === 'camiones' ? 'Camión' :
                                                                    result._type === 'buses' ? 'Bus' :
                                                                        result._type === 'motoresPenta' ? 'Motor Penta' : ''}
                                                    </span>
                                                    {result.category && (
                                                        <span className="bg-muted px-2 py-0.5 rounded-full text-xs">
                                                            {result.category}
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="mt-1 font-semibold">{result.title || ''}</h3>
                                                {result.description && (
                                                    <p className="text-muted-foreground text-sm line-clamp-2">
                                                        {result.description}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : searchTerm ? (
                            <div className="py-8 text-center">
                                No se encontraron resultados para &quot;{searchTerm}&quot;
                            </div>
                        ) : null}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 