const express = require('express');
const authmiddleware = require('../middlewares/auth');

const Project = require('../models/project');
const Task = require('../models/task');

const router = express.Router();

router.use(authmiddleware);

//listar
router.get('/', async (req, res) => {
    try {
        //                                    popular a variavel user, para vir os dados respectivos do usuario
        const projects = await Project.find().populate(['user', 'tasks']);

        res.send({ projects });
    } catch (error) {
        return res.status(400).send({ error: 'Error loading projects' });
    }
});

//pegar por id
router.get('/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);

        return res.send({ project });
    } catch (error) {
        
        return res.status(400).send({ error: 'Error loading project' });
    }
});

//criar
router.post('/', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;

        //                                                  colocar o relacionamento de usuario e projeto
        const project = await Project.create({ title, description, user: req.userId });

        // await Promise.all serve para aguardar todas as promises terminarem e somente apos isso continuar o codigo;
        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: Project._id });

            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({ project });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error creating new project' });
    }
});

//atualizar
router.put('/:projectId', async (req, res) => {
    try {
        const { title, description, tasks } = req.body;

        //                                                  colocar o relacionamento de usuario e projeto
        const project = await Project.findByIdAndUpdate(req.params.projectId,{ 
            title, 
            description, 
        }, { new: true});

        project.tasks = [];
        await Task.remove({ project: project._id });

        // await Promise.all serve para aguardar todas as promises terminarem e somente apos isso continuar o codigo;
        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: Project._id });

            await projectTask.save();

            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({ project });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error creating new project' });
    }
});

//delete
router.delete('/:projectId', async (req, res) => {
    try {
        const project = await Project.findByIdAndRemove(req.params.projectId);

        return res.send();
    } catch (error) {
        return res.status(400).send({ error: 'Error deleting project' });
    }
});

module.exports = app => app.use('/projects', router);
