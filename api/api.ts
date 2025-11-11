import { ResultType } from "@/types/resultType";
import { FormType } from "@/types/formType";
import { ResponseType } from "@/types/responseType";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postPrediction(data: FormType): Promise<ResponseType> {
    try {
        console.log("Posting prediction to API:", API_URL + "/predict", data);
        const response = await fetch(API_URL + "/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            return {
                status: false,
                error: `Error ${response.status} del servidor`,
                message: await response.text(),
            };
        }

        return {
            status: true,
            data: await response.json(),
        };
    } catch (error) {
        console.error("Error posting prediction:", error);
        return {
            status: false,
            error: (error as Error).message,
        };
    }
}

export async function getStatus(): Promise<{ status: string }> {
    try {
        console.log("Fetching status from API:", API_URL + "/status");
        const response = await fetch(API_URL + "/status");

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error fetching status:", error);
        throw error;
    }
}
