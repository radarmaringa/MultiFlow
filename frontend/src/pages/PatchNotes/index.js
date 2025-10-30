import React from "react";
import { makeStyles, Paper, Typography, Box, Divider, Chip } from "@material-ui/core";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import NewReleasesIcon from "@material-ui/icons/NewReleases";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import UpdateIcon from "@material-ui/icons/Update";

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.palette.background.paper,
  },
  mainPaper: {
    ...theme.scrollbarStyles,
    overflowY: "auto",
    flex: 1,
    padding: theme.spacing(3),
    borderRadius: "12px",
    boxShadow: theme.mode === "light" 
      ? "0 2px 8px rgba(0,0,0,0.08)" 
      : "0 2px 8px rgba(0,0,0,0.3)",
  },
  versionCard: {
    marginBottom: theme.spacing(3),
    padding: theme.spacing(3),
    borderRadius: "12px",
    border: `1px solid ${theme.mode === "light" ? "#e0e0e0" : "#444"}`,
    backgroundColor: theme.mode === "light" ? "#ffffff" : "#1e1e1e",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: theme.mode === "light" 
        ? "0 4px 16px rgba(0,0,0,0.12)" 
        : "0 4px 16px rgba(0,0,0,0.5)",
      transform: "translateY(-2px)",
    },
  },
  versionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
  versionTitle: {
    fontWeight: "bold",
    fontSize: "1.5rem",
    color: theme.palette.primary.main,
  },
  versionDate: {
    color: theme.mode === "light" ? "#666" : "#999",
    fontSize: "0.9rem",
  },
  featureList: {
    marginTop: theme.spacing(2),
  },
  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: theme.spacing(1.5),
    padding: theme.spacing(1),
    backgroundColor: theme.mode === "light" ? "#f8f9fa" : "#2a2a2a",
    borderRadius: "8px",
  },
  featureIcon: {
    marginRight: theme.spacing(2),
    color: theme.palette.success.main,
  },
  featureText: {
    flex: 1,
    color: theme.mode === "light" ? "#333" : "#fff",
  },
  categoryChip: {
    marginRight: theme.spacing(0.5),
    marginTop: theme.spacing(0.5),
  },
  highlightBox: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    borderRadius: "8px",
    backgroundColor: theme.mode === "light" ? "#e3f2fd" : "#1a237e",
    border: `1px solid ${theme.palette.primary.main}40`,
  },
  badge: {
    marginLeft: theme.spacing(1),
  },
}));

const PatchNotes = () => {
  const classes = useStyles();

  const versions = [
    {
      version: "5.2.2",
      date: "27 de Outubro de 2025",
      type: "patch",
      highlights: [
        "Corrige sobreposição de temas",
        "Ajusta detecção de tema WhatsApp",
        "Melhora aplicação de temas"
      ],
      features: [
        {
          category: "Temas",
          icon: <CheckCircleIcon />,
          text: "Corrige sobreposição de temas WhatsApp com tema Clássico"
        },
        {
          category: "Temas",
          icon: <UpdateIcon />,
          text: "Ajusta lógica de detecção para não interferência entre temas"
        },
        {
          category: "Temas",
          icon: <CheckCircleIcon />,
          text: "Cada tema agora se aplica corretamente sem conflitos"
        }
      ]
    },
    {
      version: "5.2.1",
      date: "27 de Outubro de 2025",
      type: "patch",
      highlights: [
        "Corrige abertura do perfil ao clicar na foto",
        "Atualiza versão no menu para 5.2.1",
        "Inicia preparação para tema mobile"
      ],
      features: [
        {
          category: "Bug Fix",
          icon: <CheckCircleIcon />,
          text: "Corrige clique na foto do avatar para abrir modal de perfil"
        },
        {
          category: "Versão",
          icon: <UpdateIcon />,
          text: "Atualiza versão exibida no menu para 5.2.1"
        },
        {
          category: "Mobile",
          icon: <NewReleasesIcon />,
          text: "Inicia preparação para tema WhatsApp Mobile (EM DESENVOLVIMENTO)"
        }
      ]
    },
    {
      version: "5.2.0",
      date: "27 de Outubro de 2025",
      type: "minor",
      highlights: [
        "Adiciona botão sair no menu recolhido",
        "Moderniza tela de login",
        "Melhora visual da interface"
      ],
      features: [
        {
          category: "Interface",
          icon: <CheckCircleIcon />,
          text: "Adiciona botão sair no final da barra do menu recolhido no tema WhatsApp"
        },
        {
          category: "Login",
          icon: <NewReleasesIcon />,
          text: "Tela de login reformulada com visual moderno e gradiente"
        },
        {
          category: "Interface",
          icon: <UpdateIcon />,
          text: "Card de login com bordas arredondadas, sombras e blur effect"
        },
        {
          category: "Menu",
          icon: <CheckCircleIcon />,
          text: "Botão sair com cor vermelha destaque no menu recolhido"
        }
      ]
    },
    {
      version: "5.1.1",
      date: "27 de Outubro de 2025",
      type: "patch",
      highlights: [
        "Correções na seleção de temas",
        "Melhorias na interface do menu"
      ],
      features: [
        {
          category: "Temas",
          icon: <CheckCircleIcon />,
          text: "Corrige atualização de tema WhatsApp Desktop ao selecionar"
        },
        {
          category: "Interface",
          icon: <UpdateIcon />,
          text: "Adiciona polling para detectar mudanças de tema em tempo real"
        },
        {
          category: "Menu",
          icon: <CheckCircleIcon />,
          text: "Melhora exibição de opção de logout e toggle de menu"
        }
      ]
    },
    {
      version: "5.1.0",
      date: "27 de Outubro de 2025",
      type: "minor",
      highlights: [
        "Novo tema WhatsApp Desktop (em desenvolvimento)",
        "Seleção de temas dinâmica",
        "Interface estilo WhatsApp"
      ],
      features: [
        {
          category: "Temas",
          icon: <NewReleasesIcon />,
          text: "Adiciona tema WhatsApp Desktop com layout sem barra superior (EM DESENVOLVIMENTO)"
        },
        {
          category: "Interface",
          icon: <CheckCircleIcon />,
          text: "Move controles para cabeçalho do drawer lateral no tema WhatsApp"
        },
        {
          category: "Interface",
          icon: <UpdateIcon />,
          text: "Header compacto com avatar, nome do usuário e botões de ação"
        },
        {
          category: "Temas",
          icon: <CheckCircleIcon />,
          text: "Sistema de seleção de temas com preview visual"
        },
        {
          category: "Interface",
          icon: <CheckCircleIcon />,
          text: "Menu recolhido mostra apenas ícones principais do sistema"
        }
      ]
    },
    {
      version: "5.0.1",
      date: "27 de Outubro de 2025",
      type: "patch",
      highlights: [
        "Adicionada página de Patch Notes para acompanhamento de versões",
        "Criação de histórico completo de melhorias do sistema"
      ],
      features: [
        {
          category: "Documentação",
          icon: <CheckCircleIcon />,
          text: "Nova página de Patch Notes acessível pelo menu lateral"
        },
        {
          category: "Interface",
          icon: <CheckCircleIcon />,
          text: "Visual moderno e responsivo para exibição de histórico de versões"
        },
        {
          category: "Documentação",
          icon: <UpdateIcon />,
          text: "Sistema organizado de categorização de melhorias com badges e ícones"
        }
      ]
    },
    {
      version: "5.0.0",
      date: "27 de Outubro de 2025",
      type: "major",
      highlights: [
        "Modernização completa da interface do sistema",
        "Melhorias significativas na experiência do usuário",
        "Otimizações de performance e responsividade"
      ],
      features: [
        {
          category: "Interface",
          icon: <CheckCircleIcon />,
          text: "Redesign completo da interface com visual moderno e responsivo"
        },
        {
          category: "Tickets",
          icon: <UpdateIcon />,
          text: "Melhorias nas abas de tickets com bordas arredondadas e efeitos hover suaves"
        },
        {
          category: "Interface",
          icon: <CheckCircleIcon />,
          text: "Modernização visual das listas de tickets com cards estilizados"
        },
        {
          category: "Tempo de Espera",
          icon: <NewReleasesIcon />,
          text: "Exibição de tempo de espera com código de cores (verde: até 5min, laranja: 5-15min, vermelho: +30min)"
        },
        {
          category: "Listagens",
          icon: <UpdateIcon />,
          text: "Ajuste de ordenação para novos tickets aparecerem abaixo dos mais antigos nas abas 'Aguardando' e 'Abertos'"
        },
        {
          category: "Relatórios",
          icon: <CheckCircleIcon />,
          text: "Adição de coluna 'Tempo de Espera' em relatórios e dashboard"
        },
        {
          category: "Interface",
          icon: <CheckCircleIcon />,
          text: "Correção da exibição da logo no drawer lateral"
        },
        {
          category: "Performance",
          icon: <UpdateIcon />,
          text: "Otimização de queries SQL para cálculo correto do tempo de espera de tickets pendentes"
        }
      ]
    },
    {
      version: "4.9.6",
      date: "27 de Outubro de 2025",
      type: "minor",
      highlights: [
        "Correções na sincronização de versão",
        "Ajustes na lógica de verificação de atualizações"
      ],
      features: [
        {
          category: "Versão",
          icon: <UpdateIcon />,
          text: "Corrige lógica de sincronização de versão com comparação de strings"
        },
        {
          category: "Versão",
          icon: <CheckCircleIcon />,
          text: "Melhora sincronização entre localStorage e package.json"
        }
      ]
    },
    {
      version: "4.9.5",
      date: "27 de Outubro de 2025",
      type: "minor",
      highlights: [
        "Melhorias na interface das abas",
        "Ajustes gerais de layout"
      ],
      features: [
        {
          category: "Interface",
          icon: <CheckCircleIcon />,
          text: "Moderniza aparência das abas de tickets com bordas arredondadas"
        },
        {
          category: "Interface",
          icon: <UpdateIcon />,
          text: "Adiciona efeitos hover com sombras suaves nas abas"
        },
        {
          category: "Interface",
          icon: <CheckCircleIcon />,
          text: "Ajusta cores para modo claro/escuro"
        }
      ]
    },
    {
      version: "4.9.4",
      date: "27 de Outubro de 2025",
      type: "patch",
      highlights: [
        "Correção na exibição da logo",
        "Atualização de versão padrão"
      ],
      features: [
        {
          category: "Interface",
          icon: <CheckCircleIcon />,
          text: "Corrige src da logo no drawer usando logo e logoDark"
        },
        {
          category: "Interface",
          icon: <UpdateIcon />,
          text: "Adiciona MenuIcon quando drawer fechado"
        },
        {
          category: "Versão",
          icon: <CheckCircleIcon />,
          text: "Atualiza versão padrão de 4.7.7 para 5.0.0"
        }
      ]
    },
    {
      version: "4.9.3",
      date: "27 de Outubro de 2025",
      type: "patch",
      highlights: [
        "Correção no cálculo de tempo de espera nos relatórios",
        "Ajuste de nome da coluna no dashboard"
      ],
      features: [
        {
          category: "Relatórios",
          icon: <UpdateIcon />,
          text: "Corrige cálculo de tempo de espera no relatório e ajusta nome da coluna"
        },
        {
          category: "Dashboard",
          icon: <CheckCircleIcon />,
          text: "Renomeia 'Tempo Médio de Espera' para 'Tempo de Espera'"
        }
      ]
    },
    {
      version: "4.9.2",
      date: "27 de Outubro de 2025",
      type: "patch",
      highlights: [
        "Correção no popup de atualização",
        "Auto-atualiza versão no localStorage"
      ],
      features: [
        {
          category: "Versão",
          icon: <UpdateIcon />,
          text: "Auto-atualiza versão no localStorage para evitar popup de atualização incorreto"
        },
        {
          category: "Interface",
          icon: <CheckCircleIcon />,
          text: "Previne popup de versão incorreto ao trocar de dispositivo"
        }
      ]
    },
    {
      version: "4.9.1",
      date: "27 de Outubro de 2025",
      type: "patch",
      highlights: [
        "Correção na verificação de versão",
        "Evita popup incorreto de atualização"
      ],
      features: [
        {
          category: "Versão",
          icon: <CheckCircleIcon />,
          text: "Corrige verificação de versão para evitar popup incorreto"
        }
      ]
    },
    {
      version: "4.9.0",
      date: "27 de Outubro de 2025",
      type: "minor",
      highlights: [
        "Correção no cálculo do tempo médio de espera",
        "Inclusão de tickets pendentes nos relatórios"
      ],
      features: [
        {
          category: "Relatórios",
          icon: <CheckCircleIcon />,
          text: "Corrige cálculo do tempo médio de espera para incluir tickets pendentes"
        },
        {
          category: "Dashboard",
          icon: <UpdateIcon />,
          text: "Agora considera tempo de espera de tickets ainda não atendidos"
        }
      ]
    },
    {
      version: "4.8.12",
      date: "12 de Agosto de 2025",
      type: "minor",
      highlights: [
        "Melhorias na interface de tickets",
        "Correções de bugs importantes"
      ],
      features: [
        {
          category: "Tickets",
          icon: <CheckCircleIcon />,
          text: "Melhorias na interface de gerenciamento de tickets"
        },
        {
          category: "Bugs",
          icon: <UpdateIcon />,
          text: "Correções de problemas de sincronização"
        }
      ]
    },
    {
      version: "4.7.7",
      date: "17 de Julho de 2025",
      type: "minor",
      highlights: [
        "Atualizações de segurança",
        "Melhorias em performance"
      ],
      features: [
        {
          category: "Segurança",
          icon: <CheckCircleIcon />,
          text: "Atualizações de segurança em componentes críticos"
        },
        {
          category: "Performance",
          icon: <UpdateIcon />,
          text: "Otimizações de performance no dashboard"
        }
      ]
    }
  ];

  return (
    <MainContainer>
      <MainHeader>
        <Title>{i18n.t("patchNotes.title") || "Patch Notes"}</Title>
      </MainHeader>
      <Paper className={classes.mainPaper}>
        <Typography variant="h5" gutterBottom style={{ fontWeight: "bold", marginBottom: "24px" }}>
          Histórico de Versões
        </Typography>
        <Typography variant="body2" color="textSecondary" style={{ marginBottom: "32px" }}>
          Acompanhe todas as melhorias e novidades implementadas no sistema
        </Typography>

        {versions.map((version, index) => (
          <Paper key={index} className={classes.versionCard} elevation={0}>
            <Box className={classes.versionHeader}>
              <Box>
                <Typography variant="h5" className={classes.versionTitle}>
                  Versão {version.version}
                  <Chip
                    label={version.type === "major" ? "Principal" : "Atualização"}
                    size="small"
                    color={version.type === "major" ? "primary" : "default"}
                    className={classes.badge}
                  />
                </Typography>
              </Box>
              <Typography className={classes.versionDate}>
                {version.date}
              </Typography>
            </Box>

            <Divider style={{ marginBottom: "16px" }} />

            <Typography variant="subtitle2" style={{ fontWeight: "bold", marginBottom: "12px" }}>
              Destaques:
            </Typography>
            <Box className={classes.highlightBox}>
              {version.highlights.map((highlight, idx) => (
                <Typography key={idx} variant="body2" style={{ marginBottom: "4px" }}>
                  • {highlight}
                </Typography>
              ))}
            </Box>

            <Typography variant="subtitle2" style={{ fontWeight: "bold", marginTop: "16px", marginBottom: "12px" }}>
              Melhorias Detalhadas:
            </Typography>
            <Box className={classes.featureList}>
              {version.features.map((feature, idx) => (
                <Box key={idx} className={classes.featureItem}>
                  <Box className={classes.featureIcon}>
                    {feature.icon}
                  </Box>
                  <Box style={{ flex: 1 }}>
                    <Box style={{ display: "flex", alignItems: "center", marginBottom: "4px" }}>
                      <Typography variant="body1" className={classes.featureText}>
                        {feature.text}
                      </Typography>
                    </Box>
                    <Chip
                      label={feature.category}
                      size="small"
                      className={classes.categoryChip}
                      variant="outlined"
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        ))}
      </Paper>
    </MainContainer>
  );
};

export default PatchNotes;

