import React, { useState, useContext } from "react";
import { makeStyles, Dialog, DialogTitle, DialogContent, Button, Typography, Box, Divider } from "@material-ui/core";
import ColorModeContext from "../../layout/themeContext";

const useStyles = makeStyles((theme) => ({
  dialog: {
    "& .MuiDialog-paper": {
      borderRadius: "16px",
      padding: theme.spacing(1),
    },
  },
  dialogTitle: {
    padding: theme.spacing(2),
    textAlign: "center",
    fontWeight: "bold",
  },
  dialogContent: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1.5),
  },
  themeOption: {
    padding: theme.spacing(2),
    borderRadius: "12px",
    border: `2px solid ${theme.mode === "light" ? "#e0e0e0" : "#444"}`,
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: theme.mode === "light" ? "#ffffff" : "#1e1e1e",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: theme.mode === "light" 
        ? "0 4px 12px rgba(0,0,0,0.1)" 
        : "0 4px 12px rgba(0,0,0,0.3)",
      borderColor: theme.palette.primary.main,
    },
    "&.selected": {
      borderColor: theme.palette.primary.main,
      backgroundColor: `${theme.palette.primary.main}10`,
    },
  },
  themePreview: {
    width: "100%",
    height: "80px",
    borderRadius: "8px",
    marginBottom: theme.spacing(1),
  },
  themeName: {
    fontWeight: "bold",
    fontSize: "1rem",
    marginBottom: theme.spacing(0.5),
  },
  themeDescription: {
    fontSize: "0.875rem",
    color: theme.mode === "light" ? "#666" : "#999",
  },
}));

const ThemeSelector = ({ open, onClose }) => {
  const classes = useStyles();
  const { setThemeMode, themeMode } = useContext(ColorModeContext);
  const [selectedTheme, setSelectedTheme] = useState(themeMode || "classic");

  const themes = [
    {
      id: "classic",
      name: "Clássico",
      description: "Tema original do sistema",
      preview: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: "whatsapp-desktop",
      name: "WhatsApp Desktop",
      description: "Tema inspirado no WhatsApp Desktop",
      preview: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
    },
    {
      id: "whatsapp-mobile",
      name: "WhatsApp Mobile",
      description: "Tema inspirado no app WhatsApp Mobile (Em Desenvolvimento)",
      preview: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
    },
  ];

  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    console.log("Selecionando tema:", themeId);
    if (setThemeMode) {
      setThemeMode(themeId);
    } else {
      // Fallback se setThemeMode não existir
      window.localStorage.setItem("themeMode", themeId);
      window.location.reload(); // Recarrega para aplicar
    }
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      className={classes.dialog}
    >
      <DialogTitle className={classes.dialogTitle}>
        Escolher Tema
      </DialogTitle>
      <Divider />
      <DialogContent className={classes.dialogContent}>
        {themes.map((theme) => (
          <Box
            key={theme.id}
            className={`${classes.themeOption} ${selectedTheme === theme.id ? "selected" : ""}`}
            onClick={() => handleThemeSelect(theme.id)}
          >
            <Box
              className={classes.themePreview}
              style={{
                background: theme.preview,
              }}
            />
            <Typography className={classes.themeName}>
              {theme.name}
            </Typography>
            <Typography className={classes.themeDescription}>
              {theme.description}
            </Typography>
          </Box>
        ))}
      </DialogContent>
    </Dialog>
  );
};

export default ThemeSelector;

