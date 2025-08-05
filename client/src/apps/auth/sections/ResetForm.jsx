import { Box, TextField, Button, CircularProgress, Alert, Link, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../../services/firebase/AuthContext";
import { useTranslation } from "react-i18next";

export default function ResetForm({ onSuccess, onSwitch }) {
  const { t } = useTranslation("auth");
  const { resetPassword } = useAuth();
  const [email, setEmail]    = useState("");
  const [loading, setLoading]= useState(false);
  const [error,   setError]  = useState("");
  const [message, setMessage]= useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    try {
      await resetPassword(email);
      setMessage(t("reset.messageSent"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error   && <Alert severity="error" sx={{ mb:2 }}>{error}</Alert>}
      {message && <Alert severity="success" sx={{ mb:2 }}>{message}</Alert>}

      <TextField
        label={t("reset.email")}
        type="email"
        fullWidth required
        value={email}
        onChange={e => setEmail(e.target.value)}
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
          : t("reset.submit")
        }
      </Button>

      <Typography align="center" sx={{ mt:1 }}>
        <Link component="button" onClick={() => onSwitch("login")}>
          {t("reset.backToLogin")}
        </Link>
      </Typography>
    </Box>
  );
}