"use client";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Skeleton,
} from "@mui/material";

export function MetricsPanelSkeleton() {
  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        <Skeleton width={160} />
      </Typography>

      <Box sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {["Package", "Description", "Downloads", "Size (kB)", "Gzip (kB)", "Version", "Links"].map(
                (heading, idx) => (
                  <TableCell key={idx}>
                    <Skeleton width={100} />
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: 2 }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: 7 }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton width="100%" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
