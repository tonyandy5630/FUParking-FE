import { useState } from "react";

export default function useHandleDialog(open = false) {
  const [openDialog, setOpenDialog] = useState(open);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleToggleDialog = () => {
    setOpenDialog((prev) => !prev);
  };

  return {
    openDialog,
    handleOpenDialog,
    handleCloseDialog,
    handleToggleDialog,
  };
}
