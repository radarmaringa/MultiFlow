/**
 * Job para verificar e notificar sobre tickets não atendidos
 * Executa a cada 5 minutos para verificar tickets aguardando atendimento
 */
import { CronJob } from "cron";
import { Op } from "sequelize";
import logger from "../utils/logger";
import User from "../models/User";
import Ticket from "../models/Ticket";
import Queue from "../models/Queue";
import Contact from "../models/Contact";
import Whatsapp from "../models/Whatsapp";
import CompaniesSettings from "../models/CompaniesSettings";
import Company from "../models/Company";
import { SendMessage } from "../helpers/SendMessage";
import { format } from "date-fns";

export const startUnattendedTicketJob = () => {
  const unattendedJob = new CronJob(
    "0 */5 * * * *", // A cada 5 minutos
    async () => {
      try {
        await checkUnattendedTickets();
      } catch (error) {
        logger.error("❌ Error in unattended ticket check:", error);
      }
    },
    null,
    true,
    "America/Sao_Paulo"
  );
  
  logger.info("🔔 Unattended ticket notification job initialized - will run every 5 minutes");
  return unattendedJob;
};

const checkUnattendedTickets = async () => {
  try {
    // Buscar empresas com notificação habilitada
    const companies = await CompaniesSettings.findAll({
      where: {
        enableUnattendedTicketNotification: "enabled"
      },
      include: [
        {
          model: Company,
          as: "company",
          where: { status: true }
        }
      ]
    });

    logger.info(`🔍 Checking unattended tickets for ${companies.length} companies`);

    for (const companySettings of companies) {
      const companyId = companySettings.companyId;
      const timeoutMinutes = companySettings.unattendedTicketTimeoutMinutes || 15;
      const cutoffTime = new Date(Date.now() - timeoutMinutes * 60 * 1000);
      
      // Buscar usuários com notificação habilitada nesta empresa
      const users = await User.findAll({
        where: {
          companyId,
          enableUnattendedTicketNotification: "enabled",
          unattendedTicketNotificationPhone: { [Op.ne]: null }
        },
        include: [
          {
            model: Queue,
            as: "queues",
            attributes: ["id", "name"]
          }
        ]
      });

      logger.info(`👥 Found ${users.length} users with notifications enabled in company ${companyId}`);

      for (const user of users) {
        const queueIds = user.queues.map(queue => queue.id);
        
        if (queueIds.length === 0) {
          logger.info(`⚠️ User ${user.name} has no queues assigned, skipping`);
          continue;
        }
        
        const unattendedTickets = await Ticket.findAll({
          where: {
            companyId,
            queueId: { [Op.in]: queueIds },
            status: "pending",
            userId: null, // sem atendente atribuído
            createdAt: { [Op.lt]: cutoffTime },
            unattendedNotificationSent: false // flag para evitar duplicatas
          },
          include: [
            { model: Queue, as: "queue", attributes: ["id", "name"] },
            { model: Contact, as: "contact", attributes: ["id", "name", "number"] }
          ]
        });

        if (unattendedTickets.length > 0) {
          logger.info(`🚨 Found ${unattendedTickets.length} unattended tickets for user ${user.name}`);
          await sendUnattendedTicketNotification(user, unattendedTickets, companySettings);
        }
      }
    }
  } catch (error) {
    logger.error("❌ Error in checkUnattendedTickets:", error);
  }
};

const sendUnattendedTicketNotification = async (
  user: User, 
  tickets: Ticket[], 
  companySettings: CompaniesSettings
) => {
  const phone = user.unattendedTicketNotificationPhone;
  const timeoutMinutes = companySettings.unattendedTicketTimeoutMinutes || 15;
  
  // Usar mensagem personalizada da empresa ou padrão
  const customMessage = companySettings.unattendedTicketNotificationMessage;
  const defaultMessage = `🚨 *ALERTA DE ATENDIMENTO*\n\n` +
    `Olá ${user.name}! Há ${tickets.length} ticket(s) aguardando atendimento há mais de ${timeoutMinutes} minutos nas suas filas:\n\n` +
    tickets.map(ticket => 
      `• Ticket #${ticket.id} - ${ticket.contact.name} (${ticket.contact.number})\n` +
      `  Fila: ${ticket.queue?.name || 'Sem fila'}\n` +
      `  Aguardando desde: ${format(ticket.createdAt, 'dd/MM/yyyy HH:mm')}`
    ).join('\n\n') +
    `\n\nPor favor, verifique o sistema de atendimento.`;

  const message = customMessage || defaultMessage;

  // Buscar WhatsApp padrão da empresa
  const whatsapp = await Whatsapp.findOne({
    where: { 
      companyId: user.companyId, 
      isDefault: true,
      status: "CONNECTED"
    }
  });

  if (whatsapp && phone) {
    try {
      await SendMessage(whatsapp, {
        number: phone,
        body: message,
        companyId: user.companyId
      });

      // Marcar tickets como notificados
      await Ticket.update(
        { unattendedNotificationSent: true },
        { where: { id: tickets.map(t => t.id) } }
      );

      logger.info(`📱 Notification sent to ${user.name} (${phone}) about ${tickets.length} unattended tickets`);
    } catch (error) {
      logger.error(`❌ Error sending notification to ${user.name}: ${error.message}`);
    }
  } else {
    logger.warn(`⚠️ No WhatsApp connection found for company ${user.companyId} or no phone for user ${user.name}`);
  }
};

export default startUnattendedTicketJob;
