const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name là bắt buộc'],
        minlength: [3, 'Name phải có ít nhất 3 ký tự']
    },
    age: {
        type: Number,
        required: [true, 'Age là bắt buộc'],
        min: [18, 'Age phải lớn hơn hoặc bằng 18'],
        max: [100, 'Age phải nhỏ hơn hoặc bằng 100']
    },
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        unique: true,
        match: [/.+\@.+\..+/, 'Email không hợp lệ']
    }
});

module.exports = mongoose.model('Student', studentSchema);