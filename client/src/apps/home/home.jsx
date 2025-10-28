import { useState } from "react";
import {
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AudioSection from "./sections/AudioSection";
import CloseIcon from "@mui/icons-material/Close";
import PreviewSection from "./sections/PreviewSection";
import PdfSection from "./sections/PdfSection";
import { useAuth } from "../../services/auth/firebase/AuthContext";
import { getLogger } from "../../services/logs";

function ConfirmLogoutDialog({ open, onCancel, onConfirm }) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1.5 }}>¿Cerrar sesión?</DialogTitle>
      <DialogContent sx={{ px: 3, pt: 0, pb: 2 }}>
        Esta acción cerrará tu sesión actual.
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, pt: 0, gap: 1 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloseIcon />}
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={onConfirm}
        >
          Cerrar sesión
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function HeaderBar() {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const log = getLogger("home.header");

  const menuOpen = Boolean(anchorEl);
  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
    log.debug("menu_open");
  };
  const handleClose = () => setAnchorEl(null);

  const handleAskLogout = () => {
    handleClose();
    setConfirmOpen(true);
    log.info("logout_confirm_open");
  };
  const handleConfirmLogout = () => {
    setConfirmOpen(false);
    log.info("logout_confirmed");
    logout();
  };

  const initial = (
    user?.displayName?.[0] ||
    user?.email?.[0] ||
    "?"
  ).toUpperCase();

  return (
    <>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Veridia
          </Typography>

          <Tooltip title={user?.email || "Usuario"}>
            <IconButton onClick={handleOpen} size="small" sx={{ ml: 1 }}>
              <Avatar sx={{ width: 32, height: 32 }}>{initial}</Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem disabled>{user?.email || "Usuario"}</MenuItem>
            <MenuItem onClick={handleAskLogout}>
              <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
              Cerrar sesión
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <ConfirmLogoutDialog
        open={confirmOpen}
        onCancel={() => {
          setConfirmOpen(false);
          log.debug("logout_confirm_cancelled");
        }}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
}

export default function Home() {
  const [ficha, setFicha] = useState(null);
  const log = getLogger("home");

  const handleData = (data) => {
    setFicha(data);
    try {
      const keys =
        data && typeof data === "object" ? Object.keys(data).length : 0;
      log.info("ficha_received", { keys });
    } catch {
      log.info("ficha_received");
    }
  };

  return (
    <>
      <HeaderBar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ fontWeight: "bold" }}
          gutterBottom
        >
          Demo Historia Clínica
        </Typography>
        <AudioSection onData={handleData} />
        {ficha && (
          <>
            <PreviewSection data={ficha} />
            <PdfSection data={ficha} />
          </>
        )}
      </Container>
    </>
  );
}
