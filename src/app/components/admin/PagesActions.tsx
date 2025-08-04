import React from "react";
import { Box, Button, CircularProgress, Tooltip, Link, TableCell } from "@mui/material";
import { 
  BarChart, 
  Edit, 
  Delete, 
  Language, 
  Unpublished, 
  PublishedWithChanges, 
  Autorenew, 
  SettingsApplications 
} from "@mui/icons-material";

interface PageActionsProps {
  page: {
    slug: string;
    domain: string;
    isPublished: boolean;
  };
  loadingStates: Record<string, Record<string, boolean>>;
  handlePublish: (slug: string) => void;
  handleRecalculate: (slug: string) => void;
  handleRevalidate: (domain: string, slug: string) => void;
  handleDelete: (domain: string, slug: string) => void;
  handleRedirectToPage: (domain: string, slug: string) => string;
  handleEditMetadata: (page: any) => void;
  handleToggleShareModal:()=>void;
  content:string;
}

const PageActions: React.FC<PageActionsProps> = ({
  page,
  loadingStates,
  handlePublish,
  handleRecalculate,
  handleRevalidate,
  handleDelete,
  handleRedirectToPage,
  handleEditMetadata,
  handleToggleShareModal,
  content
}) => {
  const path=content=="blog"?"learn":"news";
  const editPath=content=="blog"?"content":"content-news";
  return (
   

    <TableCell align="right">
      <Box display="flex" gap={1} justifyContent="flex-start">
        {/* Publish / Unpublish */}
        <Tooltip title={page.isPublished ? "Unpublish Page" : "Publish Page"} arrow>
          <Button
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handlePublish(page.slug);
            }}
            disabled={loadingStates[page.slug]?.publish || false}
          >
            {loadingStates[page.slug]?.publish ? (
              <CircularProgress size={20} color="inherit" />
            ) : page.isPublished ? (
              <Unpublished />
            ) : (
              <PublishedWithChanges />
            )}
          </Button>
        </Tooltip>

        {/* Recalculate Stats */}
        <Tooltip title="Recalculate Stats" arrow>
          <Button
            variant="contained"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleRecalculate(page.slug);
            }}
          >
            <BarChart />
          </Button>
        </Tooltip>

        {/* Revalidate */}
        <Tooltip title={`Revalidate /${content}/${page.domain}/${page.slug}`} arrow>
          <Button
            variant="contained"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleRevalidate(page.domain, page.slug);
            }}
            disabled={loadingStates[page.slug]?.revalidate}
          >
            {loadingStates[page.slug]?.revalidate ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Autorenew />
            )}
          </Button>
        </Tooltip>

        {/* Edit */}
        <Tooltip title="Edit Page" arrow>
          <Link target="_blank" href={`/${editPath}/${page.domain}/${page.slug}`}>
            <Button
              onClick={(e) => e.stopPropagation()}
              variant="outlined"
              color="secondary"
              disabled={loadingStates[page.slug]?.edit || false}
            >
              {loadingStates[page.slug]?.edit ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <Edit />
              )}
            </Button>
          </Link>
        </Tooltip>

        {/* Edit metadata */}
        <Tooltip title="Edit metadata" arrow>
          <Button
            variant="outlined"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleEditMetadata(page);
            }}
          >
            <SettingsApplications />
          </Button>
        </Tooltip>

            {/*Shar Post*/}
            <Tooltip title="Share Post" arrow>
          <Button
            variant="outlined"
            color="secondary"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleShareModal()
            }}
          >
            <SettingsApplications />
          </Button>
        </Tooltip>

        {/* View Page */}
        <Tooltip title="View Page" arrow>
          <Link
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            href={handleRedirectToPage(page.domain, page.slug)}
          >
            <Button
              variant="outlined"
              color="inherit"
            >
              <Language />
            </Button>
          </Link>
        </Tooltip>

        {/* Delete - Destructive action */}
        <Tooltip title="Delete Page" arrow>
          <Button
            variant="contained"
            color="error" // Red for destructive action
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(page.domain, page.slug);
            }}
            disabled={loadingStates[page.slug]?.delete || false}
          >
            {loadingStates[page.slug]?.delete ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <Delete />
            )}
          </Button>
        </Tooltip>
      </Box>
    </TableCell>
  );
};

export default PageActions;
