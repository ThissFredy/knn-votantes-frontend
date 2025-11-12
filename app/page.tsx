"use client";

import { useState, useEffect } from "react";
import FormSelect from "@/components/FormSelect";

import { processFormData } from "@/utilities/preprocessing";

import { ResultType } from "@/types/resultType";
import { UserInput } from "@/types/formType";
import { CandidateType } from "@/types/candidatesType";

import { postPrediction } from "@/api/api";
import { getCandidates } from "@/api/api";

import Loading from "@/components/LoadingSpinner";
import Error from "@/components/error";

// Opciones para preguntas de Sí/No
const yesNoOptions = [
    { value: 0, label: "No" },
    { value: 1, label: "Sí" },
];

export default function HomePage() {
    const [userInput, setUserInput] = useState<UserInput>({
        has_children: 0,
        home_owner: 0,
        public_sector: 0,
        union_member: 0,
        primary_choice: "",
    });

    const [result, setResult] = useState<ResultType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [error, setError] = useState(false);
    const [backError, setBackerror] = useState(false);
    const [candidates, setCandidates] = useState<CandidateType[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Si es una de las preguntas Sí/No, convierte el valor a número
        if (name !== "primary_choice") {
            setUserInput((prevData) => ({
                ...prevData,
                [name]: parseInt(value, 10), // value será "0" o "1"
            }));
        } else {
            // Si es 'primary_choice', guárdalo como string
            setUserInput((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const response = await getCandidates();
                if (response.status) {
                    setCandidates(response.data);
                    if (response.data.length > 0) {
                        setUserInput((prev) => ({
                            ...prev,
                            primary_choice: response.data[0].name,
                        }));
                    }
                } else {
                    console.error("Error fetching candidates:", response.error);
                    setBackerror(true);
                }
            } catch (error) {
                console.error("Error fetching candidates:", error);
            } finally {
                setIsPageLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(false);
        setResult(null);

        // --- ¡AQUÍ OCURRE LA MAGIA! ---
        // 1. Obtén la lista de nombres de candidatos
        const allCandidateNames = candidates.map((c) => c.name);

        // 2. Llama al 'traductor' para crear el payload
        const apiPayload = processFormData(userInput, allCandidateNames);
        // -------------------------------

        try {
            // 3. Envía el payload PROCESADO a la API
            const response = await postPrediction(apiPayload);

            if (response.status) {
                setResult(response.data);
            } else {
                setError(true);
                setErrorMessage(response.error || "Error desconocido");
            }
        } catch (error) {
            setError(true);
            setErrorMessage((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return isPageLoading ? (
        <Loading />
    ) : backError ? (
        <Error />
    ) : (
        <main className="bg-white text-white flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-white-900 rounded-lg shadow-2xl p-8">
                <h1 className="text-3xl font-bold text-center mb-2 text-green-800">
                    Predicción de Intención de Voto (k-NN)
                </h1>
                <p className="text-center text-gray-400 mb-6">
                    Responde las siguientes preguntas para predecir tu intención
                    de voto.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Grid para los campos del formulario */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* --- INICIO DE FORMULARIO CORREGIDO --- */}

                        {/* Pregunta 1: has_children */}
                        <FormSelect
                            label="¿Tienes hijos?"
                            name="has_children"
                            value={userInput.has_children}
                            onChange={handleSelectChange}
                            options={yesNoOptions}
                        />

                        {/* Pregunta 2: home_owner */}
                        <FormSelect
                            label="¿Eres dueño de casa?"
                            name="home_owner"
                            value={userInput.home_owner}
                            onChange={handleSelectChange}
                            options={yesNoOptions}
                        />

                        {/* Pregunta 3: public_sector */}
                        <FormSelect
                            label="¿Trabajas en el sector público?"
                            name="public_sector"
                            value={userInput.public_sector}
                            onChange={handleSelectChange}
                            options={yesNoOptions}
                        />

                        {/* Pregunta 4: union_member */}
                        <FormSelect
                            label="¿Eres miembro de un sindicato?"
                            name="union_member"
                            value={userInput.union_member}
                            onChange={handleSelectChange}
                            options={yesNoOptions}
                        />

                        {/* Pregunta 5: primary_choice (Ocupa ambas columnas en pantallas medianas) */}
                        <div className="md:col-span-2">
                            <FormSelect
                                label="Elección Primaria de Candidato"
                                name="primary_choice"
                                value={userInput.primary_choice}
                                onChange={handleSelectChange}
                                options={candidates.map((candidate) => ({
                                    value: candidate.name,
                                    label: candidate.name,
                                }))}
                            />
                        </div>
                        {/* --- FIN DE FORMULARIO CORREGIDO --- */}
                    </div>

                    {/* --- Botón de Envío --- */}
                    <button
                        type="submit"
                        disabled={isLoading || candidates.length === 0} // Deshabilita si no hay candidatos
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-101 hover:cursor-pointer">
                        {isLoading
                            ? "Prediciendo..."
                            : "Predecir Intención de Voto"}
                    </button>
                </form>

                <div className="mt-8">
                    {error && (
                        <div className="bg-red-800 border border-red-600 text-white p-4 rounded-lg">
                            <h3 className="font-bold">Error</h3>
                            <p>{errorMessage}</p>
                        </div>
                    )}
                    {result && (
                        <div className="bg-green-800 border border-green-600 text-white p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2">
                                Resultado de la Predicción:
                            </h3>
                            <p className="text-2xl">
                                Candidato:{" "}
                                <span className="font-mono text-green-300">
                                    {result.predicted_candidate}
                                </span>
                            </p>
                            <p className="text-sm mt-2">
                                Confianza: {Math.round(result.confidence * 100)}
                                %
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
