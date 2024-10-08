const express = require('express');
const Student = require('../models/student');
const authenticateJWT = require('../middleware/authenticateJWT');
const { faker } = require('@faker-js/faker'); // Sử dụng @faker-js/faker

const router = express.Router();

router.post('/', authenticateJWT, async (req, res) => {
    const student = new Student(req.body);
    try {
        await student.save();
        res.send('Sinh viên đã được thêm thành công');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post('/seed', async (req, res) => {
    for (let i = 0; i < 10; i++) {
        const student = new Student({
            name: faker.person.fullName(), // Sử dụng faker.person.fullName()
            age: faker.number.int({ min: 18, max: 100 }), // Sử dụng faker.number.int
            email: faker.internet.email()
        });
        await student.save();
    }
    res.send('Dữ liệu đã được seed');
});

router.get('/', authenticateJWT, async (req, res) => {
    const { page = 1, limit = 10, name } = req.query;
    const query = name ? { name: new RegExp(name, 'i') } : {};
    const students = await Student.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
    const count = await Student.countDocuments(query);
    res.json({
        students,
        totalPages: Math.ceil(count / limit),
        currentPage: page
    });
});

router.get('/all', authenticateJWT, async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
router.get('/:id', authenticateJWT, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) throw new Error('Không tìm thấy sinh viên');
        res.json(student);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

router.put('/:id', authenticateJWT, async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) throw new Error('Không tìm thấy sinh viên');
        res.json(student);
    } catch (err) {
        res.status(404).send(err.message);
    }
});

module.exports = router;