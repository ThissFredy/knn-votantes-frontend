import type { CandidateType } from "@/types/candidatesType";
import Image from "next/image";

interface CandidatesPresentationProps {
    candidates: CandidateType[];
}

export default function Presentation({
    candidates,
}: CandidatesPresentationProps) {
    return (
        <section className="mb-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-green-800 mb-2">
                    Candidatos Disponibles
                </h2>
                <p className="text-gray-600">
                    Conoce a los candidatos sobre los cuales realizarás tu
                    predicción
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {candidates.map((candidate) => (
                    <div
                        key={candidate.name}
                        className="bg-white border-2 border-green-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl hover:border-green-400 transition-all duration-300 hover:scale-105 hover:cursor-pointer hover:bg-green-50">
                        {/* Candidate Info */}
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-green-800 mb-2">
                                {candidate.name}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-6 bg-green-50 border-l-4 border-green-600 rounded">
                <p className="text-gray-700">
                    <span className="font-bold text-green-800">
                        💡 Consejo:
                    </span>{" "}
                    Revisa la información de cada candidato para hacer una
                    predicción más informada.
                </p>
            </div>
        </section>
    );
}
