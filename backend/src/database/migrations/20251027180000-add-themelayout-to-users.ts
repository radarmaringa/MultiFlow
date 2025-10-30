import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const tableDescription: any = await queryInterface.describeTable("Users");
    
    if (!tableDescription.themeLayout) {
      await queryInterface.addColumn("Users", "themeLayout", {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "classic"
      });
      console.log('Coluna themeLayout adicionada à tabela Users');
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const tableDescription: any = await queryInterface.describeTable("Users");
    
    if (tableDescription.themeLayout) {
      await queryInterface.removeColumn("Users", "themeLayout");
      console.log('Coluna themeLayout removida da tabela Users');
    }
  }
};

