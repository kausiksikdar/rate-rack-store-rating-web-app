const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Rating = sequelize.define('Rating', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    user_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    store_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
    },
    rating: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        validate: { min: 1, max: 5 } 
    },
}, { timestamps: true });

module.exports = Rating;