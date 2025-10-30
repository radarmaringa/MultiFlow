import React, { useState, useEffect } from "react";
import {
  Grid,
  FormControl,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
  Card,
  CardContent,
  Divider,
  Box,
  FormHelperText
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { toast } from "react-toastify";
import useCompanySettings from "../../hooks/useSettings/companySettings";

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  card: {
    marginBottom: theme.spacing(2),
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  sectionSubtitle: {
    fontSize: "14px",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  formControl: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  switchLabel: {
    marginBottom: theme.spacing(1),
  },
  textField: {
    width: "100%",
  },
  helperText: {
    fontSize: "12px",
    color: theme.palette.text.secondary,
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}));

const UnattendedTicketSettings = ({ settings, onSettingsChange }) => {
  const classes = useStyles();
  const { update } = useCompanySettings();
  
  const [loading, setLoading] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [timeoutMinutes, setTimeoutMinutes] = useState(15);
  const [customMessage, setCustomMessage] = useState("");

  useEffect(() => {
    if (settings) {
      setNotificationEnabled(settings.enableUnattendedTicketNotification === "enabled");
      setTimeoutMinutes(settings.unattendedTicketTimeoutMinutes || 15);
      setCustomMessage(settings.unattendedTicketNotificationMessage || "");
    }
  }, [settings]);

  const handleUpdateSetting = async (column, value) => {
    setLoading(true);
    try {
      await update({
        column,
        data: value,
        companyId: settings.companyId
      });
      
      // Atualizar estado local
      const newSettings = { ...settings, [column]: value };
      onSettingsChange(newSettings);
      
      toast.success("Configuração atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar configuração");
      console.error("Error updating setting:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationToggle = (enabled) => {
    setNotificationEnabled(enabled);
    handleUpdateSetting("enableUnattendedTicketNotification", enabled ? "enabled" : "disabled");
  };

  const handleTimeoutChange = (minutes) => {
    setTimeoutMinutes(minutes);
    handleUpdateSetting("unattendedTicketTimeoutMinutes", minutes);
  };

  const handleMessageChange = (message) => {
    setCustomMessage(message);
    handleUpdateSetting("unattendedTicketNotificationMessage", message);
  };

  const defaultMessage = `🚨 *ALERTA DE ATENDIMENTO*\n\n` +
    `Olá {NOME_USUARIO}! Há {QUANTIDADE} ticket(s) aguardando atendimento há mais de {TEMPO} minutos nas suas filas:\n\n` +
    `{LISTA_TICKETS}\n\n` +
    `Por favor, verifique o sistema de atendimento.`;

  return (
    <div className={classes.container}>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.sectionTitle}>
            🔔 Notificações de Tickets Não Atendidos
          </Typography>
          
          <Typography className={classes.sectionSubtitle}>
            Configure notificações automáticas para quando tickets ficarem aguardando atendimento por muito tempo.
          </Typography>

          <Divider className={classes.divider} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl className={classes.formControl}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationEnabled}
                      onChange={(e) => handleNotificationToggle(e.target.checked)}
                      disabled={loading}
                      color="primary"
                    />
                  }
                  label="Habilitar notificações de tickets não atendidos"
                  className={classes.switchLabel}
                />
                <FormHelperText className={classes.helperText}>
                  Quando habilitado, usuários configurados receberão notificações via WhatsApp quando tickets ficarem aguardando atendimento.
                </FormHelperText>
              </FormControl>
            </Grid>

            {notificationEnabled && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      label="Tempo de espera para notificação (minutos)"
                      type="number"
                      value={timeoutMinutes}
                      onChange={(e) => handleTimeoutChange(parseInt(e.target.value) || 15)}
                      disabled={loading}
                      inputProps={{ min: 5, max: 60 }}
                      className={classes.textField}
                      variant="outlined"
                      margin="dense"
                    />
                    <FormHelperText className={classes.helperText}>
                      Tempo mínimo que um ticket deve aguardar antes de enviar notificação (5-60 minutos).
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      label="Mensagem personalizada (opcional)"
                      multiline
                      rows={6}
                      value={customMessage}
                      onChange={(e) => handleMessageChange(e.target.value)}
                      disabled={loading}
                      className={classes.textField}
                      variant="outlined"
                      margin="dense"
                      placeholder={defaultMessage}
                    />
                    <FormHelperText className={classes.helperText}>
                      Deixe em branco para usar mensagem padrão. Use as variáveis: {"{NOME_USUARIO}"}, {"{QUANTIDADE}"}, {"{TEMPO}"}, {"{LISTA_TICKETS}"}.
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box 
                    p={2} 
                    bgcolor="grey.100" 
                    borderRadius={1}
                    border="1px solid"
                    borderColor="grey.300"
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      📋 Instruções para Usuários:
                    </Typography>
                    <Typography variant="body2" component="div">
                      <ol>
                        <li>Os usuários devem habilitar notificações em suas configurações pessoais</li>
                        <li>Cada usuário deve informar seu número de WhatsApp para receber as notificações</li>
                        <li>As notificações serão enviadas apenas para tickets das filas que o usuário atende</li>
                        <li>Cada ticket será notificado apenas uma vez para evitar spam</li>
                      </ol>
                    </Typography>
                  </Box>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnattendedTicketSettings;
