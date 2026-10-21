/** never define a component inside another component's function body.
 * Always declare components at the top level of the file (or in their own file),
 * so they're created once, not on every render. */
type FormFieldProps = {
  id : string,
  label: string;
  value: string;
  onChange: (value : string) => void;
  type? : string;
  placeholder?: string;
}

export default function FormField({id, label, value, onChange, type = "text", placeholder} : FormFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className="input"
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
