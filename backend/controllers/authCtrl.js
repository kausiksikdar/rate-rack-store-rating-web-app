const { User } = require('../models/associations');
const { validateUser, validateLogin } = require('../middleware/validation');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// register a new user
exports.register = async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
   
        if (req.body.name.length < 3) return res.status(400).json({ error: 'Name min 3 chars' });
        const { name, email, password, address, role } = req.body;
        
        const existing = await User.findOne({ where: { email } });
        if (existing) return res.status(400).json({ error: 'Email already taken' });
        
        const newUser = await User.create({ name, email, password, address, role });
        res.status(201).json({ msg: 'User created', userId: newUser.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// login user and return jwt token
exports.login = async (req, res) => {
    try {
        
        const { error } = validateLogin(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });
        const { email, password } = req.body;
        
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });
        
        const isMatch = await user.checkPassword(password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
};

// logout endpoint 
exports.logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

// allow authenticated user to change their password
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Both passwords required' });
        
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
        if (!passwordRegex.test(newPassword)) return res.status(400).json({ error: 'Password must be 8-16 chars, 1 uppercase, 1 special' });
       
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        const valid = await user.checkPassword(oldPassword);
        if (!valid) return res.status(401).json({ error: 'Old password incorrect' });
       
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Could not update password' });
    }
};