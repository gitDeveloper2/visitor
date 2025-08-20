"use client";

import React from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { parseISO, format } from "date-fns";
import "react-day-picker/style.css";
import DayAvailabilityButton from "./DayButton";

type Props = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  productId: string;
};

const MAX_PER_DAY = 20;

const fetchOverview = async (productId: string) => {
  const res = await fetch(`/api/booking/availability?productId=${productId}`);
  console.log(res)
  if (!res.ok) throw new Error("Failed to fetch availability");
  return res.json();
};

const reserveSlot = async (date: string, productId: string) => {
  const res = await fetch("/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, productId }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Reservation failed");
  return data;
};

const CustomDayPicker: React.FC<Props> = ({ value, onChange, productId }) => {
  const [availabilityMap, setAvailabilityMap] = React.useState<Map<string, number>>(new Map());
  const [currentBookedDate, setCurrentBookedDate] = React.useState<Date | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchOverview(productId)
      .then((data) => {
        setAvailabilityMap(new Map(Object.entries(data.availability)));
        if (data.currentProductDate) {
          const date = new Date(data.currentProductDate);
          setCurrentBookedDate(date);
          if (!value) {
            onChange(date);
          }
        }
      })
      .catch(() => alert("Could not load availability."));
  }, [productId]);

  const today = new Date();
  const twentyDaysFromNow = new Date(today);
  twentyDaysFromNow.setDate(today.getDate() + 20);

  const defaultClassNames = getDefaultClassNames();

  const fullDates = Array.from(availabilityMap.entries())
    .filter(([, remaining]) => remaining <= 0)
    .map(([date]) => parseISO(date));

  const lowDates = Array.from(availabilityMap.entries())
    .filter(([, remaining]) => remaining > 0 && remaining <= 2)
    .map(([date]) => parseISO(date));

  const handleReserve = async (date: Date | undefined) => {
    if (!date) return;
    const key = format(date, "yyyy-MM-dd");
    const remaining = availabilityMap.get(key) ?? MAX_PER_DAY;

    if (remaining <= 0) {
      alert("This date is fully booked.");
      return;
    }

    if (currentBookedDate && format(currentBookedDate, "yyyy-MM-dd") === key) {
      onChange(date); // already booked, just change state
      return;
    }

    try {
      setLoading(true);
      const result = await reserveSlot(key, productId);

      if (result.success) {
        onChange(date);
        setCurrentBookedDate(date);
        setAvailabilityMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(key, remaining - 1);
          return newMap;
        });
      }
    } catch (err: any) {
      alert(err.message || "Could not reserve date.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <p style={{ fontSize: "18px", color: "#f97316", fontWeight: "bold" }}>
        Select Launch Date
      </p>
      <p style={{ fontSize: "14px", color: "#6b7280" }}>
        Selected: {value?.toLocaleDateString() || "None"}
      </p>

      <DayPicker
        mode="single"
        selected={value}
        onDayClick={(date, modifiers, e) => {
          if (modifiers.disabled) {
            e.preventDefault();
            return alert("You can't select a disabled date.");
          }
          handleReserve(date);
        }}
        fromDate={today}
        toDate={twentyDaysFromNow}
        disabled={[{ before: today }, ...fullDates]}
        modifiers={{ low: lowDates }}
        modifiersStyles={{
          low: {
            backgroundColor: "#facc15",
            borderRadius: "9999px",
          },
        }}
        classNames={{
          selected: "",
          root: defaultClassNames.root,
          day: defaultClassNames.day,
          caption_label: "",
        }}
        components={{
          DayButton: (props) => (
            <DayAvailabilityButton
              {...props}
              remainingMap={availabilityMap}
              selectedDate={value}
            />
          ),
        }}
      />

      {loading && (
        <p style={{ marginTop: "0.5rem", color: "#6b7280" }}>Reserving slot...</p>
      )}
    </div>
  );
};

export default CustomDayPicker;
