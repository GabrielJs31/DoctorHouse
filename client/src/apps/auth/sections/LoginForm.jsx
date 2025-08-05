import { Box, TextField, Button, CircularProgress, Alert, Link, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../../services/firebase/AuthContext";
import { useTranslation } from "react-i18next";

export default function LoginForm({ onSuccess, onSwitch }) {
  const { t } = useTranslation("auth");
  const { loginWithEmail } = useAuth();
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await loginWithEmail(email, pass);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}

      <TextField
        label={t("login.email")}
        type="email"
        fullWidth required
        value={email}
        onChange={e => setEmail(e.target.value)}
        sx={{ mb:2 }}
      />

      <TextField
        label={t("login.password")}
        type="password"
        fullWidth required
        value={pass}
        onChange={e => setPass(e.target.value)}
        sx={{ mb:2 }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={loading}
      >
        {loading 
          ? <CircularProgress size={24} />
          : t("login.submit")
        }
      </Button>

      <Typography align="center" sx={{ mt:1 }}>
        <Link component="button" onClick={() => onSwitch("reset")}>
          {t("login.forgotPassword")}
        </Link>
      </Typography>

      <Typography align="center" sx={{ mt:1 }}>
        {t("login.noAccount")}{" "}
        <Link component="button" onClick={() => onSwitch("register")}>
          {t("login.register")}
        </Link>
      </Typography>
    </Box>
  );
}
