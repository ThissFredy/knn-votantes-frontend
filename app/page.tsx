"use client";

import { useState } from "react";

import FormInput from "@/components/input";
import { FormType } from "@/types/formType";
import { ResultType } from "@/types/resultType";

import { postPrediction } from "@/api/api";

export default function HomePage() {
    const [formData, setFormData] = useState<FormType>({
        age: 55,
        income_bracket: 4,
        party_id_strength: 8,
        tv_news_hours: 3,
        social_media_hours: 1,
        trust_media: 1,
        civic_participation: 2,
    });

    const [result, setResult] = useState<ResultType | null>(null); // { predicted_class: 1, predicted_candidate: 'Candidato B' }
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            // Convertimos el valor a número, ya que el input es 'type="number"'
            [name]: parseInt(value, 10),
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Evita que la página se recargue
        setIsLoading(true);
        setError(false);
        setResult(null);

        try {
            const response = await postPrediction(formData);

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

    return (
        <main className="bg-white text-white flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-white-900 rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center mb-2 text-green-800">
                    Predicción de Intención de Voto (k-NN)
                </h1>
                <p className="text-center text-gray-400 mb-6">
                    Responde la siguiente encuesta para predecir tu intención de
                    voto.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Grid para los campos del formulario */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Generamos un campo de input reutilizable */}
                        <FormInput
                            label="Edad"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                        />
                        <FormInput
                            label="Nivel de Ingresos (1-5)"
                            name="income_bracket"
                            value={formData.income_bracket}
                            onChange={handleChange}
                        />
                        <FormInput
                            label="Fuerza de ID de Partido (1-10)"
                            name="party_id_strength"
                            value={formData.party_id_strength}
                            onChange={handleChange}
                        />
                        <FormInput
                            label="Horas de Noticias TV"
                            name="tv_news_hours"
                            value={formData.tv_news_hours}
                            onChange={handleChange}
                        />
                        <FormInput
                            label="Horas de Redes Sociales"
                            name="social_media_hours"
                            value={formData.social_media_hours}
                            onChange={handleChange}
                        />
                        <FormInput
                            label="Confianza en Medios (1-3)"
                            name="trust_media"
                            value={formData.trust_media}
                            onChange={handleChange}
                        />
                        <FormInput
                            label="Participación Cívica (1-3)"
                            name="civic_participation"
                            value={formData.civic_participation}
                            onChange={handleChange}
                        />
                    </div>

                    {/* --- Botón de Envío --- */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-101 hover:cursor-pointer">
                        {isLoading
                            ? "Prediciendo..."
                            : "Predecir Intención de Voto"}
                    </button>
                </form>

                {/* --- Sección de Resultados --- */}
                <div className="mt-8">
                    {/* Error */}
                    {error && (
                        <div className="bg-red-800 border border-red-600 text-white p-4 rounded-lg">
                            <h3 className="font-bold">Error</h3>
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Resultado Exitoso */}
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
                                (Clase predicha: {result.predicted_class})
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
