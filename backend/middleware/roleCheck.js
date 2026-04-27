const allowRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'unauthorized' });
        if (roles.includes(req.user.role)) next();
        else res.status(403).json({ error: 'forbidden' });
    };
};
module.exports = allowRoles;