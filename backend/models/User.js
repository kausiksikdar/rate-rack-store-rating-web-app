const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    name: { 
        type: DataTypes.STRING(60), 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        unique: true, 
        allowNull: false 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    address: { 
        type: DataTypes.STRING(400), 
        allowNull: true 
    },
    role: { 
        type: DataTypes.ENUM('admin', 'user', 'store_owner'), 
        allowNull: false 
    },
    store_id: { 
        type: DataTypes.INTEGER, 
        allowNull: true 
    },
}, { timestamps: true });

User.beforeCreate(async (user) => {
    if (user.password) user.password = await bcrypt.hash(user.password, 10);
});

User.prototype.checkPassword = async function(plainPassword) {
    return bcrypt.compare(plainPassword, this.password);
};

module.exports = User;