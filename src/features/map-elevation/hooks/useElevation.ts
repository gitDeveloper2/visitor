import { useEffect, useRef, useState } from 'react';
import { Pin } from '../types';
import { fetchElevation } from '../service/elevationService';
import { fetchLocationName } from '../service/reverseGeocode';

export function useElevations(
  pins: Omit<Pin, 'elevation' | 'loading' | 'error' | 'locationName'>[],
  resetTrigger: number
): [Pin[], string | null, (msg: string | null) => void] {
  const [elevatedPins, setElevatedPins] = useState<Pin[]>([]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const fetchedSet = useRef(new Set<string>());

  useEffect(() => {
    setElevatedPins([]);
    fetchedSet.current.clear();
  }, [resetTrigger]);

  useEffect(() => {
    pins.forEach((pin) => {
      const key = `${pin.lat},${pin.lng}`;
      if (fetchedSet.current.has(key)) return;
      fetchedSet.current.add(key);

      setElevatedPins((prev) => [...prev, { ...pin, loading: true }]);

      fetchElevation(pin.lat, pin.lng)
        .then(async (elevation) => {
          const locationName = await fetchLocationName(pin.lat, pin.lng);
          setElevatedPins((prev) =>
            prev.map((p) =>
              p.lat === pin.lat && p.lng === pin.lng
                ? { ...p, elevation, locationName, loading: false }
                : p
            )
          );
        })
        .catch((error) => {
          console.log("source",error.message)
          setElevatedPins((prev) =>
            prev.map((p) =>
              p.lat === pin.lat && p.lng === pin.lng
                ? { ...p, error: error.message, loading: false }
                : p
            )
          );
          setGlobalError(error.message); // 💥 Catch global API errors here
        });
    });
  }, [pins]);

  return [elevatedPins, globalError, setGlobalError];
}
