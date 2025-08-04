// utils/filterData.ts
export const filterData = (data: any[] | null, blacklistedUrls: Set<string>, perPage: number) => {
  // Make sure data is valid before filtering
  if (!data) {
    return []; // or return some default value if necessary
  }

  const filteredData = data.filter((page) => !blacklistedUrls.has(page.url));
  const uniqueData = Array.from(new Set(filteredData.map((page) => page.url)))
    .map((url) => filteredData.find((page) => page.url === url));
  
  return uniqueData.slice(0, perPage);
};
