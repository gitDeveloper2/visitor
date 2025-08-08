// UserFilter.tsx
import React from 'react';
import { TextField, MenuItem, Box } from '@mui/material';

type UserFilterProps = {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  roleFilter: string | 'all';
  setRoleFilter: React.Dispatch<React.SetStateAction<string | 'all'>>;
};

const UserFilter: React.FC<UserFilterProps> = ({ searchQuery, setSearchQuery, roleFilter, setRoleFilter }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoleFilter(e.target.value);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {/* Search Field */}
      <TextField
        label="Search by Name or Email"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Role Filter Dropdown */}
      <TextField
        label="Filter by Role"
        variant="outlined"
        fullWidth
        select
        value={roleFilter}
        onChange={handleRoleChange}
      >
        <MenuItem value="all">All Roles</MenuItem>
        <MenuItem value="admin">Admin</MenuItem>
        <MenuItem value="user">User</MenuItem>
        <MenuItem value="creator">Creator</MenuItem>
      </TextField>
    </Box>
  );
};

export default UserFilter;
