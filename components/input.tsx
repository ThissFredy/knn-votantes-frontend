interface FormInputProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function FormInput({
    label,
    name,
    value,
    onChange,
}: FormInputProps) {
    return (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-2 font-semibold text-black">
                {label}
            </label>
            <input
                type="number"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                required
                className="bg-green-900 text-white rounded-lg focus:bg-green-700 focus:outline-none p-2.5 transition-colors hover:bg-green-800"
            />
        </div>
    );
}
