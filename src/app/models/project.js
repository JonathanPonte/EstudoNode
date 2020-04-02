//pegar conexão do banco de dados 
const mongoose = require('../../database');
//serve para criptografia
const bcrypt = require('bcryptjs')

const ProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true
    },
    user: {
        //forma que o mongo guarda um objeto no banco
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    }],
    cratedAt: {
        type: Date,
        default: Date.now,
    }
});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
