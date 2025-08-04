import { Grouping, HistoryChartPoint, HistoryPoint, PackageMetrics, TimeRange } from "./compare.types";
import { combinationToHash } from "./constants";

// src/features/compare/api/npmApi.ts
export function getDateRange(timeRange: string): string {
  const today = new Date();
  let startDate: Date;

  switch (timeRange) {
    case "last-7-days":
      startDate = new Date(today.setDate(today.getDate() - 7));
      break;
    case "last-30-days":
      startDate = new Date(today.setDate(today.getDate() - 30));
      break;
    case "last-90-days":
      startDate = new Date(today.setDate(today.getDate() - 90));
      break;
    case "last-year":
      startDate = new Date(today.setFullYear(today.getFullYear() - 1));
      break;
    case "custom":
      // You can handle custom ranges separately if needed
      return "custom";  // Return as is if it's a custom range
    default:
      throw new Error("Unknown time range");
  }

  const endDate = new Date();
  return `${startDate.toISOString().split('T')[0]}:${endDate.toISOString().split('T')[0]}`;
}

 




export function transformHistoryData(
  data: Record<string, PackageMetrics>,
  grouping: Grouping
): HistoryChartPoint[] {
  const raw: Record<string, HistoryChartPoint> = {};

  for (const [pkgName, pkgData] of Object.entries(data)) {
    pkgData.history.downloads.forEach((entry) => {
      if (!raw[entry.day]) {
        raw[entry.day] = { date: entry.day };
      }
      raw[entry.day][pkgName] = entry.downloads;
    });
  }

  const flatData = Object.values(raw).sort((a, b) => (a.date > b.date ? 1 : -1));

  switch (grouping) {
    case "weekly":
      return groupDataByWeek(flatData);
    case "monthly":
      return groupDataByMonth(flatData);
    case "daily":
    default:  
      return flatData;
  }
}



export function getTimeRangeLabel(range: TimeRange): string {
  switch (range) {
    case "last-7-days":
      return "Last 7 Days";
    case "last-30-days":
      return "Last 30 Days";
    case "last-90-days":
      return "Last 90 Days";
    case "last-year":
      return "Last Year";
    case "custom":
      return "Custom Range";
    default:
      return "";
  }
}

  
export function formatYAxis(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return value.toString();
}




export function groupDataByWeek(data: HistoryPoint[]): HistoryPoint[] {
  const grouped: Record<string, HistoryPoint> = {};

  data.forEach((point) => {
    const date = new Date(point.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay()); // Sunday start
    const label = weekStart.toISOString().split("T")[0];

    if (!grouped[label]) grouped[label] = { date: label };

    for (const key of Object.keys(point)) {
      if (key !== "date") {
        const currentValue = grouped[label][key];
        const valueToAdd = Number(point[key]);

        grouped[label][key] =
          typeof currentValue === "number"
            ? currentValue + valueToAdd
            : valueToAdd;
      }
    }
  });

  const today = new Date();
  const currentWeekStart = new Date(today);
  currentWeekStart.setDate(today.getDate() - today.getDay()); // This week's Sunday
  const currentWeekLabel = currentWeekStart.toISOString().split("T")[0];

  return Object.values(grouped).filter(({ date }) => date !== currentWeekLabel);
}


export function groupDataByMonth(data: HistoryPoint[]): HistoryPoint[] {
  const grouped: Record<string, HistoryPoint> = {};

  data.forEach((point) => {
    const date = new Date(point.date);
    const month = date.toLocaleString("default", { month: "short", year: "numeric" }); // e.g., "Apr 2025"

    if (!grouped[month]) grouped[month] = { date: month };

    for (const key of Object.keys(point)) {
      if (key !== "date") {
        const currentValue = grouped[month][key];
        const valueToAdd = Number(point[key]);

        grouped[month][key] =
          typeof currentValue === "number"
            ? currentValue + valueToAdd
            : valueToAdd;
      }
    }
  });

  const today = new Date();
  const currentMonthLabel = today.toLocaleString("default", { month: "short", year: "numeric" });

  return Object.values(grouped).filter(({ date }) => date !== currentMonthLabel);
}


const hashToCombination: Record<number, string> = Object.fromEntries(
  Object.entries(combinationToHash).map(([key, value]) => [value, key])
);

export function encodeParams(timeRange: TimeRange, grouping: Grouping): number {
  const combination = `${timeRange}_${grouping}`;
  return combinationToHash[combination] || 0;
}

// Function to decode a hash back to range and grouping
export function decodeParams(hash: number): { timeRange: TimeRange; grouping: Grouping } {
  const combination = hashToCombination[hash] || "last-year_daily"; // Default to last-year_daily if no match
  const [timeRange, grouping] = combination.split("_") as [TimeRange, Grouping];
  return { timeRange, grouping };
}