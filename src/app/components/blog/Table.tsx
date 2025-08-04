import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

interface Row {
  children: Array<{ children: Array<{ data: string | undefined }> }>;
}

interface MuiTableProps {
  rows: Row[];
}

const MuiTable = ({ rows }: MuiTableProps) => {
 

  return (
    <TableContainer component={Paper} sx={{ padding: 2, boxShadow: 3 }}>
      <Table role="table" >
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#f5f5f5",
              "& th": {
                fontWeight: "bold",
                color: "#333",
              },
            }}
          >
            {rows[0]?.children?.map((cell: any, index: number) => (
              <TableCell
                key={index}
                sx={{ fontWeight: "bold", color: "#1976d2" }}
                role="columnheader"
                aria-label={`Column ${index + 1}`}
              >
                {cell.data || "No Data"}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.slice(1).map((row: any, rowIndex: number) => (
            <TableRow
              key={rowIndex}
              sx={{
                "&:nth-of-type(odd)": {
                  backgroundColor: "#f9f9f9",
                },
                "&:hover": {
                  backgroundColor: "#e0f7fa",
                },
              }}
              role="row"
            >
              {row.children.map((cell: any, colIndex: number) => (
                <TableCell
                  key={colIndex}
                  sx={{
                    padding: "12px",
                    textAlign: "center",
                    color: "#555",
                  }}
                  role="cell"
                  aria-label={`Row ${rowIndex + 1} Column ${colIndex + 1}`}
                >
                  {cell.data || "No Data"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MuiTable;
