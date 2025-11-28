interface FormInputProps {
  label: string;
  name: string;
  type: 'text' | 'number';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export default function FormInput({
  label,
  name,
  type,
  value,
  onChange,
  error,
  required = false,
  placeholder,
}: FormInputProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 font-medium mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 border-2 rounded-lg transition-colors duration-200
          ${error
            ? 'border-red-400 bg-red-50'
            : 'border-gray-200 focus:border-roomingkos-500 hover:border-gray-300'
          }
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
