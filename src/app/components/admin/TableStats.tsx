import { PageStatCard } from "@components/PageStatCard";
import { TableRow, TableCell, Collapse, Box, Typography } from "@mui/material";
import React from "react";

interface TableStatsProps {
  index: number;
  pageStat: any;
  isRowOpen: boolean;
  handleRecalculate: (slug: string) => void;
}

const TableStats: React.FC<TableStatsProps> = ({ 
  index, 
  pageStat, 
  isRowOpen, 
  handleRecalculate 
}) => {
  return (
    // Collapsible Stats Row
    <TableRow key={`collapse-${index}`} sx={{ display: isRowOpen ? "table-row" : "none" }}>
      <TableCell colSpan={6} style={{ padding: 0 }}>
        <Collapse in={isRowOpen} timeout="auto" unmountOnExit>
          <Box
            p={2}
            sx={{
              backgroundColor: "#f9f9f9",
              borderTop: "1px solid #ddd",
              borderBottom: "1px solid #ddd",
              borderLeft: "4px solid #1976d2",
              borderRadius: "0 4px 4px 0",
              overflowX: "auto",
              width: "100%",
            }}
          >
            {pageStat ? (
              <PageStatCard
                key={`stats-${index}`}
                stats={pageStat}
                onRecalculate={() => handleRecalculate(pageStat.slug)}
              />
            ) : (
              <Typography variant="body2" color="error">
                ⚠️ No stats available. Click "Recalculate Stats" to generate stats.
              </Typography>
            )}
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default TableStats;
