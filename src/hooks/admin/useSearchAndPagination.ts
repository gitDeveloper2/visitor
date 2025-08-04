import { useState } from 'react';

export function useSearchAndPagination() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pagesPerPage = 10;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page on new search
  };

  const paginate = (pages: any[]) => {
    const startIndex = (currentPage - 1) * pagesPerPage;
    return pages.slice(startIndex, startIndex + pagesPerPage);
  };

  return { searchQuery, handleSearchChange, currentPage, setCurrentPage, paginate, pagesPerPage };
}
