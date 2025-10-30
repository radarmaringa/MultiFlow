import { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(`
      UPDATE "Versions"
      SET "versionFrontend" = '5.2.2',
          "updatedAt" = NOW()
      WHERE id = 1;
    `);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.sequelize.query(`
      UPDATE "Versions"
      SET "versionFrontend" = '5.1.1',
          "updatedAt" = NOW()
      WHERE id = 1;
    `);
  }
};

