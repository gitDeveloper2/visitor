import { useEffect, useState } from "react";
import { NpmSearchResponse } from "../compare.types";

export function usePackageSuggestions(query: string, delay = 300) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(handler);
  }, [query, delay]);

  useEffect(() => {
    if (!debouncedQuery) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    async function fetchSuggestions() {
      try {
        const trimmedQuery = debouncedQuery.trim();  // Trim the query for the API call

        const res = await fetch(
          `https://registry.npmjs.org/-/v1/search?text=${trimmedQuery}&size=10`,
          { signal: controller.signal }
        );
        const json: NpmSearchResponse = await res.json();
        let names = json.objects.map((obj) => obj.package.name);

        // If the exact name isn't in the list, do a direct fetch
        if (
          !names.includes(debouncedQuery) &&
          debouncedQuery.length > 1 // avoid unnecessary calls
        ) {
          try {
            const exactRes = await fetch(
              `https://registry.npmjs.org/${debouncedQuery}`,
              { signal: controller.signal }
            );
            if (exactRes.ok) {
              names = [debouncedQuery, ...names];
            }
          } catch (exactErr) {
            // console.log(exactErr)
            // likely 404 — just ignore
          }
        }

        setSuggestions(names);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          // console.error("Suggestion fetch error:", err);
        }
      }
    }

    fetchSuggestions();
    return () => controller.abort();
  }, [debouncedQuery]);

  return suggestions;
}
