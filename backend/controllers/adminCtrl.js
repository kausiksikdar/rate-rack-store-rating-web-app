const { User, Store, Rating } = require('../models/associations');
const { validateUser } = require('../middleware/validation');
const { Op } = require('sequelize');

// get total counts for admin dashboard
exports.getStats = async (req, res) => {

    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
   
    res.json({ totalUsers, totalStores, totalRatings });
};

// admin can create a new user (any role)
exports.addNewUser = async (req, res) => {

    const { error } = validateUser(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    try {
       
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// list all stores (for admin view) with average rating
exports.listStores = async (req, res) => {
   
    const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
    const where = {};
   
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    
    const stores = await Store.findAll({ where, order: [[sortBy, order]], include: [{ model: Rating, attributes: ['rating'] }] });
    const result = [];
    
    for (let i = 0; i < stores.length; i++) {
        const store = stores[i];
        const ratings = store.Ratings;
        let sum = 0;
        for (let r = 0; r < ratings.length; r++) sum += ratings[r].rating;
        const avg = ratings.length ? (sum / ratings.length).toFixed(1) : 0;
        result.push({ id: store.id, name: store.name, email: store.email, address: store.address, rating: avg });
    }
    res.json(result);
};

// list all users (for admin view) with optional filters and sorting
exports.listUsers = async (req, res) => {
    
    const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;
    
    const users = await User.findAll({ where, order: [[sortBy, order]], attributes: { exclude: ['password'] } });
    const enriched = [];
    
    for (let i = 0; i < users.length; i++) {
        const u = users[i];
        const userObj = u.toJSON();
        if (userObj.role === 'store_owner' && userObj.store_id) {
            const store = await Store.findByPk(userObj.store_id, { include: [{ model: Rating }] });
            const ratings = store.Ratings;
            let sum = 0;
            for (let r = 0; r < ratings.length; r++) sum += ratings[r].rating;
            userObj.rating = ratings.length ? (sum / ratings.length).toFixed(1) : 0;
        } else userObj.rating = null;
        enriched.push(userObj);
    }
    res.json(enriched);
};

// get detailed information for a single user by id
exports.getUserById = async (req, res) => {
    
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
    if (!user) return res.status(404).json({ error: 'User not found' });
   
    let ownerRating = null;
    if (user.role === 'store_owner' && user.store_id) {
        const store = await Store.findByPk(user.store_id, { include: [{ model: Rating }] });
        const ratings = store.Ratings;
        let sum = 0;
        for (let r = 0; r < ratings.length; r++) sum += ratings[r].rating;
        ownerRating = ratings.length ? (sum / ratings.length).toFixed(1) : 0;
    }
    res.json({ ...user.toJSON(), rating: ownerRating });
};

// admin can add a new store and link it to an existing store owner
exports.addStore = async (req, res) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({ error: 'Name, email, and address are required' });
    }
    
    const store = await Store.create({ name, email, address, owner_id });

    if (owner_id) {
      await User.update({ store_id: store.id }, { where: { id: owner_id } });
    }
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};