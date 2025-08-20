import React from "react";
import { format } from "date-fns";

type Props = {
  day: Date | { date: Date };
  remainingMap: Map<string, number>;
  selectedDate?: Date;
} & React.HTMLAttributes<HTMLButtonElement>;

const DayAvailabilityButton: React.FC<Props> = ({
  day,
  remainingMap,
  selectedDate,
  ...buttonProps
}) => {
  const date = (day as any).date ?? day;
  const key = format(date, "yyyy-MM-dd");
  const remaining = remainingMap.get(key);
  const isSelected = selectedDate && format(selectedDate, "yyyy-MM-dd") === key;
  const isUnknown = !remainingMap.has(key);

  let labelColor = "";
  if (remaining === 1) labelColor = "#dc2626";
  else if (remaining === 2) labelColor = "#facc15";
  else if (remaining && remaining >= 3) labelColor = "#16a34a";

  return (
    <button
      {...buttonProps}
      style={{
        width: "52px",
        height: "60px",
        margin: "3px",
        padding: "4px",
        backgroundColor: isSelected ? "#2563eb" : "#fff",
        color: isSelected ? "#fff" : isUnknown ? "#9ca3af" : "#111827", // ← dim text if unknown
        border: isSelected ? "2px solid #2563eb" : "1px solid #d1d5db",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxShadow: isSelected
          ? "0 0 0 2px rgba(37, 99, 235, 0.25)"
          : "0 1px 2px rgba(0,0,0,0.05)",
        transition: "all 0.2s ease-in-out",
        position: "relative",
        overflow: "hidden",
        fontSize: "14px",
        cursor: "pointer",
        opacity: isUnknown ? 0.7 : 1, // ← optional subtle transparency
        ...buttonProps.style,
      }}
    >
      {/* Availability Badge */}
      {typeof remaining === "number" && remaining > 0 && (
        <div
          style={{
            position: "absolute",
            top: "4px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "10px",
            fontWeight: 600,
            backgroundColor: "#f3f4f6",
            color: labelColor,
            padding: "1px 6px",
            borderRadius: "9999px",
            lineHeight: 1,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {remaining} left
        </div>
      )}

      {/* Date Number */}
      <span
  style={{
    marginTop: typeof remaining === "number" && remaining > 0 ? "18px" : "0",
    fontWeight: "bold",
    fontSize: "14px",
    color: isSelected ? "#fff" : "#111827", // Make text black if not selected
    opacity: remaining === undefined ? 1 : 1, // Ensure untracked dates are not faded
  }}
>
  {date.getDate()}
</span>

    </button>
  );
};

export default DayAvailabilityButton;
