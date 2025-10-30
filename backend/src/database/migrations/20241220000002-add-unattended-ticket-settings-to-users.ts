/**
 * Migration para adicionar configurações de notificação de tickets não atendidos
 * na tabela Users
 */
import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Users", "enableUnattendedTicketNotification", {
      type: DataTypes.STRING,
      defaultValue: "disabled",
      allowNull: false
    });

    await queryInterface.addColumn("Users", "unattendedTicketNotificationPhone", {
      type: DataTypes.STRING,
      allowNull: true
    });

    await queryInterface.addColumn("Users", "unattendedTicketTimeout", {
      type: DataTypes.INTEGER,
      defaultValue: 15,
      allowNull: false
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Users", "enableUnattendedTicketNotification");
    await queryInterface.removeColumn("Users", "unattendedTicketNotificationPhone");
    await queryInterface.removeColumn("Users", "unattendedTicketTimeout");
  }
};
