'use client';

import { useState } from 'react';
import { Menu, MenuItem, Button } from '@mui/material';
import { ToolAction, useToolAction } from './hooks';
import RescheduleDialog from './RescheduleDialog';

export default function ToolActionsMenu({
  toolId,
  status,
  isFeatured,
  onAction,
}: {
  toolId: string;
  status: string;
  isFeatured: boolean;
  onAction?: () => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const { mutate } = useToolAction();

  const handleAction = (action: ToolAction, body?: Record<string, any>) => {
    mutate({ toolId, action, body });
    setAnchorEl(null);
    if (onAction) onAction();
  };

  const isSuspended = status === 'suspended';
  const canPromote = status !== 'launched' && !isSuspended;
  const canDemote = status === 'launched' && !isSuspended;

  return (
    <>
      <Button variant="contained" onClick={(e) => setAnchorEl(e.currentTarget)}>
        Actions
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        {isSuspended ? (
          <MenuItem onClick={() => handleAction('unsuspend')}>Unsuspend</MenuItem>
        ) : (
          <MenuItem onClick={() => handleAction('suspend')}>Suspend</MenuItem>
        )}
        {canDemote && (
          <MenuItem onClick={() => handleAction('demote')}>Demote to Draft</MenuItem>
        )}
        {canPromote && (
          <MenuItem onClick={() => handleAction('promote')}>Promote to Launch</MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setShowReschedule(true);
          }}
        >
          Reschedule
        </MenuItem>
        <MenuItem onClick={() => handleAction('delete')}>Delete</MenuItem>
      </Menu>

      <RescheduleDialog
        open={showReschedule}
        onClose={() => setShowReschedule(false)}
        onConfirm={(launchDate) => {
          handleAction('reschedule', { launchDate });
          setShowReschedule(false);
        }}
      />
    </>
  );
}
