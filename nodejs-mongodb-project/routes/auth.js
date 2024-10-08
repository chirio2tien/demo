const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).send('Email đã tồn tại');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ username, email, password: hashedPassword });
    try {
        await user.save();
        res.send('Người dùng đã đăng ký thành công');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).send('Tên người dùng hoặc mật khẩu không đúng');
    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).send('Mật khẩu không hợp lệ');
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.json({ token }); // Trả về token trong body
});

module.exports = router;