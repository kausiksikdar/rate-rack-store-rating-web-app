const { Store, Rating } = require('../models/associations');
const { Op } = require('sequelize');
const { validateRating } = require('../middleware/validation');

// get all stores for normal user, overall rating, user's own average rating
exports.getStoresForUser = async (req, res) => {
    const { searchName, searchAddress, sortBy = 'name', order = 'ASC' } = req.query;
    const where = {};
    if (searchName) where.name = { [Op.iLike]: `%${searchName}%` };
    if (searchAddress) where.address = { [Op.iLike]: `%${searchAddress}%` };

    
    const stores = await Store.findAll({
        where,
        order: [[sortBy, order]],
        include: [{ model: Rating }]
    });

   
    const myRatings = await Rating.findAll({
        where: { user_id: req.user.id },
        attributes: ['store_id', 'rating']
    });

    
    const userAvgMap = {};         
    const userSumCount = {};        
    for (const r of myRatings) {
        if (!userSumCount[r.store_id]) {
            userSumCount[r.store_id] = { sum: 0, count: 0 };
        }
        userSumCount[r.store_id].sum += r.rating;
        userSumCount[r.store_id].count++;
    }
    for (const storeId in userSumCount) {
        const { sum, count } = userSumCount[storeId];
        userAvgMap[storeId] = (sum / count).toFixed(1);
    }

    
    const result = [];
    for (const store of stores) {
        const allRatings = store.Ratings;
        let totalSum = 0;
        for (const r of allRatings) totalSum += r.rating;
        const overall = allRatings.length ? (totalSum / allRatings.length).toFixed(1) : 0;
        const userRating = userAvgMap[store.id] || null;

        result.push({
            id: store.id,
            name: store.name,
            address: store.address,
            overallRating: overall,
            userRating: userRating
        });
    }
    res.json(result);
};

// submit or update a rating
exports.submitOrUpdateRating = async (req, res) => {
    const { error } = validateRating(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const { storeId, rating } = req.body;
    
    const record = await Rating.create({
        user_id: req.user.id,
        store_id: storeId,
        rating,
    });
    res.json({ message: 'Rating submitted', rating: record.rating });
};