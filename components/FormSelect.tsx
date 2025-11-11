// Definimos los 'props' que este componente espera
interface FormSelectProps {
    label: string;
    name: string;
    value: string | number; // El valor seleccionado
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; // Función al cambiar
    options: { value: string | number; label: string }[]; // Array de opciones
}

export default function FormSelect({
    label,
    name,
    value,
    onChange,
    options,
}: FormSelectProps) {
    return (
        <div>
            <label htmlFor={name} className="mb-2 font-semibold text-black">
                {label}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full bg-green-900 text-white rounded-lg focus:bg-green-700 focus:outline-none p-2.5 transition-colors hover:bg-green-800" // Estilo oscuro
            >
                {/* Mapeamos el array de opciones a elementos <option> */}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
