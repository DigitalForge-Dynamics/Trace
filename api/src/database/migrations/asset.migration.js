import Sequelize from 'sequelize';

async function up({ context: queryInterface }) {
  await queryInterface.createTable('assets', {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    assetTag: {
      type: Sequelize.STRING(128),
      allowNull: true,
    },
    name: {
      type: Sequelize.STRING(128),
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    }
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable('assets');
}

export { up, down };