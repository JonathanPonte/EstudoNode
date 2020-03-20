//pegar conexão do banco de dados 
const mongoose = require('../../database');
//serve para criptografia
const bcrypt = require('bcryptjs')

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        require: true,
    },
    assignedTo: {
        //forma que o mongo guarda um objeto no banco
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    completed: {
        type: Boolean,
        require: true,
        default: false
    },
    cratedAt: {
        type: Date,
        default: Date.now,
    }
});


const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
