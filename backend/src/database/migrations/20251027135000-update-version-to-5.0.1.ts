import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // Atualiza a versão do frontend para 5.0.1
    await queryInterface.sequelize.query(`
      UPDATE "Versions"
      SET "versionFrontend" = '5.0.1',
          "updatedAt" = NOW()
      WHERE id = 1;
    `);
  },

  down: async (queryInterface: QueryInterface) => {
    // Reverte para a versão anterior
    await queryInterface.sequelize.query(`
      UPDATE "Versions"
      SET "versionFrontend" = '5.0.0',
          "updatedAt" = NOW()
      WHERE id = 1;
    `);
  }
};

