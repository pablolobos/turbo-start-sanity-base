'use client';

import { ChevronDown, FilterIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface CategoryFilterProps {
    categories: string[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Show selected category and hide others
    const showCategory = (categoryId: string) => {
        try {
            // Hide all mobile category sections
            const allCategorySections = document.querySelectorAll('#todos, [id^="componentes-"], [id^="filtros"], [id^="frenos"], [id^="lubricantes-"], [id^="sistema-"]');

            allCategorySections.forEach(section => {
                if (section.id && section.id.indexOf('desktop-') === -1 && section instanceof HTMLElement) {
                    section.style.display = 'none';
                }
            });

            // Show the selected section
            const targetSection = document.getElementById(categoryId);
            if (targetSection) {
                targetSection.style.display = 'block';
            } else {
                // Fallback to todos if section not found
                const todosSection = document.getElementById('todos');
                if (todosSection) {
                    todosSection.style.display = 'block';
                }
            }
        } catch (error) {
            // Fallback to showing everything on error
            document.querySelectorAll('.category-section').forEach(section => {
                if (section instanceof HTMLElement) {
                    section.style.display = 'block';
                }
            });
        }
    };

    // Handle dropdown change
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const category = e.target.value;
        setSelectedCategory(category);

        // Update URL hash and show the appropriate section
        const hash = category === "all" ? "todos" : category.replace(/\s+/g, '-').toLowerCase();
        window.location.hash = hash;

        // Small delay to ensure DOM is updated
        setTimeout(() => showCategory(hash), 50);
    };

    // Handle URL hash changes
    useEffect(() => {
        const handleHashChange = () => {
            // Get and decode the hash
            const hash = decodeURIComponent(window.location.hash.replace('#', '')) || 'todos';

            // Handle default case
            if (hash === 'todos') {
                setSelectedCategory("all");
                showCategory('todos');
                return;
            }

            // Find matching category
            const matchingCategory = categories.find(cat =>
                cat.replace(/\s+/g, '-').toLowerCase() === hash
            );

            if (matchingCategory) {
                setSelectedCategory(matchingCategory);
                showCategory(hash);
            } else {
                // Fallback to all
                setSelectedCategory("all");
                showCategory('todos');
            }
        };

        // Initial run after a delay to ensure DOM is ready
        const timer = setTimeout(handleHashChange, 500);

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
            clearTimeout(timer);
        };
    }, [categories]);

    return (
        <div className="md:hidden mb-6">
            <label htmlFor="categoryFilter" className="flex items-center mb-2 font-medium text-sm">
                <FilterIcon className="mr-2 w-4 h-4" />
                Filtrar por categoría
            </label>
            <div className="relative">
                <select
                    id="categoryFilter"
                    className="bg-input px-4 py-2 border border-gray-300 rounded-md w-full appearance-none"
                    value={selectedCategory}
                    onChange={handleSelectChange}
                >
                    <option value="all">Todos los repuestos</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <ChevronDown className="top-1/2 right-3 absolute w-5 h-5 text-gray-500 -translate-y-1/2 pointer-events-none transform" />
            </div>
        </div>
    );
} 