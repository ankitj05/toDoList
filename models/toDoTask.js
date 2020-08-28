// Model for ToDo Document

const mongoose = require('mongoose');
const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    id: String
});

module.exports = mongoose.model('TodoTask', todoTaskSchema);
