const express = require('express')
const router = express.Router();
const TodoTask = require('../models/toDoTask');


// GET METHOD
router.get('/', checkAuthenticate, (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render('todo.ejs', { todoTasks: tasks, name: req.user.firstName, id: String(req.user._id) });
    });
});

//READ
router.post('/', async (req, res) => {
    console.log(req.body);

    const todoTask = new TodoTask({
        content: req.body.content,
        id: String(req.user._id)
    });

    try {
        await todoTask.save();
        res.redirect('/');
    } catch (err) {
        res.redirect('/');
    }
});

//UPDATE
router.route('/edit/:id')
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render('../views/todoEdit.ejs', { todoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, (err) => {
            if (err) return res.send(500, err);
            res.redirect('/');
        });
    });

//DELETE
router.route('/remove/:id').get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, (err) => {
        if (err) return res.send(500, err);
        res.redirect('/');
    });
});

function checkAuthenticate(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login');
}

module.exports = router;