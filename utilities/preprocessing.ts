import { UserInput } from "@/types/formType";

// 2. Define el tipo del OUTPUT (lo que la API espera)
export interface ApiPayload {
    [key: string]: number; // Permite llaves dinámicas
}

/**
 * Traduce las respuestas simples del usuario al formato complejo (procesado)
 * que espera la API, incluyendo el One-Hot Encoding.
 *
 * @param userInput Las 5 respuestas simples del formulario.
 * @param allCandidateNames Una lista de TODOS los nombres de candidatos (ej. ["CAND_Azon", "CAND_Boreal", ...])
 * @returns El objeto (payload) listo para enviar a la API.
 */
export const processFormData = (
    userInput: UserInput,
    allCandidateNames: string[]
): ApiPayload => {
    const payload: ApiPayload = {};

    // --- 1. Procesar Ordinales ---
    // El modelo fue entrenado con MinMax(0,1), así que "0" y "1" se convierten en 0.0 y 1.0
    // (Tu API espera 'float' para estos campos)
    payload["ord__has_children"] = parseFloat(String(userInput.has_children));
    payload["ord__home_owner"] = parseFloat(String(userInput.home_owner));
    payload["ord__public_sector"] = parseFloat(String(userInput.public_sector));
    payload["ord__union_member"] = parseFloat(String(userInput.union_member));

    // --- 2. Procesar Nominales (One-Hot Encoding) ---
    const ohePrefix = "nom__primary_choice_";

    allCandidateNames.forEach((candidateName) => {
        const columnName = `${ohePrefix}${candidateName}`;

        // Si el candidato actual es el que el usuario seleccionó, pon 1.0
        if (userInput.primary_choice === candidateName) {
            payload[columnName] = 1.0;
        } else {
            // De lo contrario, pon 0.0
            payload[columnName] = 0.0;
        }
    });

    return payload;
};
