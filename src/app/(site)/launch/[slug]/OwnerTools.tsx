// app/apps/[slug]/OwnerTools.tsx
"use client";
import * as React from "react";
import { Box, Button, Stack, TextField, Tooltip } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

/**
 * Props:
 *  - appId, appSlug, appName, isVerified, publicUrl
 *
 * This component assumes an API endpoint /api/apps/:id/ownership that returns { isOwner: boolean }.
 * Replace with your auth/session logic.
 */

export default function OwnerTools({
  appId,
  appSlug,
  appName,
  isVerified,
  publicUrl,
}: {
  appId: string;
  appSlug: string;
  appName: string;
  isVerified: boolean;
  publicUrl: string;
}) {
  const [isOwner, setIsOwner] = React.useState<boolean | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    // Check ownership — replace with your API
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/apps/${appId}/is-owner`);
        if (!mounted) return;
        if (res.ok) {
          const j = await res.json();
          setIsOwner(Boolean(j?.isOwner));
        } else {
          setIsOwner(false);
        }
      } catch (e) {
        setIsOwner(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [appId]);

  const snippet = `<a href="${publicUrl}">View ${appName} on OurSite</a>`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // ignore
    }
  };

  // Request re-check: call your queueing endpoint
  const requestRecheck = async () => {
    await fetch(`/api/apps/${appId}/request-verification`, { method: "POST" });
    // show toast/notification (not included here)
  };

  // If we haven't determined ownership yet, render nothing (or a skeleton)
  if (isOwner === null) return null;

  return (
    <Box>
      {isOwner ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField value={snippet} size="small" InputProps={{ readOnly: true }} sx={{ minWidth: 380 }} />
          <Tooltip title={copied ? "Copied" : "Copy snippet"}>
            <Button variant="contained" size="small" onClick={copy} startIcon={<ContentCopyIcon />}>
              Copy
            </Button>
          </Tooltip>

          {/* Only let owners request an automated re-check; they cannot self-verify */}
          <Button variant="outlined" size="small" onClick={requestRecheck} sx={{ ml: 1 }}>
            Request verification check
          </Button>

          {isVerified && (
            <Button variant="text" size="small" href={publicUrl} target="_blank" rel="noopener noreferrer">
              View public page
            </Button>
          )}
        </Stack>
      ) : (
        <Box>
          {/* non-owner view: if you want, show the public URL to copy, but usually it's owner-only */}
          <Button variant="outlined" size="small" href={publicUrl}>
            View public page
          </Button>
        </Box>
      )}
    </Box>
  );
}
