import { Migration } from "../config/databaseClient";
import { DataTypes } from "sequelize";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable('assets', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    assetTag: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    serialNumber: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    modelNumber: {
      type: DataTypes.STRING(128),
      allowNull: true
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    purchaseCost: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nextAuditDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  })
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable('assets');
};