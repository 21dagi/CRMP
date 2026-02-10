"use server";

import { fetchWithAuth } from "@/lib/api";
import { revalidatePath } from "next/cache";

export async function createDocumentAction() {
    try {
        const newDoc = await fetchWithAuth("/documents", {
            method: "POST",
        });

        revalidatePath("/dashboard");
        return { success: true, document: newDoc };
    } catch (error: any) {
        console.error("Action error:", error);
        return { success: false, error: error.message };
    }
}
