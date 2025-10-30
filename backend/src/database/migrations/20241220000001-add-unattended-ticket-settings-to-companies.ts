/**
 * Migration para adicionar configurações de notificação de tickets não atendidos
 * na tabela CompaniesSettings
 */
import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("CompaniesSettings", "enableUnattendedTicketNotification", {
      type: DataTypes.STRING,
      defaultValue: "disabled",
      allowNull: false
    });

    await queryInterface.addColumn("CompaniesSettings", "unattendedTicketTimeoutMinutes", {
      type: DataTypes.INTEGER,
      defaultValue: 15,
      allowNull: false
    });

    await queryInterface.addColumn("CompaniesSettings", "unattendedTicketNotificationMessage", {
      type: DataTypes.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("CompaniesSettings", "enableUnattendedTicketNotification");
    await queryInterface.removeColumn("CompaniesSettings", "unattendedTicketTimeoutMinutes");
    await queryInterface.removeColumn("CompaniesSettings", "unattendedTicketNotificationMessage");
  }
};
