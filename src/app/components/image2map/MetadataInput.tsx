export interface MetadataInputProps {
  type: "number" | "text" | "select" | "date" | "datetime-local";
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
}

  
  export default function MetadataInput({ type, label, value, onChange }: MetadataInputProps) {
    return (
      <div style={{ marginBottom: "1rem" }}>
        <label>
          {label}:
          {type === "select" ? (
            <select value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
              <option value="">Select...</option>
              {/* Dynamic options here */}
            </select>
          ) : (
            <input
              type={type}
              value={value ?? ""} // Default to empty string if undefined
              onChange={(e) =>
                onChange(type === "number" ? Number(e.target.value) : e.target.value)
              }
            />
          )}
        </label>
      </div>
    );
  }
  