import React, { useState, useContext, useEffect, useMemo, useCallback } from "react";
import clsx from "clsx";
import {
  makeStyles,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  Button,
  MenuItem,
  IconButton,
  Menu,
  useTheme,
  useMediaQuery,
  Avatar,
  Badge,
  withStyles,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NotificationsIcon from "@material-ui/icons/Notifications";
import CachedIcon from "@material-ui/icons/Cached";
import api from "../services/api";
import MainListItems from "./MainListItems";
import NotificationsPopOver from "../components/NotificationsPopOver";
import NotificationsVolume from "../components/NotificationsVolume";
import UserModal from "../components/UserModal";
import { AuthContext } from "../context/Auth/AuthContext";
import BackdropLoading from "../components/BackdropLoading";
import { i18n } from "../translate/i18n";
import toastError from "../errors/toastError";
import AnnouncementsPopover from "../components/AnnouncementsPopover";
import logo from "../assets/logo.png";
import logoDark from "../assets/logo-black.png";
import ChatPopover from "../pages/Chat/ChatPopover";
import { useDate } from "../hooks/useDate";
import ColorModeContext from "../layout/themeContext";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import { getBackendUrl } from "../config";
import useSettings from "../hooks/useSettings";
import VersionControl from "../components/VersionControl";
import useSocketListener from "../hooks/useSocketListener";
import { FaGlobe } from "react-icons/fa";
import ThemeSelector from "../components/ThemeSelector";
import PaletteIcon from "@material-ui/icons/Palette";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import FlashOnIcon from "@material-ui/icons/FlashOn";
import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import ForumIcon from "@material-ui/icons/Forum";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ListIcon from "@material-ui/icons/ListAlt";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import DescriptionIcon from "@material-ui/icons/Description";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import Popover from "@material-ui/core/Popover";
import { GridOn } from "@material-ui/icons";
import { Campaign, ShapeLine } from "@mui/icons-material";
import { Link } from "react-router-dom";

const backendUrl = getBackendUrl();
const drawerWidth = 240;


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    [theme.breakpoints.down("sm")]: {
      height: "calc(100vh - 56px)",
    },
    backgroundColor: theme.palette.fancyBackground,
    "& .MuiButton-outlinedPrimary": {
      color: theme.palette.primary.main, // Usa cor do tema
      border: `1px solid ${theme.palette.primary.main}40`,
      borderRadius: "8px",
      fontWeight: 600,
      textTransform: "none",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: `${theme.palette.primary.main}10`,
        borderColor: theme.palette.primary.main,
        transform: "translateY(-1px)",
        boxShadow: `0 4px 12px ${theme.palette.primary.main}30`,
      },
    },
    "& .MuiTab-textColorPrimary.Mui-selected": {
      color: theme.palette.primary.main, // Usa cor do tema
      fontWeight: 700,
    },
  },

  chip: {
    background: "red",
    color: "white",
  },

  avatar: {
    width: "100%",
  },

  toolbar: {
    paddingRight: 24,
    paddingLeft: 16,
    color: theme.palette.dark.main,
    background: theme.palette.primary.main,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    [theme.breakpoints.down("sm")]: {
      paddingLeft: 8,
      paddingRight: 8,
    },
  },

  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    minHeight: "64px",
    backgroundColor: theme.mode === "light" ? "#ffffff" : "#1e1e1e",
    borderBottom: `1px solid ${theme.mode === "light" ? "#e8e8e8" : "#333333"}`,
    transition: "all 0.3s ease",
    boxShadow: theme.mode === "light" ? "0 1px 3px rgba(0, 0, 0, 0.05)" : "none",
    [theme.breakpoints.down("sm")]: {
      minHeight: "56px",
      padding: "0 12px",
    },
  },

  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },

  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },

  menuButtonHidden: {
    display: "none",
  },

  title: {
    flexGrow: 1,
    fontSize: 16,
    color: "white",
    fontWeight: 600,
    letterSpacing: "0.025em",
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },

  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
    overflowY: "hidden",
    backgroundColor: theme.mode === "light" ? "#ffffff" : "#1e1e1e",
    borderRight: `1px solid ${theme.mode === "light" ? "#e8e8e8" : "#333333"}`,
    boxShadow:
      theme.mode === "light"
        ? "0 4px 20px rgba(0, 0, 0, 0.08)"
        : "0 4px 20px rgba(0, 0, 0, 0.5)",
  },

  drawerPaperClose: {
    overflowX: "hidden",
    overflowY: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },

  appBarSpacer: {
    minHeight: "48px",
  },

  content: {
    flex: 1,
    overflow: "auto",
    padding: theme.spacing(2),
    margin: 0,
    backgroundColor: theme.palette.background.default,
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
    },
  },

  container: {
    padding: 0,
    margin: 0,
    maxWidth: "100%",
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      padding: 0,
    },
  },

  containerWithScroll: {
    flex: 1,
    overflowY: "scroll",
    overflowX: "hidden",
    ...theme.scrollbarStyles,
    borderRadius: "8px",
    border: "2px solid transparent",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    "-ms-overflow-style": "none",
    "scrollbar-width": "none",
  },

  NotificationsPopOver: {
    // Mantém original
  },

  logo: {
    width: "100%",
    height: "50px",
    maxWidth: 200,
    objectFit: "contain",
    display: "block",
    margin: "0 auto",
    [theme.breakpoints.down("sm")]: {
      height: "40px",
      maxWidth: 150,
    },
    transition: "all 0.3s ease",
    cursor: "pointer",
    "&:hover": {
      transform: "scale(1.02)",
      opacity: 0.9,
    },
  },

  hideLogo: {
    display: "none",
  },

  avatar2: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    cursor: "pointer",
    borderRadius: "50%",
    border: "2px solid #ccc",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      borderColor: theme.palette.primary.main, // Usa cor do tema
    },
  },

  updateDiv: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  // Botões da toolbar melhorados
  toolbarButton: {
    color: "rgba(255, 255, 255, 0.9)",
    borderRadius: "8px",
    padding: "8px",
    margin: "0 2px",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      transform: "translateY(-1px)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  },

  // Menu hambúrguer com animação sutil
  menuButton: {
    color: "white",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    "& .MuiSvgIcon-root": {
      transition: "transform 0.3s ease",
    },
    "&:hover .MuiSvgIcon-root": {
      transform: "rotate(90deg)",
    },
  },

  // Seletor de idioma melhorado
  languageSelector: {
    position: "relative",
    display: "inline-block",
    "& > button": {
      background: "rgba(255, 255, 255, 0.1)",
      border: "none",
      borderRadius: "8px",
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: "18px",
      padding: "8px 12px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      "&:hover": {
        background: "rgba(255, 255, 255, 0.2)",
        transform: "translateY(-1px)",
      },
    },
    "& > div": {
      position: "absolute",
      top: "45px",
      left: "0",
      background: "#fff",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      borderRadius: "8px",
      padding: "8px",
      zIndex: 1000,
      minWidth: "120px",
      "& button": {
        background: "none",
        border: "none",
        color: "#374151",
        display: "block",
        width: "100%",
        padding: "8px 12px",
        textAlign: "left",
        borderRadius: "6px",
        fontSize: "14px",
        fontWeight: 500,
        transition: "all 0.2s ease",
        "&:hover": {
          background: `${theme.palette.primary.main}10`, // Usa cor do tema
          color: theme.palette.primary.main, // Usa cor do tema
          transform: "none",
        },
      },
    },
  },

  // Badge animado
  animatedBadge: {
    "& .MuiBadge-badge": {
      animation: "$heartbeat 2s infinite",
    },
  },

  "@keyframes heartbeat": {
    "0%": { transform: "scale(1)" },
    "14%": { transform: "scale(1.1)" },
    "28%": { transform: "scale(1)" },
    "42%": { transform: "scale(1.1)" },
    "70%": { transform: "scale(1)" },
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

const LoggedInLayout = ({ children, themeToggle }) => {
  const classes = useStyles();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleLogout, loading, user, socket } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerVariant, setDrawerVariant] = useState("permanent");

  const [showOptions, setShowOptions] = useState(false);
  const [showAnnouncementsModal, setShowAnnouncementsModal] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const theme = useTheme();
  const { colorMode } = useContext(ColorModeContext);
  const greaterThenSm = useMediaQuery(theme.breakpoints.up("sm"));

  const [volume, setVolume] = useState(localStorage.getItem("volume") || 1);
  const [themeSelectorOpen, setThemeSelectorOpen] = useState(false);
  const [openManagementSubmenu, setOpenManagementSubmenu] = useState(false);
  const [openAdministrationSubmenu, setOpenAdministrationSubmenu] = useState(false);
  const [managementAnchor, setManagementAnchor] = useState(null);
  const [administrationAnchor, setAdministrationAnchor] = useState(null);
  const [isWhatsAppTheme, setIsWhatsAppTheme] = useState(
    () => {
      const themeMode = localStorage.getItem("themeMode");
      return themeMode && themeMode !== "classic";
    }
  );
  const [isWhatsAppMobileTheme, setIsWhatsAppMobileTheme] = useState(
    () => localStorage.getItem("themeMode") === "whatsapp-mobile"
  );

  // Atualiza o estado quando themeMode mudar no localStorage
  useEffect(() => {
    const checkTheme = () => {
      const savedTheme = localStorage.getItem("themeMode");
      // Verifica se NÃO é classic ou undefined/null
      const isWhatsApp = savedTheme && savedTheme !== "classic";
      const isMobile = savedTheme === "whatsapp-mobile";
      setIsWhatsAppTheme(isWhatsApp);
      setIsWhatsAppMobileTheme(isMobile);
      console.log("Tema atual:", savedTheme, "isWhatsApp:", isWhatsApp, "isMobile:", isMobile);
    };

    checkTheme();

    // Adiciona listener para mudanças no localStorage
    const handleStorageChange = (e) => {
      if (e.key === "themeMode") {
        checkTheme();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Polling para detectar mudanças locais
    const interval = setInterval(checkTheme, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const { dateToClient } = useDate();
  const [profileUrl, setProfileUrl] = useState(null);
const [updateInProgress, setUpdateInProgress] = useState(false);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mainListItems = useMemo(
    () => <MainListItems drawerOpen={drawerOpen} collapsed={!drawerOpen} />,
    [user, drawerOpen]
  );

  const settings = useSettings();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await api.get("/announcements/for-company", {
          params: {
            status: true,
            pageNumber: "1"
          }
        });
  
        // Filtra apenas os informativos ativos e não expirados
        const activeAnnouncements = data.records.filter(announcement => {
          const isActive = announcement.status === true || announcement.status === "true";
          const isNotExpired = !announcement.expiresAt || new Date(announcement.expiresAt) > new Date();
          return isActive && isNotExpired;
        });
  
        setAnnouncements(activeAnnouncements);
        
        // Mostra o modal apenas se houver informativos ativos
        if (activeAnnouncements.length > 0) {
          setShowAnnouncementsModal(true);
        }
      } catch (err) {
        toastError(err);
      }
    };
  
    if (user?.id) {
      fetchAnnouncements();
    }
  }, [user?.id]);

  useEffect(() => {
    // if (localStorage.getItem("public-token") === null) {
    //   handleLogout()
    // }

    if (document.body.offsetWidth > 600) {
      if (user.defaultMenu === "closed") {
        setDrawerOpen(false);
      } else {
        setDrawerOpen(true);
      }
    }
    if (user.defaultTheme === "dark" && theme.mode === "light") {
      colorMode.toggleColorMode();
    }
  }, [user.defaultMenu, document.body.offsetWidth]);

  useEffect(() => {
    if (document.body.offsetWidth < 600) {
      setDrawerVariant("temporary");
    } else {
      setDrawerVariant("permanent");
    }
  }, [drawerOpen]);

  useEffect(() => {
  const companyId = user?.companyId;
  
  if (companyId) {
    const buildProfileUrl = () => {
      const savedProfileImage = localStorage.getItem("profileImage");
      const currentProfileImage = savedProfileImage || user.profileImage;
      
      if (currentProfileImage) {
        return `${backendUrl}/public/company${companyId}/user/${currentProfileImage}`;
      }
      return `${backendUrl}/public/app/noimage.png`;
    };

    setProfileUrl(buildProfileUrl());
  }
}, [user?.companyId, user?.profileImage, backendUrl]);

// Callbacks dos eventos
const handleAuthEvent = useCallback((data) => {
  if (data.user.id === +user?.id) {
    toastError("Sua conta foi acessada em outro computador.");
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 1000);
  }
}, [user?.id]);

const handleUserUpdate = useCallback((data) => {
  if (data.action === "update" && data.user.id === +user?.id) {
    if (data.user.profileImage) {
      const newProfileUrl = `${backendUrl}/public/company${user?.companyId}/user/${data.user.profileImage}`;
      setProfileUrl(newProfileUrl);
      localStorage.setItem("profileImage", data.user.profileImage);
    }
  }
}, [user?.companyId, user?.id, backendUrl]);

// Registrar listeners
useSocketListener(socket, user, 'auth', handleAuthEvent);
useSocketListener(socket, user, 'user', handleUserUpdate);

// Status do usuário
useEffect(() => {
  if (socket?.emit && user?.companyId) {
    socket.emit("userStatus");
    
    const interval = setInterval(() => {
      socket?.emit && socket.emit("userStatus");
    }, 1000 * 60 * 5);

    return () => clearInterval(interval);
  }
}, [socket, user?.companyId]);

    const handleUpdateStart = () => {
    setUpdateInProgress(true);
  };

  const handleUpdateComplete = () => {
    setUpdateInProgress(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleOpenUserModal = () => {
    setUserModalOpen(true);
    handleCloseMenu();
  };

  const handleClickLogout = () => {
    handleCloseMenu();
    handleLogout();
  };

  const drawerClose = () => {
    if (document.body.offsetWidth < 600 || user.defaultMenu === "closed") {
      setDrawerOpen(false);
    }
  };

  const handleRefreshPage = () => {
    window.location.reload(false);
  };

  const handleMenuItemClick = () => {
    const { innerWidth: width } = window;
    if (width <= 600) {
      setDrawerOpen(false);
    }
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
    window.location.reload();
  };

  const LANGUAGE_OPTIONS = [
    { code: "pt-BR", label: "Português" },
    { code: "en", label: "English" },
    { code: "es", label: "Spanish" },
    { code: "ar", label: "عربي" },
  ];

  const [enabledLanguages, setEnabledLanguages] = useState(["pt-BR", "en"]);
  const { getAll } = useSettings();
  useEffect(() => {
    async function fetchSettings() {
      try {
        const settings = await getAll();
        const enabledLanguagesSetting = settings.find(
          (s) => s.key === "enabledLanguages"
        )?.value;
        let langs = ["pt-BR", "en"];
        try {
          if (enabledLanguagesSetting) {
            langs = JSON.parse(enabledLanguagesSetting);
          }
        } catch { }
        console.log(
          "Layout - enabledLanguages carregadas:",
          langs,
          "para companyId:",
          user?.companyId
        );
        setEnabledLanguages(langs);
      } catch (error) {
        console.log("Layout - erro ao carregar enabledLanguages:", error);
      }
    }
    fetchSettings();
  }, [user?.companyId]);

  const filteredLanguageOptions = LANGUAGE_OPTIONS.filter((lang) =>
    enabledLanguages.includes(lang.code)
  );

    if (loading || updateInProgress) {
    return <BackdropLoading />;
  }

  return (
    <div className={clsx(classes.root, "logged-in-layout")}>
      <Drawer
        variant={drawerVariant}
        className={drawerOpen ? classes.drawerPaper : classes.drawerPaperClose}
        classes={{
          paper: clsx(
            classes.drawerPaper,
            !drawerOpen && classes.drawerPaperClose
          ),
        }}
        open={drawerOpen}
      >
        {isWhatsAppTheme && drawerOpen && (
          <Box style={{ 
            padding: "12px",
            background: "linear-gradient(135deg, #128C7E 0%, #075E54 100%)",
            borderBottom: "1px solid rgba(0,0,0,0.1)"
          }}>
            <Box style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
                <IconButton onClick={() => setDrawerOpen(!drawerOpen)} size="small">
                  <ChevronLeftIcon style={{ color: "white" }} />
                </IconButton>
                <Avatar src={profileUrl} style={{ width: 40, height: 40, cursor: "pointer" }} />
                <Typography style={{ color: "white", fontWeight: "500", fontSize: "15px" }}>
                  {user.name}
                </Typography>
              </Box>
              <Box style={{ display: "flex", gap: "2px" }}>
                <IconButton size="small" onClick={colorMode.toggleColorMode}>
                  {theme.mode === "dark" ? (
                    <Brightness7Icon style={{ color: "white", fontSize: "20px" }} />
                  ) : (
                    <Brightness4Icon style={{ color: "white", fontSize: "20px" }} />
                  )}
                </IconButton>
                <IconButton size="small" onClick={() => setThemeSelectorOpen(true)}>
                  <PaletteIcon style={{ color: "white", fontSize: "20px" }} />
                </IconButton>
              </Box>
            </Box>
          </Box>
        )}
        {!isWhatsAppTheme && (
          <div className={classes.toolbarIcon}>
          {drawerOpen ? (
            <img
              src={theme.mode === "light" ? logo : logoDark}
              className={classes.logo}
              alt="logo"
              style={{
                objectFit: "contain",
                maxHeight: "50px",
              }}
            />
          ) : null}
          <IconButton 
            onClick={() => setDrawerOpen(!drawerOpen)}
            style={{ 
              marginLeft: drawerOpen ? "auto" : 0,
              color: theme.mode === "light" ? "#333" : "#fff"
            }}
          >
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
        </div>
        )}
        <List className={classes.containerWithScroll}>
          {/* {mainListItems} */}
          <MainListItems collapsed={!drawerOpen} />
        </List>
        <Divider />
      </Drawer>

      {/* Menu recolhido estilo WhatsApp Desktop */}
      {isWhatsAppTheme && !drawerOpen && (
        <Box
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: 1200,
            width: "70px",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background: "linear-gradient(135deg, #128C7E 0%, #075E54 100%)",
            borderRight: "1px solid rgba(0,0,0,0.1)",
            justifyContent: "flex-start"
          }}
        >
          {/* Avatar e botões no topo */}
          <Box style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
            {/* Avatar com menu */}
            <Avatar 
              src={profileUrl} 
              style={{ 
                width: 48, 
                height: 48, 
                cursor: "pointer",
                border: "2px solid rgba(255,255,255,0.3)"
              }}
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(e.currentTarget);
              }}
            />
            
            {/* Menu do avatar */}
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem onClick={handleOpenUserModal}>
                {i18n.t("mainDrawer.appBar.user.profile")}
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleClickLogout}>
                {i18n.t("mainDrawer.appBar.user.logout")}
              </MenuItem>
            </Menu>
            
            <IconButton
              onClick={() => setDrawerOpen(true)}
              style={{ 
                color: "white",
                background: "rgba(255,255,255,0.1)",
                minWidth: "48px",
                minHeight: "48px",
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          
          {/* Botões principais do menu - apenas os principais */}
          <Box style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "16px", flex: 1 }}>
            {/* Menu Gerência - Dropdown */}
            <Box style={{ position: "relative" }}>
              <IconButton 
                onClick={(e) => setManagementAnchor(e.currentTarget)}
                style={{ 
                  color: "white",
                  background: "rgba(255,255,255,0.1)",
                  minWidth: "48px",
                  minHeight: "48px",
                }}
                title="Gerência"
              >
                <DashboardOutlinedIcon fontSize="small" />
              </IconButton>
              {openManagementSubmenu && <ExpandLessIcon style={{ position: "absolute", right: "-15px", top: "50%", transform: "translateY(-50%)", color: "white", fontSize: "16px" }} />}
              {!openManagementSubmenu && managementAnchor && <ExpandMoreIcon style={{ position: "absolute", right: "-15px", top: "50%", transform: "translateY(-50%)", color: "white", fontSize: "16px" }} />}
              
              <Menu
                anchorEl={managementAnchor}
                open={Boolean(managementAnchor)}
                onClose={() => setManagementAnchor(null)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                PaperProps={{
                  style: {
                    marginLeft: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                  }
                }}
              >
                <MenuItem component={Link} to="/" onClick={() => setManagementAnchor(null)}>
                  Dashboard
                </MenuItem>
                <MenuItem component={Link} to="/reports" onClick={() => setManagementAnchor(null)}>
                  Relatórios
                </MenuItem>
                <MenuItem component={Link} to="/moments" onClick={() => setManagementAnchor(null)}>
                  Chats em Tempo Real
                </MenuItem>
              </Menu>
            </Box>
            
            <IconButton 
              component={Link}
              to="/tickets"
              style={{ 
                color: "white",
                background: "rgba(255,255,255,0.1)",
                minWidth: "48px",
                minHeight: "48px",
              }}
              title="Atendimentos"
            >
              <WhatsAppIcon fontSize="small" />
            </IconButton>
            
            <IconButton 
              component={Link}
              to="/quick-messages"
              style={{ 
                color: "white",
                background: "rgba(255,255,255,0.1)",
                minWidth: "48px",
                minHeight: "48px",
              }}
              title="Respostas Rápidas"
            >
              <FlashOnIcon fontSize="small" />
            </IconButton>
            
            <IconButton 
              component={Link}
              to="/contacts"
              style={{ 
                color: "white",
                background: "rgba(255,255,255,0.1)",
                minWidth: "48px",
                minHeight: "48px",
              }}
              title="Contatos"
            >
              <ContactPhoneOutlinedIcon fontSize="small" />
            </IconButton>
            
            <IconButton 
              component={Link}
              to="/tags"
              style={{ 
                color: "white",
                background: "rgba(255,255,255,0.1)",
                minWidth: "48px",
                minHeight: "48px",
              }}
              title="Tags"
            >
              <LocalOfferIcon fontSize="small" />
            </IconButton>
            
            <IconButton 
              component={Link}
              to="/chats"
              style={{ 
                color: "white",
                background: "rgba(255,255,255,0.1)",
                minWidth: "48px",
                minHeight: "48px",
              }}
              title="Chat Interno"
            >
              <ForumIcon fontSize="small" />
            </IconButton>
            
            {/* Menu de Administração para admin */}
            {user.profile === "admin" && (
              <>
                <IconButton 
                  component={Link}
                  to="/users"
                  style={{ 
                    color: "white",
                    background: "rgba(255,255,255,0.1)",
                    minWidth: "48px",
                    minHeight: "48px",
                  }}
                  title="Usuários"
                >
                  <PeopleAltOutlinedIcon fontSize="small" />
                </IconButton>
                
                <IconButton 
                  component={Link}
                  to="/queues"
                  style={{ 
                    color: "white",
                    background: "rgba(255,255,255,0.1)",
                    minWidth: "48px",
                    minHeight: "48px",
                  }}
                  title="Filas"
                >
                  <ListIcon fontSize="small" />
                </IconButton>
                
                <IconButton 
                  component={Link}
                  to="/connections"
                  style={{ 
                    color: "white",
                    background: "rgba(255,255,255,0.1)",
                    minWidth: "48px",
                    minHeight: "48px",
                  }}
                  title="Conexões"
                >
                  <SyncAltIcon fontSize="small" />
                </IconButton>
                
                <IconButton 
                  component={Link}
                  to="/campaigns"
                  style={{ 
                    color: "white",
                    background: "rgba(255,255,255,0.1)",
                    minWidth: "48px",
                    minHeight: "48px",
                  }}
                  title="Campanhas"
                >
                  <Campaign fontSize="small" />
                </IconButton>
                
                <IconButton 
                  component={Link}
                  to="/flowbuilders"
                  style={{ 
                    color: "white",
                    background: "rgba(255,255,255,0.1)",
                    minWidth: "48px",
                    minHeight: "48px",
                  }}
                  title="Flow Builder"
                >
                  <ShapeLine fontSize="small" />
                </IconButton>
                
                <IconButton 
                  component={Link}
                  to="/settings"
                  style={{ 
                    color: "white",
                    background: "rgba(255,255,255,0.1)",
                    minWidth: "48px",
                    minHeight: "48px",
                  }}
                  title="Configurações"
                >
                  <SettingsOutlinedIcon fontSize="small" />
                </IconButton>
                
                <IconButton 
                  component={Link}
                  to="/patch-notes"
                  style={{ 
                    color: "white",
                    background: "rgba(255,255,255,0.1)",
                    minWidth: "48px",
                    minHeight: "48px",
                  }}
                  title="Patch Notes"
                >
                  <DescriptionIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
          
          {/* Botão sair no final */}
          <Box style={{ paddingBottom: "16px", display: "flex", justifyContent: "center" }}>
            <IconButton
              onClick={handleClickLogout}
              style={{ 
                color: "white",
                background: "rgba(220, 53, 69, 0.3)",
                minWidth: "48px",
                minHeight: "48px",
              }}
              title="Sair"
            >
              <ExitToAppIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}

      {!isWhatsAppTheme && (
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}
          color="primary"
        >
        <Toolbar variant="dense" className={classes.toolbar}>
          <IconButton
            edge="start"
            variant="contained"
            aria-label="open drawer"
            style={{ color: "white" }}
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={clsx(drawerOpen && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            component="h2"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {/* {greaterThenSm && user?.profile === "admin" && getDateAndDifDays(user?.company?.dueDate).difData < 7 ? ( */}
            {greaterThenSm &&
              user?.profile === "admin" &&
              user?.company?.dueDate ? (
              <>
                {i18n.t("mainDrawer.appBar.user.message")} <b>{user.name}</b>,{" "}
                {i18n.t("mainDrawer.appBar.user.messageEnd")}{" "}
                <b>{user?.company?.name}</b>! (
                {i18n.t("mainDrawer.appBar.user.active")}{" "}
                {dateToClient(user?.company?.dueDate)})
              </>
            ) : (
              <>
                {i18n.t("mainDrawer.appBar.user.message")} <b>{user.name}</b>,{" "}
                {i18n.t("mainDrawer.appBar.user.messageEnd")}{" "}
                <b>{user?.company?.name}</b>!
              </>
            )}
          </Typography>

          <VersionControl />

          <div
            style={{ position: "relative", display: "inline-block" }}
            className="language-dropdown"
          >
            <button
              onClick={() => setShowOptions(!showOptions)}
              style={{
                background: "none",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: "22px",
                paddingRight: "20px",
                paddingTop: "8px",
              }}
            >
              <FaGlobe />
            </button>

            {showOptions && (
              <div
                style={{
                  position: "absolute",
                  top: "35px",
                  left: "0",
                  background: "#fff",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  padding: "8px",
                  zIndex: 1000,
                  minWidth: "120px",
                  maxWidth: "200px",
                }}
              >
                {filteredLanguageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "block",
                      width: "100%",
                      padding: "4px",
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <IconButton edge="start" onClick={colorMode.toggleColorMode}>
            {theme.mode === "dark" ? (
              <Brightness7Icon style={{ color: "white" }} />
            ) : (
              <Brightness4Icon style={{ color: "white" }} />
            )}
          </IconButton>

          <IconButton edge="start" onClick={() => setThemeSelectorOpen(true)}>
            <PaletteIcon style={{ color: "white" }} />
          </IconButton>

          <NotificationsVolume setVolume={setVolume} volume={volume} />

          <IconButton
            onClick={handleRefreshPage}
            aria-label={i18n.t("mainDrawer.appBar.refresh")}
            color="inherit"
          >
            <CachedIcon style={{ color: "white" }} />
          </IconButton>

          {/* <DarkMode themeToggle={themeToggle} /> */}

          {user.id && <NotificationsPopOver volume={volume} />}

          <AnnouncementsPopover />

          <ChatPopover />

          <div className="user-menu-wrapper">
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
              onClick={handleMenu}
            >
              <Avatar
                alt="Multi100"
                className={classes.avatar2}
                src={profileUrl}
              />
            </StyledBadge>

            <UserModal
              open={userModalOpen}
              onClose={() => setUserModalOpen(false)}
              onImageUpdate={(newProfileUrl) => setProfileUrl(newProfileUrl)}
              userId={user?.id}
            />

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={menuOpen}
              onClose={handleCloseMenu}
              PaperProps={{
                style: {
                  minWidth: "150px",
                  maxWidth: "200px",
                  width: "auto",
                },
              }}
            >
              <MenuItem onClick={handleOpenUserModal}>
                {i18n.t("mainDrawer.appBar.user.profile")}
              </MenuItem>
              <MenuItem onClick={handleClickLogout}>
                {i18n.t("mainDrawer.appBar.user.logout")}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      )}
      <main className={classes.content}>
        {!isWhatsAppTheme && <div className={classes.appBarSpacer} />}
        {children ? children : null}
      </main>

      {/* Modal de Informativos */}
      <Dialog
        open={showAnnouncementsModal}
        onClose={() => setShowAnnouncementsModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Informativos</DialogTitle>
        <DialogContent dividers>
          {selectedAnnouncement ? (
            <div>
              <Typography variant="h6" gutterBottom>
                {selectedAnnouncement.title}
              </Typography>
              <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                {selectedAnnouncement.text}
              </Typography>
              {selectedAnnouncement.mediaPath && (
                <div style={{ marginTop: 16 }}>
                  <img
                    src={`${backendUrl}/public/company${user.companyId}${selectedAnnouncement.mediaPath}`}
                    alt="Anexo"
                    style={{ maxWidth: '100%' }}
                  />
                </div>
              )}
              <Button
                onClick={() => setSelectedAnnouncement(null)}
                style={{ marginTop: 16 }}
                variant="outlined"
              >
                Voltar para lista
              </Button>
            </div>
          ) : (
            <List>
              {announcements.map((announcement) => (
                <ListItem
                  button
                  key={announcement.id}
                  onClick={() => setSelectedAnnouncement(announcement)}
                >
                  <ListItemAvatar>
                    <Avatar>
                      <NotificationsIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={announcement.title}
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="textPrimary"
                        >
                          Prioridade: {announcement.priority === 1 ? 'Alta' : announcement.priority === 2 ? 'Média' : 'Baixa'}
                        </Typography>
                        {` — ${new Date(announcement.createdAt).toLocaleDateString()}`}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowAnnouncementsModal(false)}
            color="primary"
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <ThemeSelector 
        open={themeSelectorOpen} 
        onClose={() => setThemeSelectorOpen(false)} 
      />

    </div>
  );
};

export default LoggedInLayout;