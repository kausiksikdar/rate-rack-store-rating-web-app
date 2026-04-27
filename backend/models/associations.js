const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

User.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });
Store.hasMany(Rating, { foreignKey: 'store_id' });
Rating.belongsTo(Store, { foreignKey: 'store_id' });
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });
User.belongsTo(Store, { foreignKey: 'store_id' });

module.exports = { User, Store, Rating };