"use client";
// import Link  as NextLink from 'next/link';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  TextField,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { getAllPages } from "../../../actions/blogActions";
import React from "react";
import PagesTable from "./PageTable";
import { sortPages } from "../../../utils/transformers/admin/sort";
import { usePagesHandlers } from "../../../hooks/admin/useHandlers";
import EditMetadataModal from "./MetaDataModal";
import FacebookPostModal from "@components/SocialShare";
import { handlePostToMultiplePlatforms } from "../../../lib/services/socialmedia/post";
import SocialMediaPostModal from "@components/SocialShare";

export default function PageList({content}:{content:string}) {
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [currentPage, setCurrentPage] = useState(1); // State for pagination
  const pagesPerPage = 10; // Define how many items per page
  const [openRows, setOpenRows] = useState<string[]>([]); // Track which rows are expanded
  const [sortOrder, setSortOrder] = useState("desc");
  const [refresh, setRefresh] = useState(false); // State to trigger re-fetch

  const router = useRouter();

  const {
    
    pages: { pages, setPages, loading, error },
    loading: { loadingStates },
    redirect: { handleRedirectToPage },
    indexing: { handleIndex, isIndexing,handleCategoryIndex,isIndexingCategory },
    recalculate: { handleRecalculate },
    publish: { handlePublish },
    metadata: { selectedPage, handleEditMetadata,handleCloseModal,isModalOpen },
    delete: { handleDelete },
    revalidate: { handleRevalidate },
    stats: { pageStats, isGeneratingStats, handleGenerateAllStats },
    share:{handleToggleShareModal,isShareModalOpen}
  } = usePagesHandlers({content});
  



 
  const handleModalSubmit = (updatedData) => {
    // Save updated data logic here...
  };
  const handleSortOrderChange = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page on new search
  };
 
  
  const sortedPages = sortPages(pages, searchQuery, sortOrder);

  const paginatedPages = sortedPages.slice(
    (currentPage - 1) * pagesPerPage,
    currentPage * pagesPerPage
  );

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
       <SocialMediaPostModal
         open={isShareModalOpen}
          onClose={handleToggleShareModal}
        onPost={handlePostToMultiplePlatforms} // Pass the post handler
      />

      <Typography variant="h4" gutterBottom>
        Pages
      </Typography>
      <EditMetadataModal
        open={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedPage}
      />

      {/* Search Field */}
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        
        onChange={handleSearchChange}
      />

      <Box display="flex" gap={2} marginBottom="20px">
        <Button
          variant="contained"
          color="primary"
          onClick={handleIndex}
          disabled={isIndexing}
        >
          {isIndexing ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Index All Pages"
          )}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCategoryIndex}
          disabled={isIndexingCategory}
        >
          {isIndexingCategory ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Index Links"
          )}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleGenerateAllStats}
          disabled={isGeneratingStats}
        >
          {isGeneratingStats ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Generate All Stats"
          )}
        </Button>
      </Box>
      {/* Sort Controls */}
      <Box display="flex" gap={2} marginBottom="20px">
        {/* Sort Controls */}
        <Box display="flex" gap={2} marginBottom="20px">
          <Button onClick={handleSortOrderChange}>
            {sortOrder === "asc" ? "Sort Descending" : "Sort Ascending"}
          </Button>
        </Box>
      </Box>
      {/* Pagination */}
      <Pagination
        count={Math.ceil(sortedPages.length / pagesPerPage)}
        page={currentPage}
        onChange={(event, value) => setCurrentPage(value)}
        color="primary"
      />

      <PagesTable
      content={content}
        paginatedPages={paginatedPages}
        pageStats={pageStats}
        handlePublish={handlePublish}
        handleRecalculate={handleRecalculate}
        handleRevalidate={handleRevalidate}
        handleDelete={handleDelete}
        handleRedirectToPage={handleRedirectToPage}
        handleEditMetadata={handleEditMetadata}
        loadingStates={loadingStates}
        handleToggleShareModal={handleToggleShareModal}
      />

      {/* Pagination */}
      <Pagination
        count={Math.ceil(sortedPages.length / pagesPerPage)}
        page={currentPage}
        onChange={(event, value) => setCurrentPage(value)}
        color="primary"
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      />
    </Box>
  );
}
