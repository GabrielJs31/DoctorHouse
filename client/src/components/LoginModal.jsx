import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AuthForms } from "../apps/auth/auth";
import { getLogger } from "../services/logs";
const log = getLogger("auth.login_modal");

export default function LoginModal({ open, onClose, disableClose = false }) {
  const handleClose = (_, reason) => {
    if (
      disableClose &&
      (reason === "backdropClick" || reason === "escapeKeyDown")
    ) {
      log.debug("close_blocked", { reason });
      return;
    }
    log.debug("close_allowed", { reason });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={disableClose}
      keepMounted
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography variant="h6">Iniciar sesión</Typography>
        {!disableClose && (
          <IconButton
            aria-label="Cerrar"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent dividers>
        <AuthForms onLoginSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
