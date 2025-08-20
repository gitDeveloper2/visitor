import { Menu, MenuItem, IconButton, ListItemIcon } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import PublishIcon from "@mui/icons-material/Publish";
import UnpublishedIcon from "@mui/icons-material/Unpublished";
import ShareIcon from "@mui/icons-material/Share";
import { useState } from "react";
import { useAdminBlogActions } from "../hooks/useAdminBlogActions";
import { Block, LockOpen } from "@mui/icons-material";
import { authClient } from "../../../../auth-client";

export default function BlogActionsMenu({ blog }: { blog: any }) {
  const { data: session } = authClient.useSession();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { deleteBlog, togglePublish, toggleSuspension, share } = useAdminBlogActions();

  const handleClose = () => setAnchorEl(null);

  const isAdmin = session?.user?.role === "admin";

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={async () => {
            const targetId = blog._id;
            window.open(`/dashboard/blogs/create?draftId=${targetId}`, "_blank");
          }}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          {blog.status === "draft" ? "Resume" : "Edit"}
        </MenuItem>

        <MenuItem onClick={() => window.open(`/blog/${blog.slug}`, "_blank")}>
          <ListItemIcon>
            <VisibilityIcon />
          </ListItemIcon>
          View
        </MenuItem>

        <MenuItem onClick={() => togglePublish(blog._id, !blog.published)}>
          <ListItemIcon>
            {blog.published ? <UnpublishedIcon /> : <PublishIcon />}
          </ListItemIcon>
          {blog.published ? "Unpublish" : "Publish"}
        </MenuItem>

        {isAdmin && (
          <MenuItem onClick={() => toggleSuspension(blog._id, !blog.suspended)}>
            <ListItemIcon>
              {blog.suspended ? <LockOpen /> : <Block />}
            </ListItemIcon>
            {blog.suspended ? "Unsuspend" : "Suspend"}
          </MenuItem>
        )}

        <MenuItem onClick={() => share(blog)}>
          <ListItemIcon>
            <ShareIcon />
          </ListItemIcon>
          Share
        </MenuItem>

        <MenuItem onClick={() => deleteBlog(blog._id)}>
          <ListItemIcon>
            <DeleteIcon />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
}
