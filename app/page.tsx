"use client";

import { useState, useEffect } from "react";
import FormSelect from "@/components/FormSelect";
import Presentation from "@/components/presentation";

import FormInput from "@/components/input";
import { ResultType } from "@/types/resultType";
import { FormType } from "@/types/formType";
import { CandidateType } from "@/types/candidatesType";

import { postPrediction } from "@/api/api";
import { getCandidates } from "@/api/api";

import Loading from "@/components/LoadingSpinner";
import Error from "@/components/error";

const yesNoOptions = [
  { value: 0, label: "No" },
  { value: 1, label: "Sí" },
];

const householdSizeOptions = [
  { value: 0, label: "Vivo solo/a" },
  { value: 1, label: "2 personas" },
  { value: 2, label: "3 personas" },
  { value: 3, label: "4 personas" },
  { value: 4, label: "5 personas" },
  { value: 5, label: "6 personas" },
  { value: 6, label: "7 personas" },
  { value: 7, label: "8 o más personas" },
];

const hoursOptions = [
  { value: 0, label: "0 horas" },
  { value: 1, label: "Menos de 1 hora" },
  { value: 2, label: "1-2 horas" },
  { value: 3, label: "3-4 horas" },
  { value: 4, label: "5-6 horas" },
  { value: 5, label: "7 o más horas" },
];

const genderOptions = [
  { value: 2, label: "Masculino" },
  { value: 1, label: "Femenino" },
  { value: 0, label: "Otro / Prefiero no decir" },
];

const urbanicityOptions = [
  { value: 0, label: "Rural" },
  { value: 1, label: "Urbano (Ciudad grande)" },
  { value: 2, label: "Urbano (Ciudad pequeña)" },
];

const educationOptions = [
  { value: 0, label: "Primaria" },
  { value: 1, label: "Secundaria" },
  { value: 2, label: "Técnico / Superior (Incompleto)" },
  { value: 3, label: "Universitario (Completo)" },
  { value: 4, label: "Postgrado (Maestría, Doctorado)" },
  { value: 5, label: "Otro / Prefiero no decir" },
];

const employmentStatusOptions = [
  { value: 0, label: "Empleado (Tiempo completo)" },
  { value: 1, label: "Empleado (Medio tiempo)" },
  { value: 2, label: "Desempleado" },
  { value: 3, label: "Estudiante" },
  { value: 4, label: "Retirado / Jubilado" },
  { value: 5, label: "Hogar" },
];

const incomeOptions = [
  { value: 0, label: "1 SMMLV" },
  { value: 1, label: "2 SMMLV" },
  { value: 2, label: "3 - 4 SMMLV" },
  { value: 3, label: "5 - 6 SMMLV" },
  { value: 4, label: "7 o más SMMLV" },
];

const employmentSectorOptions = [
  { value: 0, label: "Sector Privado" },
  { value: 1, label: "Sector Público (Gobierno)" },
  { value: 2, label: "Organización sin fines de lucro" },
  { value: 3, label: "Independiente / Autónomo" },
  { value: 4, label: "No aplica (Desempleado, Estudiante, etc.)" },
  { value: 5, label: "Otro / Prefiero no decir" },
];

const maritalStatusOptions = [
  { value: 0, label: "Soltero/a" },
  { value: 1, label: "Casado/a o en unión libre" },
  { value: 2, label: "Divorciado/a" },
  { value: 3, label: "Viudo/a" },
  { value: 4, label: "Otro / Prefiero no decir" },
];

const scaleOptions = (labels: string[]) => {
  return labels.map((label, index) => ({ value: index, label }));
};

const preferenceStrengthOptions = scaleOptions([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
]);
const confidenceOptions = scaleOptions([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
]);
const trustMediaOptions = scaleOptions([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
]);
const civicParticipationOptions = scaleOptions([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
]);

const waParticipations = scaleOptions([
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
]);

const partyStrengthOptions = scaleOptions([
  "No me identifico",
  "Débil",
  "Moderada",
  "Fuerte",
  "Muy fuerte",
]);

const attentionCheckOptions = [
  { value: 0, label: "Satisfactorio" },
  { value: 1, label: "Insatisfactorio" },
];

export default function HomePage() {
  const [userInput, setUserInput] = useState<FormType>({
    age: 0,
    household_size: 0,
    refused_count: 0,
    tv_news_hours: 0,
    social_media_hours: 0,
    job_tenure_years: 0,
    has_children: 0,
    gender: 0,
    urbanicity: 0,
    education: 0,
    employment_status: 0,
    income_bracket: 0,
    employment_sector: 0,
    marital_status: 0,
    small_biz_owner: 0,
    owns_car: 0,
    preference_strength: 0,
    survey_confidence: 0,
    trust_media: 0,
    civic_participation: 0,
    wa_groups: 0,
    voted_last: 0,
    home_owner: 0,
    attention_check: 0,
    public_sector: 0,
    party_id_strength: 0,
    union_member: 0,
    primary_choice: "",
    secondary_choice: "",
  });

  const [result, setResult] = useState<ResultType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState(false);
  const [backError, setBackerror] = useState(false);
  const [candidates, setCandidates] = useState<CandidateType[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    const stringFields = ["primary_choice", "secondary_choice"];

    if (stringFields.includes(name)) {
      setUserInput((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setUserInput((prevData) => ({
        ...prevData,
        [name]: parseInt(value, 10),
      }));
    }
  };

  const candidateOptions = candidates.map((candidate) => ({
    value: candidate.name,
    label: candidate.name,
  }));

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

    try {
      const response = await postPrediction(userInput);

      if (response.status) {
        setResult(response.data);
      } else {
        setError(true);
        setErrorMessage(response.error || "Error desconocido");
      }
    } catch (error) {
      setError(true);
      setErrorMessage(
        "Error al conectar con el servidor: " + (error as Error).message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return isPageLoading ? (
    <Loading />
  ) : backError ? (
    <Error />
  ) : (
    <main className="bg-white text-white items-center justify-center p-4 min-h-screen">
      <Presentation candidates={candidates} />
      <div className="w-3/4 mx-auto bg-white rounded-lg shadow-2xl p-8 my-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-green-800">
          Predicción de Intención de Voto
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Responde las siguientes preguntas para predecir tu intención de voto.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid para los campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* --- PREGUNTAS DEMOGRÁFICAS --- */}
            <FormInput
              label="Rango de Edad"
              name="age"
              value={userInput.age}
              onChange={handleInputChange}
              props={{ min: 0, max: 100 }}
            />
            <FormSelect
              label="Género"
              name="gender"
              value={userInput.gender}
              onChange={handleSelectChange}
              options={genderOptions}
            />
            <FormSelect
              label="Tamaño del hogar"
              name="household_size"
              value={userInput.household_size}
              onChange={handleSelectChange}
              options={householdSizeOptions}
            />
            <FormSelect
              label="Nivel de Urbanicidad"
              name="urbanicity"
              value={userInput.urbanicity}
              onChange={handleSelectChange}
              options={urbanicityOptions}
            />
            <FormSelect
              label="Nivel Educativo"
              name="education"
              value={userInput.education}
              onChange={handleSelectChange}
              options={educationOptions}
            />
            <FormSelect
              label="Estado Civil"
              name="marital_status"
              value={userInput.marital_status}
              onChange={handleSelectChange}
              options={maritalStatusOptions}
            />
            <FormSelect
              label="¿Tienes hijos?"
              name="has_children"
              value={userInput.has_children}
              onChange={handleSelectChange}
              options={yesNoOptions}
            />
            <FormSelect
              label="¿Eres dueño de casa?"
              name="home_owner"
              value={userInput.home_owner}
              onChange={handleSelectChange}
              options={yesNoOptions}
            />

            {/* --- PREGUNTAS LABORALES Y FINANCIERAS --- */}
            <FormSelect
              label="Estado Laboral"
              name="employment_status"
              value={userInput.employment_status}
              onChange={handleSelectChange}
              options={employmentStatusOptions}
            />
            <FormSelect
              label="Sector Laboral"
              name="employment_sector"
              value={userInput.employment_sector}
              onChange={handleSelectChange}
              options={employmentSectorOptions}
            />
            <FormInput
              label="Antigüedad Laboral"
              name="job_tenure_years"
              value={userInput.job_tenure_years}
              onChange={handleInputChange}
              props={{ min: 0 }}
            />
            <FormSelect
              label="Rango de Ingresos"
              name="income_bracket"
              value={userInput.income_bracket}
              onChange={handleSelectChange}
              options={incomeOptions}
            />
            <FormSelect
              label="¿Trabajas en el sector público?"
              name="public_sector"
              value={userInput.public_sector}
              onChange={handleSelectChange}
              options={yesNoOptions}
            />
            <FormSelect
              label="¿Eres miembro de un sindicato?"
              name="union_member"
              value={userInput.union_member}
              onChange={handleSelectChange}
              options={yesNoOptions}
            />
            <FormSelect
              label="¿Eres dueño de un pequeño negocio?"
              name="small_biz_owner"
              value={userInput.small_biz_owner}
              onChange={handleSelectChange}
              options={yesNoOptions}
            />
            <FormSelect
              label="¿Posees un automóvil?"
              name="owns_car"
              value={userInput.owns_car}
              onChange={handleSelectChange}
              options={yesNoOptions}
            />

            {/* --- HÁBITOS Y OPINIONES --- */}
            <FormSelect
              label="Horas de noticias en TV (por día)"
              name="tv_news_hours"
              value={userInput.tv_news_hours}
              onChange={handleSelectChange}
              options={hoursOptions}
            />
            <FormSelect
              label="Horas en redes sociales (por día)"
              name="social_media_hours"
              value={userInput.social_media_hours}
              onChange={handleSelectChange}
              options={hoursOptions}
            />
            <FormSelect
              label="¿Votaste en la última elección?"
              name="voted_last"
              value={userInput.voted_last}
              onChange={handleSelectChange}
              options={yesNoOptions}
            />
            <FormSelect
              label="Partido de preferencia"
              name="party_id_strength"
              value={userInput.party_id_strength}
              onChange={handleSelectChange}
              options={partyStrengthOptions}
            />
            <FormSelect
              label="Confianza en los medios"
              name="trust_media"
              value={userInput.trust_media}
              onChange={handleSelectChange}
              options={trustMediaOptions}
            />
            <FormSelect
              label="Participación cívica"
              name="civic_participation"
              value={userInput.civic_participation}
              onChange={handleSelectChange}
              options={civicParticipationOptions}
            />
            <FormSelect
              label="¿Participas en grupos (WA, etc.)? ¿Cuantos?"
              name="wa_groups"
              value={userInput.wa_groups}
              onChange={handleSelectChange}
              options={waParticipations}
            />
            <FormSelect
              label="Fuerza de preferencia (candidato)"
              name="preference_strength"
              value={userInput.preference_strength}
              onChange={handleSelectChange}
              options={preferenceStrengthOptions}
            />
            <FormSelect
              label="Seguridad en tus respuestas"
              name="survey_confidence"
              value={userInput.survey_confidence}
              onChange={handleSelectChange}
              options={confidenceOptions}
            />
            <FormSelect
              label="Atención: selecciona 'Opción 3'"
              name="attention_check"
              value={userInput.attention_check}
              onChange={handleSelectChange}
              options={attentionCheckOptions}
            />

            {/* --- PREGUNTAS PRINCIPALES (Ocupan 2 columnas) --- */}
            <div className="md:col-span-2">
              <FormSelect
                label="Elección Primaria de Candidato"
                name="primary_choice"
                value={userInput.primary_choice}
                onChange={handleSelectChange}
                options={candidateOptions}
              />
            </div>
            <div className="md:col-span-2">
              <FormSelect
                label="Elección Secundaria de Candidato"
                name="secondary_choice"
                value={userInput.secondary_choice}
                onChange={handleSelectChange}
                options={candidateOptions}
              />
            </div>
          </div>

          {/* --- Botón de Envío --- */}
          <button
            type="submit"
            disabled={isLoading || candidates.length === 0}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-101 hover:cursor-pointer"
          >
            {isLoading ? "Prediciendo..." : "Predecir Intención de Voto"}
          </button>
        </form>

        {/* --- SECCIÓN DE RESULTADOS --- */}
        <div className="mt-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded-lg">
              <h3 className="font-bold">Error</h3>
              <p>{errorMessage}</p>
            </div>
          )}
          {result && (
            <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">
                Resultado de la Predicción:
              </h3>
              <p className="text-2xl">
                Candidato:{" "}
                <span className="font-mono font-bold text-green-900">
                  {result.predicted_candidate}
                </span>
              </p>
              <p className="text-sm mt-2">
                Confianza: {Math.round(result.confidence * 100)}%
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
