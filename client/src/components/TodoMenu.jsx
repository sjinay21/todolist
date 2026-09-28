"use client";

import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

export default function TodoMenu({todosId,onDelete,onStatusChange,onEdit,title}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
const statusOptions = ["Upcoming","Progress","Complete"];

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
       <MenuItem onClick={() => {onEdit(todosId,title);handleClose()}}>Edit</MenuItem>
        <MenuItem onClick={() => {onDelete(todosId);handleClose()}}>Delete</MenuItem>
        {statusOptions.map((status) => (
        <MenuItem
        key={status}
        onClick={() => {onStatusChange(todosId, status);handleClose()}}
        >
        {status}
        </MenuItem>
        ))}
      </Menu>
    </div>
  );
}