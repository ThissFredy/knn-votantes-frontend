import { ResponseType } from "@/types/responseType";
import { CandidateType } from "@/types/candidatesType";
import { HealthType } from "@/types/healthType";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postPrediction(data: any): Promise<ResponseType> {
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

        const responseData = await response.json();
        console.log("Prediction posted successfully", responseData);

        return {
            status: true,
            data: await responseData,
        };
    } catch (error) {
        console.error("Error posting prediction:", error);
        return {
            status: false,
            error: "Error al conectar con el servidor",
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

export async function getCandidates(): Promise<ResponseType> {
    try {
        console.log("Fetching candidates from API:", API_URL + "/candidates");

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(API_URL + "/candidates", {
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return {
                status: false,
                error: `Error ${response.status} del servidor`,
                message: await response.text(),
            };
        }

        console.log("Candidates fetched successfully", response);

        const result = await response.json();
        console.log("Candidates data:", result);
        return {
            status: true,
            data: result.candidates as CandidateType[],
        };
    } catch (error) {
        // Distinguish between an AbortError (timeout) and other errors.
        if ((error as Error)?.name === "AbortError") {
            // Timeout is expected behavior when request takes too long.
            console.warn("getCandidates: request aborted (timeout)");
            return {
                status: false,
                error: "Request timed out",
            };
        }

        console.error("Error fetching candidates:", (error as Error).message);
        return {
            status: false,
            error: (error as Error).message,
        };
    }
}

export async function getHealth(): Promise<HealthType> {
    try {
        console.log("Fetching health status from API:", API_URL + "/health/db");
        const response = await fetch(API_URL + "/health/db");

        if (!response.ok) {
            return {
                status: false,
                message: "Base de datos no disponible",
            };
        }

        return {
            status: true,
            message: "Base de datos funcionando correctamente",
        };
    } catch (error) {
        console.error("Error fetching health status:", error);
        return {
            status: false,
            message: "No se pudo conectar con la base de datos",
        };
    }
}

export async function getBackendHealth(): Promise<HealthType> {
    try {
        console.log(
            "Fetching health status from API:",
            API_URL + "/health/backend"
        );
        const response = await fetch(API_URL + "/health/backend");

        if (!response.ok) {
            return {
                status: false,
                message: "Backend no disponible",
            };
        }

        return {
            status: true,
            message: "Backend funcionando correctamente",
        };
    } catch (error) {
        console.error("Error fetching health status:", error);
        return {
            status: false,
            message: "No se pudo conectar con el backend",
        };
    }
}
