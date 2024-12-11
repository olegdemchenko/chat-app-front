import React from "react";
import { useTranslation } from "react-i18next";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

type DeleteRoomDialogProps = {
  isOpen: boolean;
  roomName: string;
  onSubmit: () => void;
  onClose: () => void;
};

function DeleteRoomDialog({
  isOpen,
  roomName,
  onSubmit,
  onClose,
}: DeleteRoomDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{t("chat.deleteContact")}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t("chat.deletePopupText")} -
          <Typography component="span" fontWeight="bold">
            {roomName}
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={onSubmit}>
          {t("chat.delete")}
        </Button>
        <Button variant="contained" color="info" onClick={onClose}>
          {t("chat.close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteRoomDialog;
