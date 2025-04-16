import { client } from "@/lib/sanity/client";
import { COTIZADOR_SETTINGS_QUERY } from "@/lib/sanity/query";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await client.fetch(COTIZADOR_SETTINGS_QUERY);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error fetching cotizador data:", error);
        return NextResponse.json(
            { error: "Failed to load cotizador data" },
            { status: 500 }
        );
    }
} 