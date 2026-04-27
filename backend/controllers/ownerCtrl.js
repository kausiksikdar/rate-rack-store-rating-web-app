const { User, Rating, Store } = require('../models/associations');

// get dashboard data for store owners
exports.getOwnerDashboard = async (req, res) => {
    
    const stores = await Store.findAll({
        where: { owner_id: req.user.id },
        include: [{ model: Rating, include: [{ model: User, attributes: ['id', 'name'] }] }]
    });

    
    if (!stores.length) {
        return res.status(404).json({ error: 'You do not own any stores yet.' });
    }

    
    const result = stores.map(store => {
        const ratings = store.Ratings;

        
        const userMap = new Map(); 
        for (const r of ratings) {
            if (!userMap.has(r.user_id)) {
                userMap.set(r.user_id, {
                    sum: 0,
                    count: 0,
                    name: r.User.name
                });
            }
            const entry = userMap.get(r.user_id);
            entry.sum += r.rating;
            entry.count++;
        }

        
        const usersList = Array.from(userMap.values()).map(entry => ({
            name: entry.name,
            rating: (entry.sum / entry.count).toFixed(1)  
        }));

        
        let totalSum = 0;
        for (const r of ratings) totalSum += r.rating;
        const averageRating = ratings.length ? (totalSum / ratings.length).toFixed(1) : 0;

        
        return {
            id: store.id,
            name: store.name,
            address: store.address,
            averageRating,
            users: usersList
        };
    });

    res.json(result);
};