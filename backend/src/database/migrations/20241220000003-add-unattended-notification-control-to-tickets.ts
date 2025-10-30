/**
 * Migration para adicionar campo de controle de notificação
 * na tabela Tickets
 */
import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Tickets", "unattendedNotificationSent", {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Tickets", "unattendedNotificationSent");
  }
};
