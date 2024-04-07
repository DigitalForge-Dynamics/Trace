import type { Migration } from "../config/databaseClient";
import { DataTypes } from "sequelize";

export const up: Migration = async ({ context: queryInterface }) => {
  const assets = queryInterface.createTable("assets", {
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
      allowNull: true,
    },
    nextAuditDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  const locations = queryInterface.createTable("locations", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    locationName: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    geoLocation: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    primaryLocation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  const settings = queryInterface.createTable("settings", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    category: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    categoryData: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });

  const users = queryInterface.createTable("users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    scopes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });
  await Promise.all([
    assets, locations, settings, users,
  ]);
};

export const down: Migration = async ({ context: queryInterface }) => {
  await Promise.all([
    queryInterface.dropTable("assets"),
    queryInterface.dropTable("locations"),
    queryInterface.dropTable("settings"),
    queryInterface.dropTable("users"),
  ]);
};
