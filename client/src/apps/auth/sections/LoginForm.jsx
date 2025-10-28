import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../../services/auth/firebase/AuthContext";
import { mapAuthError } from "../utils/errorMap";
import { getLogger } from "../../../services/logs";
const log = getLogger("auth.login");

export default function LoginForm({ setMode, setMsg, onSuccess }) {
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setBusy(true);
    const emailDomain = (email.split("@")[1] || "").toLowerCase();
    log.info("submit_email_login", { emailDomain });
    try {
      await loginWithEmail(email.trim(), pass);
      log.info("login_success_email");
      onSuccess?.();
    } catch (e2) {
      log.warn("login_failed_email", { code: e2?.code || "unknown" });
      setMsg({ type: "error", text: mapAuthError(e2.code, e2.message) });
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setMsg({ type: "", text: "" });
    setBusy(true);
    log.info("submit_google_login");
    try {
      await loginWithGoogle();
      log.info("login_success_google");
      onSuccess?.();
    } catch (e2) {
      log.warn("login_failed_google", { code: e2?.code || "unknown" });
      setMsg({ type: "error", text: mapAuthError(e2.code, e2.message) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleLogin}>
      <Stack spacing={2}>
        <TextField
          label="Correo"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          autoFocus
        />
        <TextField
          label="Contraseña"
          type={showPass ? "text" : "password"}
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          fullWidth
          required
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPass((s) => !s)} edge="end">
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" variant="contained" disabled={busy}>
          Iniciar sesión
        </Button>
        <Button variant="outlined" onClick={handleGoogle} disabled={busy}>
          Continuar con Google
        </Button>
        <Divider />
        <Stack direction="row" justifyContent="space-between">
          <Button size="small" onClick={() => setMode("reset")}>
            ¿Olvidaste tu contraseña?
          </Button>
          <Button size="small" onClick={() => setMode("register")}>
            Crear cuenta
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
