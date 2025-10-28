import { useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../../services/auth/firebase/AuthContext";
import { mapAuthError } from "../utils/errorMap";
import { getLogger } from "../../../services/logs";
const log = getLogger("auth.register");

export default function RegisterForm({ setMode, setMsg }) {
  const { registerWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    const emailDomain = (email.split("@")[1] || "").toLowerCase();

    if (pass.length < 6) {
      setMsg({
        type: "error",
        text: "La contraseña debe tener al menos 6 caracteres.",
      });
      return;
    }
    if (pass !== pass2) {
      setMsg({ type: "error", text: "Las contraseñas no coinciden." });
      return;
    }

    setBusy(true);
    log.info("submit_register", { emailDomain, passLen: pass.length });
    try {
      await registerWithEmail(email.trim(), pass);
      log.info("register_success", { emailDomain });
      setMsg({
        type: "success",
        text: "Registro exitoso. Revisa tu correo para verificar la cuenta.",
      });
      setMode("login");
      setPass("");
      setPass2("");
    } catch (e2) {
      log.warn("register_failed", { code: e2?.code || "unknown" });
      setMsg({ type: "error", text: mapAuthError(e2.code, e2.message) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleRegister}>
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
        <TextField
          label="Repetir contraseña"
          type={showPass ? "text" : "password"}
          value={pass2}
          onChange={(e) => setPass2(e.target.value)}
          fullWidth
          required
        />
        <Button type="submit" variant="contained" disabled={busy}>
          Crear cuenta
        </Button>
        <Button size="small" onClick={() => setMode("login")}>
          Ya tengo cuenta
        </Button>
      </Stack>
    </Box>
  );
}
