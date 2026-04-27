const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Store = sequelize.define('Store', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true 
    },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    address: { 
        type: DataTypes.STRING(400), 
        allowNull: false 
    },
    owner_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true 
    },
}, { timestamps: true });

module.exports = Store;