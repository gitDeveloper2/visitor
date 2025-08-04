// "use client";

import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { getNaturalDate } from "../../../utils/generators/dateTime";
import TableStats from "./TableStats";
import { PagesTableProps } from "../../../types/pagesTable";
import PageActions from "./PagesActions";


export default function PagesTable({
  paginatedPages,
  pageStats,
  loadingStates,
  handlePublish,
  handleDelete,
  handleRevalidate,
  handleRecalculate,
  handleRedirectToPage,
  handleEditMetadata,
  handleToggleShareModal,
  content
}: PagesTableProps) {
  const [openRows, setOpenRows] = useState<string[]>([]);

  const handleRowClick = (slug: string) => {
    setOpenRows((prevOpenRows) =>
      prevOpenRows.includes(slug)
        ? prevOpenRows.filter((row) => row !== slug)
        : [...prevOpenRows, slug]
    );
  };

  return (
    <TableContainer
      component={Paper}
      sx={{ overflowX: "auto", maxWidth: "100%" }}
    >
      <Table stickyHeader aria-label="pages table" sx={{ tableLayout: "auto" }}>
        <TableHead>
          <TableRow>
            <TableCell>Domain</TableCell>
            <TableCell>Slug</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Stats</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedPages.map((page, index) => {
            const isRowOpen = openRows.includes(page.slug);
            const pageStat = pageStats.find((stat) => stat.slug === page.slug);

            return (
              <React.Fragment key={`${page.domain}-${page.slug}`}>
                {/* Main Row */}
                <TableRow
                  hover
                  onClick={() => handleRowClick(page.slug)}
                  sx={{
                    maxWidth: "100%",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
                  }}
                >
                  <TableCell>{page.domain}</TableCell>
                  <TableCell>{page.slug}</TableCell>
                  <TableCell>{page.title}</TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {isRowOpen ? "Hide Stats" : "Click to View Stats"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {page.created_at
                      ? getNaturalDate(new Date(page.created_at))
                      : getNaturalDate(new Date())}
                  </TableCell>
                  <PageActions
                  content={content}
  page={page}
  loadingStates={loadingStates}
  handlePublish={handlePublish}
  handleRecalculate={handleRecalculate}
  handleRevalidate={handleRevalidate}
  handleDelete={handleDelete}
  handleRedirectToPage={handleRedirectToPage}
  handleEditMetadata={handleEditMetadata}
  handleToggleShareModal={handleToggleShareModal}
/>

                </TableRow>

                {/* Collapsible Stats Row */}
                <TableStats
                  index={index}
                  handleRecalculate={handleRecalculate}
                  isRowOpen={isRowOpen}
                  pageStat={pageStat}
                  key={`tablestats-${index}`}
                />
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
