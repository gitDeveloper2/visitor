"use client";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Link as MuiLink,
} from "@mui/material";
import { SiNpm } from "react-icons/si";
import { FaGithub, FaCube } from "react-icons/fa";
import { PackageMetrics } from "@/features/compare/compare.types";
import { formatYAxis } from "../utils";

interface MetricsPanelProps {
  data: Record<string, PackageMetrics>;
  selectedPackages: string[];
}

export function MetricsPanel({ data, selectedPackages }: MetricsPanelProps) {
  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Package Metrics
      </Typography>

      {/* Responsive scroll container */}
      <Box sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Package</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Downloads</TableCell>
              <TableCell align="right">Size (kB)</TableCell>
              <TableCell align="right">Gzip (kB)</TableCell>
              <TableCell align="right">Version</TableCell>
              <TableCell align="center">Links</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedPackages.map((pkg) => {
              const metrics = data[pkg];
              if (!metrics) return null;

              const { downloads, bundle } = metrics;
              const downloadCount = downloads?.downloads ?? 0;
              const sizeKB = bundle?.size ? (bundle.size / 1024).toFixed(1) : "-";
              const gzipKB = bundle?.gzip ? (bundle.gzip / 1024).toFixed(1) : "-";
              const version = bundle?.version ?? "-";
              const description = bundle?.description ?? "-";

              return (
                <TableRow key={pkg}>
                  <TableCell>{pkg}</TableCell>
                  <TableCell>{description}</TableCell>
                  <TableCell align="right">{formatYAxis(downloadCount)}</TableCell>
                  <TableCell align="right">{sizeKB}</TableCell>
                  <TableCell align="right">{gzipKB}</TableCell>
                  <TableCell align="right">{version}</TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                      <MuiLink
                        href={`https://www.npmjs.com/package/${pkg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on NPM"
                      >
                        <SiNpm size={18} />
                      </MuiLink>
                      {bundle?.repository && (
                        <MuiLink
                          href={bundle.repository}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View Repository"
                        >
                          <FaGithub size={18} />
                        </MuiLink>
                      )}
                      <MuiLink
                        href={`https://bundlephobia.com/package/${pkg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View on Bundlephobia"
                      >
                        <FaCube size={18} />
                      </MuiLink>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
