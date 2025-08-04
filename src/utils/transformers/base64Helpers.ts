export function uint8ToBase64(uint8: Uint8Array): string {
  let binary = "";
  const chunkSize = 8192; // Process in chunks of 8192 bytes

  for (let i = 0; i < uint8.length; i += chunkSize) {
    const chunk = uint8.slice(i, i + chunkSize);
    for (let j = 0; j < chunk.length; j++) {
      binary += String.fromCharCode(chunk[j]);
    }
  }

  return `data:image/jpeg;base64,${btoa(binary)}`;
}


  
  export function base64ToBlob(base64: string, type: string): Blob {
    const binary = atob(base64.split(",")[1]);
    const array = Uint8Array.from(binary, char => char.charCodeAt(0));
    return new Blob([array], { type });
  }
  