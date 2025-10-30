import React, { useState, useEffect, useReducer, useContext, useMemo } from "react";

import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import Paper from "@material-ui/core/Paper";

import TicketListItem from "../TicketListItemCustom";
import TicketsListSkeleton from "../TicketsListSkeleton";

import useTickets from "../../hooks/useTickets";
import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles((theme) => ({
    ticketsListWrapper: {
        position: "relative",
        display: "flex",
        height: "100%",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "12px",
        backgroundColor: theme.mode === "light" ? "#ffffff" : "#1e1e1e",
        boxShadow: theme.mode === "light" 
            ? "0 2px 12px rgba(0, 0, 0, 0.08)" 
            : "0 2px 12px rgba(0, 0, 0, 0.3)",
        [theme.breakpoints.down("sm")]: {
            borderRadius: "8px",
        },
    },

    ticketsList: {
        flex: 1,
        maxHeight: "100%",
        overflowY: "scroll",
        ...theme.scrollbarStyles,
        "&::-webkit-scrollbar": {
            width: "8px",
        },
        "&::-webkit-scrollbar-track": {
            background: theme.mode === "light" ? "#f1f1f1" : "#2a2a2a",
            borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
            background: theme.mode === "light" ? "#888" : "#555",
            borderRadius: "4px",
            "&:hover": {
                background: theme.mode === "light" ? "#555" : "#777",
            },
        },
    },

    ticketsListHeader: {
        color: theme.mode === "light" ? "#1e1e1e" : "#ffffff",
        zIndex: 2,
        backgroundColor: theme.mode === "light" ? "#f8f9fa" : "#2a2a2a",
        borderBottom: `1px solid ${theme.mode === "light" ? "#e8e8e8" : "#404040"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        [theme.breakpoints.down("sm")]: {
            padding: "8px 12px",
        },
    },

    ticketsCount: {
        fontWeight: "600",
        color: theme.mode === "light" ? "#1e1e1e" : "#ffffff",
        marginLeft: "8px",
        fontSize: "15px",
        [theme.breakpoints.down("sm")]: {
            fontSize: "13px",
        },
    },

    noTicketsText: {
        textAlign: "center",
        color: theme.mode === "light" ? "#6c757d" : "#adb5bd",
        fontSize: "14px",
        lineHeight: "1.6",
        [theme.breakpoints.down("sm")]: {
            fontSize: "13px",
        },
    },

    noTicketsTitle: {
        textAlign: "center",
        fontSize: "18px",
        fontWeight: "700",
        margin: "0px",
        color: theme.mode === "light" ? "#1e1e1e" : "#ffffff",
        [theme.breakpoints.down("sm")]: {
            fontSize: "16px",
        },
    },

    noTicketsDiv: {
        display: "flex",
        margin: 40,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        [theme.breakpoints.down("sm")]: {
            margin: 20,
        },
    },
}));

const ticketSortAsc = (a, b) => {
    
    if (a.updatedAt < b.updatedAt) {
        return -1;
    }
    if (a.updatedAt > b.updatedAt) {
        return 1;
    }
    return 0;
}

const ticketSortDesc = (a, b) => {
   
    if (a.updatedAt > b.updatedAt) {
        return -1;
    }
    if (a.updatedAt < b.updatedAt) {
        return 1;
    }
    return 0;
}

const reducer = (state, action) => {
    //console.log("action", action, state)
    const sortDir = action.sortDir;
    
    if (action.type === "LOAD_TICKETS") {
        const newTickets = action.payload;

        newTickets.forEach((ticket) => {
            const ticketIndex = state.findIndex((t) => t.id === ticket.id);
            if (ticketIndex !== -1) {
                state[ticketIndex] = ticket;
                if (ticket.unreadMessages > 0) {
                    state.unshift(state.splice(ticketIndex, 1)[0]);
                }
            } else {
                state.push(ticket);
            }
        });
        if (sortDir && ['ASC', 'DESC'].includes(sortDir)) {
            sortDir === 'ASC' ? state.sort(ticketSortAsc) : state.sort(ticketSortDesc);
        }

        return [...state];
    }

    if (action.type === "RESET_UNREAD") {
        const ticketId = action.payload;

        const ticketIndex = state.findIndex((t) => t.id === ticketId);
        if (ticketIndex !== -1) {
            state[ticketIndex].unreadMessages = 0;
        }

        if (sortDir && ['ASC', 'DESC'].includes(sortDir)) {
            sortDir === 'ASC' ? state.sort(ticketSortAsc) : state.sort(ticketSortDesc);
        }

        return [...state];
    }

    if (action.type === "UPDATE_TICKET") {
        const ticket = action.payload;
        const status = action.status;

        const ticketIndex = state.findIndex((t) => t.id === ticket.id);
        if (ticketIndex !== -1) {
            const oldTicket = state[ticketIndex];
            const updatedAtChanged = new Date(oldTicket.updatedAt).getTime() !== new Date(ticket.updatedAt).getTime();
            
            state[ticketIndex] = ticket;
            
            // Para status "open", se o updatedAt mudou (ticket recebeu mensagem), move para o topo
            if (status === "open" && updatedAtChanged && sortDir === "DESC") {
                state.unshift(state.splice(ticketIndex, 1)[0]);
            }
        } else {
            state.unshift(ticket);
        }
        if (sortDir && ['ASC', 'DESC'].includes(sortDir)) {
            sortDir === 'ASC' ? state.sort(ticketSortAsc) : state.sort(ticketSortDesc);
        }

        return [...state];
    }

    if (action.type === "UPDATE_TICKET_UNREAD_MESSAGES") {
        const ticket = action.payload;

        const ticketIndex = state.findIndex((t) => t.id === ticket.id);
        if (ticketIndex !== -1) {
            state[ticketIndex] = ticket;
            state.unshift(state.splice(ticketIndex, 1)[0]);
        } else {
            if (action.status === action.payload.status) {
                state.unshift(ticket);
            }
        }
        if (sortDir && ['ASC', 'DESC'].includes(sortDir)) {
            sortDir === 'ASC' ? state.sort(ticketSortAsc) : state.sort(ticketSortDesc);
        }

        return [...state];
    }

    if (action.type === "UPDATE_TICKET_CONTACT") {
        const contact = action.payload;
        const ticketIndex = state.findIndex((t) => t.contactId === contact.id);
        if (ticketIndex !== -1) {
            state[ticketIndex].contact = contact;
        }
        return [...state];
    }

    if (action.type === "DELETE_TICKET") {
        const ticketId = action.payload;
        const ticketIndex = state.findIndex((t) => t.id === ticketId);
        if (ticketIndex !== -1) {
            state.splice(ticketIndex, 1);
        }

        if (sortDir && ['ASC', 'DESC'].includes(sortDir)) {
            sortDir === 'ASC' ? state.sort(ticketSortAsc) : state.sort(ticketSortDesc);
        }

        return [...state];
    }

    if (action.type === "RESET") {
        return [];
    }
};

const TicketsListCustom = (props) => {
    const {
        setTabOpen,
        status,
        searchParam,
        searchOnMessages,
        tags,
        users,
        showAll,
        selectedQueueIds,
        updateCount,
        style,
        whatsappIds,
        forceSearch,
        statusFilter,
        userFilter,
        sortTickets
    } = props;

    const classes = useStyles();
    const [pageNumber, setPageNumber] = useState(1);
    let [ticketsList, dispatch] = useReducer(reducer, []);
    //   const socketManager = useContext(SocketContext);
    const { user, socket } = useContext(AuthContext);

    const { profile, queues } = user;
    const showTicketWithoutQueue = user.allTicket === 'enable';
    const companyId = user.companyId;

    useEffect(() => {
        dispatch({ type: "RESET" });
        setPageNumber(1);
    }, [status, searchParam, dispatch, showAll, tags, users, forceSearch, selectedQueueIds, whatsappIds, statusFilter, sortTickets, searchOnMessages]);

    const { tickets, hasMore, loading } = useTickets({
        pageNumber,
        searchParam,
        status,
        showAll,
        searchOnMessages: searchOnMessages ? "true" : "false",
        tags: JSON.stringify(tags),
        users: JSON.stringify(users),
        queueIds: JSON.stringify(selectedQueueIds),
        whatsappIds: JSON.stringify(whatsappIds),
        statusFilter: JSON.stringify(statusFilter),
        userFilter,
        sortTickets
    });


    useEffect(() => {
        // const queueIds = queues.map((q) => q.id);
        // const filteredTickets = tickets.filter(
        //     (t) => queueIds.indexOf(t.queueId) > -1
        // );
        // const allticket = user.allTicket === 'enabled';
        // if (profile === "admin" || allTicket || allowGroup || allHistoric) {
        if (companyId) {
            dispatch({
                type: "LOAD_TICKETS",
                payload: tickets,
                status,
                sortDir: sortTickets
            });
        }
        // } else {
        //  dispatch({ type: "LOAD_TICKETS", payload: filteredTickets });
        // }

    }, [tickets]);

    useEffect(() => {
        const shouldUpdateTicket = ticket => {
            return (!ticket?.userId || ticket?.userId === user?.id || showAll) &&
                ((!ticket?.queueId && showTicketWithoutQueue) || selectedQueueIds.indexOf(ticket?.queueId) > -1)
            // (!blockNonDefaultConnections || (ticket.status == 'group' && ignoreUserConnectionForGroups) || !user?.whatsappId || ticket.whatsappId == user?.whatsappId);
        }
        // const shouldUpdateTicketUser = (ticket) =>
        //     selectedQueueIds.indexOf(ticket?.queueId) > -1 && (ticket?.userId === user?.id || !ticket?.userId);

        const notBelongsToUserQueues = (ticket) =>
            ticket.queueId && selectedQueueIds.indexOf(ticket.queueId) === -1;

        const onCompanyTicketTicketsList = (data) => {
            // console.log("onCompanyTicketTicketsList", data)
            if (data.action === "updateUnread") {
                dispatch({
                    type: "RESET_UNREAD",
                    payload: data.ticketId,
                    status: status,
                    sortDir: sortTickets
                });
            }
            // console.log(shouldUpdateTicket(data.ticket))
            if (data.action === "update" &&
                shouldUpdateTicket(data.ticket) && data.ticket.status === status) {
                dispatch({
                    type: "UPDATE_TICKET",
                    payload: data.ticket,
                    status: status,
                    sortDir: sortTickets
                });
            }

            // else if (data.action === "update" && shouldUpdateTicketUser(data.ticket) && data.ticket.status === status) {
            //     dispatch({
            //         type: "UPDATE_TICKET",
            //         payload: data.ticket,
            //     });
            // }
            if (data.action === "update" && notBelongsToUserQueues(data.ticket)) {
                dispatch({
                    type: "DELETE_TICKET", payload: data.ticket?.id, status: status,
                    sortDir: sortTickets
                });
            }

            if (data.action === "delete") {
                dispatch({
                    type: "DELETE_TICKET", payload: data?.ticketId, status: status,
                    sortDir: sortTickets
                });

            }
        };

        const onCompanyAppMessageTicketsList = (data) => {
            if (data.action === "create" &&
                shouldUpdateTicket(data.ticket) && data.ticket.status === status) {
                dispatch({
                    type: "UPDATE_TICKET_UNREAD_MESSAGES",
                    payload: data.ticket,
                    status: status,
                    sortDir: sortTickets
                });
            }
            // else if (data.action === "create" && shouldUpdateTicketUser(data.ticket) && data.ticket.status === status) {
            //     dispatch({
            //         type: "UPDATE_TICKET_UNREAD_MESSAGES",
            //         payload: data.ticket,
            //     });
            // }
        };

        const onCompanyContactTicketsList = (data) => {
            if (data.action === "update" && data.contact) {
                dispatch({
                    type: "UPDATE_TICKET_CONTACT",
                    payload: data.contact,
                    status: status,
                    sortDir: sortTickets
                });
            }
        };

        const onConnectTicketsList = () => {
            if (status) {
                socket.emit("joinTickets", status);
            } else {
                socket.emit("joinNotification");
            }
        }

        socket.on("connect", onConnectTicketsList)
        socket.on(`company-${companyId}-ticket`, onCompanyTicketTicketsList);
        socket.on(`company-${companyId}-appMessage`, onCompanyAppMessageTicketsList);
        socket.on(`company-${companyId}-contact`, onCompanyContactTicketsList);

        return () => {
            if (status) {
                socket.emit("leaveTickets", status);
            } else {
                socket.emit("leaveNotification");
            }
            socket.off("connect", onConnectTicketsList);
            socket.off(`company-${companyId}-ticket`, onCompanyTicketTicketsList);
            socket.off(`company-${companyId}-appMessage`, onCompanyAppMessageTicketsList);
            socket.off(`company-${companyId}-contact`, onCompanyContactTicketsList);
        };

    }, [status, showAll, user, selectedQueueIds, tags, users, profile, queues, sortTickets, showTicketWithoutQueue]);

    useEffect(() => {
        if (typeof updateCount === "function") {
            updateCount(ticketsList.length);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ticketsList]);

    const loadMore = () => {
        setPageNumber((prevState) => prevState + 1);
    };

    const handleScroll = (e) => {
        if (!hasMore || loading) return;

        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

        if (scrollHeight - (scrollTop + 100) < clientHeight) {
            loadMore();
        }
    };

    if (status && status !== "search") {
        ticketsList = ticketsList.filter(ticket => ticket.status === status)
    }

    return (
        <Paper className={classes.ticketsListWrapper} style={style}>
            <Paper
                square
                name="closed"
                elevation={0}
                className={classes.ticketsList}
                onScroll={handleScroll}
            >
                <List style={{ paddingTop: 0 }} >
                    {ticketsList.length === 0 && !loading ? (
                        <div className={classes.noTicketsDiv}>
                            <span className={classes.noTicketsTitle}>
                                {i18n.t("ticketsList.noTicketsTitle")}
                            </span>
                            <p className={classes.noTicketsText}>
                                {i18n.t("ticketsList.noTicketsMessage")}
                            </p>
                        </div>
                    ) : (
                        <>
                            {ticketsList.map((ticket) => (
                                // <List key={ticket.id}>
                                //     {console.log(ticket)}
                                <TicketListItem
                                    ticket={ticket}
                                    key={ticket.id}
                                    setTabOpen={setTabOpen}
                                />
                                // </List>
                            ))}
                        </>
                    )}
                    {loading && <TicketsListSkeleton />}
                </List>
            </Paper>
        </Paper>
    );
};

export default TicketsListCustom;
