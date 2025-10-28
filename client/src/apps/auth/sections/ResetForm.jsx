import { useState } from "react";
import { Box, Stack, TextField, Button } from "@mui/material";
import { useAuth } from "../../../services/auth/firebase/AuthContext";
import { mapAuthError } from "../utils/errorMap";
import { getLogger } from "../../../services/logs";
const log = getLogger("auth.reset");

export default function ResetForm({ setMode, setMsg }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setBusy(true);
    const emailDomain = (email.split("@")[1] || "").toLowerCase();
    log.info("submit_reset_request", { emailDomain });

    try {
      await resetPassword(email.trim());
      log.info("reset_email_sent", { emailDomain });
      setMsg({
        type: "success",
        text: "Te enviamos un correo para restablecer tu contraseña.",
      });
    } catch (e2) {
      log.warn("reset_failed", { code: e2?.code || "unknown" });
      setMsg({ type: "error", text: mapAuthError(e2.code, e2.message) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleReset}>
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
        <Button type="submit" variant="contained" disabled={busy}>
          Enviar correo de restablecimiento
        </Button>
        <Button size="small" onClick={() => setMode("login")}>
          Volver al login
        </Button>
      </Stack>
    </Box>
  );
}
