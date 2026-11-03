type Option = { value: string; label: string; description?: string };

type RadioGroupProps = {
  name: string;
  legend: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  errors?: string[];
  required?: boolean;
};

/** Grupo de opciones grande y fácil de tocar en el teléfono. */
export function RadioGroup({ name, legend, options, value, onChange, errors, required }: RadioGroupProps) {
  const errorId = errors?.length ? `${name}-error` : undefined;
  return (
    <fieldset aria-describedby={errorId} className="flex flex-col gap-2">
      <legend className="mb-1.5 text-sm font-bold text-carbon">
        {legend}
        {required && (
          <span aria-hidden="true" className="text-red-700">
            {" "}*
          </span>
        )}
      </legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const id = `${name}-${option.value}`;
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              htmlFor={id}
              className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 px-3 py-2 transition-colors ${
                checked ? "border-verde-700 bg-verde-700/5" : "border-neutral-300 bg-white hover:border-neutral-400"
              }`}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                required={required}
                className="size-5 accent-verde-700"
              />
              <span className="flex flex-col">
                <span className="font-bold">{option.label}</span>
                {option.description && <span className="text-sm text-gris">{option.description}</span>}
              </span>
            </label>
          );
        })}
      </div>
      {errorId && (
        <p id={errorId} className="text-sm font-bold text-red-700">
          {errors![0]}
        </p>
      )}
    </fieldset>
  );
}
