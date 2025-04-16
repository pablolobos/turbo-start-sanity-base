import { NextResponse } from "next/server";
import { client } from "@/lib/sanity/client"; // Use the direct client for testing
import { SEARCH_QUERY, type SEARCH_QUERYResult } from "@/lib/sanity/query";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const searchTerm = searchParams.get("q");

        console.log("Search term:", searchTerm);

        if (!searchTerm) {
            return NextResponse.json({ results: [] }, { status: 200 });
        }

        // Using * as wildcards to match partial words
        const sanitizedSearchTerm = `*${searchTerm}*`;
        console.log("Sanitized search term:", sanitizedSearchTerm);

        // Try using the direct client instead of sanityFetch for troubleshooting
        const results = await client.fetch(SEARCH_QUERY, {
            searchTerm: sanitizedSearchTerm
        });

        console.log("Search results count:", results?.results?.length || 0);

        // Return the results directly
        return NextResponse.json({
            results: results?.results || []
        }, { status: 200 });
    } catch (error: unknown) {
        console.error("Search error type:", typeof error);
        console.error("Search error message:", error instanceof Error ? error.message : String(error));
        console.error("Search error stack:", error instanceof Error ? error.stack : "No stack trace available");

        return NextResponse.json(
            { results: [], error: `Error: ${error instanceof Error ? error.message : String(error)}` },
            { status: 500 }
        );
    }
} 