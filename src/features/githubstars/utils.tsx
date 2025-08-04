import { RepoData, ProcessedData } from "./githubstarts.types"

namespace utils {
  export function range(from: number, to: number): number[] {
    const r: number[] = []
    for (let i = from; i <= to; i++) {
      r.push(i)
    }
    return r
  }

  export function getTimeStampByDate(t: Date | number | string): number {
    const d = new Date(t)

    return d.getTime()
  }

  // utils.tsx

  export function computed<T>(func: () => T): T {
    return func()
  }

  export function getDateString(t: Date | number | string, format = "yyyy/MM/dd hh:mm:ss"): string {
    const d = new Date(getTimeStampByDate(t))

    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const date = d.getDate()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const seconds = d.getSeconds()

    const formatedString = format
      .replace("yyyy", String(year))
      .replace("MM", String(month))
      .replace("dd", String(date))
      .replace("hh", String(hours))
      .replace("mm", String(minutes))
      .replace("ss", String(seconds))

    return formatedString
  }

  export async function copyTextToClipboard(text: string) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text)
      } catch (error: unknown) {
        console.warn("Copy to clipboard failed.", error)
      }
    } else {
      console.warn("Copy to clipboard failed, methods not supports.")
    }
  }

  export function convertSVGToDataURL(svgElement: SVGSVGElement) {
    const xml = new XMLSerializer().serializeToString(svgElement)
    const encodedData = window.btoa(xml)
    return `data:image/svg+xml;base64,${encodedData}`
  }

  export function waitImageLoaded(image: HTMLImageElement): Promise<void> {
    image.loading = "eager"

    return new Promise((resolve, reject) => {
      image.onload = () => {
        // NOTE: There is image loading problem in Safari, fix it with some trick
        setTimeout(() => {
          resolve()
        }, 200)
      }
      image.onerror = () => {
        reject("Image load failed")
      }
    })
  }

  export function calcBytes(d: any): number {
    let bytes = 0

    if (typeof d === "number") {
      bytes += 8
    } else if (typeof d === "string") {
      bytes += d.length * 2
    } else if (typeof d === "boolean") {
      bytes += 1
    } else if (typeof d === "object") {
      if (Array.isArray(d)) {
        for (const i of d) {
          bytes += calcBytes(i)
        }
      } else {
        for (const k in d) {
          bytes += calcBytes(d[k])
        }
      }
    }

    return bytes
  }

  export function calcReadingTime(content: string): string {
    const wordsPerMinute = 200
    const wordAmount = content.split(" ").length
    if (wordAmount <= 200) {
      return "less than 1 min read"
    }

    const count = Math.ceil(wordAmount / wordsPerMinute)
    return `${count} min read`
  }

  export function getBase64Image(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = url
      img.setAttribute("crossOrigin", "anonymous")

      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject("Get canvas context failed.")
          return
        }
        ctx.drawImage(img, 0, 0)
        const dataURL = canvas.toDataURL("image/png")
        resolve(dataURL)
      }

      img.onerror = function () {
        reject("The image could not be loaded.")
      }
    })
  }

  export function absolutifyLink(rel: string): string {
    if (typeof window !== "undefined") {
      const anchor = document.createElement("a")
      anchor.setAttribute("href", rel)
      return anchor.href
    }
    return rel
  }
  // My utils
  export const cleanRepo = (repo: string): string =>
    repo
      .trim()
      .replace(/^https:\/\/github\.com\//, "")
      .replace(/(\.git|\/)+$/, "");


 
  export function mergeRepoDataForRecharts(
    results: Record<string, { date: string; count: number }[]>
  ) {
    const allDates = new Set<string>();

    // Collect all unique dates across repos
    for (const repo of Object.values(results)) {
      for (const point of repo) {
        const dateOnly = point.date.split(" ")[0]; // Keep only the date part
        allDates.add(dateOnly);
      }
    }

    // Sort the dates in ascending order
    const sortedDates = Array.from(allDates).sort();

    // Initialize the merged data structure
    const merged: { [key: string]: { date: string;}&{[repoName: string]: number | string|undefined } } = {};
    sortedDates.forEach((date) => {
      merged[date] = { date }; // Create an object for each date
    });

    // Merge data from each repo
    for (const [repoName, entries] of Object.entries(results)) {
      const entryMap = new Map(entries.map((e) => [e.date.split(" ")[0], e.count])); // Map of dates to counts

      let lastKnownValue: number | undefined = undefined;

      sortedDates.forEach((date) => {
        // If the date exists in the entryMap, use its count; otherwise, use undefined (no data)
        const count = entryMap.get(date);

        if (count !== undefined) {
          lastKnownValue = count;
          merged[date][repoName] = count;
        } else {
          merged[date][repoName] = undefined; // Explicitly mark as undefined if no data available
        }
      });
    }


    // Convert the merged object into an array of date-based records for Recharts
    return stripUndefinedRepoCounts(sortedDates.map((date) => merged[date]));
  }




  export function stripUndefinedRepoCounts(
    merged: { date: string;[repoName: string]: number |string| undefined }[]
  ): { date: string;[repoName: string]: number|string }[] {
    return merged.map((entry) => {
      const { date, ...rest } = entry;
      const cleaned: { date: string;[repoName: string]: number|string } = { date };

      for (const [key, value] of Object.entries(rest)) {
        if (value !== undefined) {
          cleaned[key] = value;
        }
      }

      return cleaned;
    });
  }





  export function formatYAxisValue(value: number): string {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toString();
  }

  export function formatXAxisLabel(dateStr: string, index: number, allDates: string[]): string {
    const date = new Date(dateStr);
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    const prev = index > 0 ? new Date(allDates[index - 1]) : null;
    const prevYear = prev?.getFullYear();

    const isSingleYear = allDates.every(d => new Date(d).getFullYear() === year);

    // If single year, show only month
    if (isSingleYear) return month;

    // If first item or year has changed, show month + year
    if (!prev || year !== prevYear) {
      return `${month} ${year}`;
    }

    // Otherwise just show the month
    return month;
  }


  //   chart


  export function processChartData(data: RepoData[]): ProcessedData[] {
    return [...data]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((entry) => ({
        ...entry,
        timestamp: new Date(entry.date).getTime(),
      }));
  }

  export function extractRepoKeys(data: RepoData[]): string[] {
    return Array.from(
      new Set(data.flatMap((entry) => Object.keys(entry).filter((k) => k !== "date")))
    );
  }

  export function getYearlyTicks(data: ProcessedData[]): number[] {
    const timestamps = data.map((d) => d.timestamp);
    const minYear = new Date(Math.min(...timestamps)).getFullYear();
    const maxYear = new Date(Math.max(...timestamps)).getFullYear();
    return Array.from({ length: maxYear - minYear + 1 }, (_, i) =>
      new Date(`${minYear + i}-01-01`).getTime()
    );
  }
  // utils.ts or useRepoLogo.ts
  export function getRepoLogoUrl(repo: string): string | null {
    if (!repo) return null;
    const [owner] = repo.split("/");
    return `https://github.com/${owner}.png`;
  }



}

export default utils
