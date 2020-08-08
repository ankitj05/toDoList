const express = require('express');
const dotenv = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const TodoTask = require('./models/toDoTask');

// read the .env file and pass it to process.env as object.
dotenv.config();

// used to serve the static pages present in the folder - public
app.use('/static', express.static('public'));

// middleware to recognize incoming request object as strings or arrays.
// to recognize JSON object, use express.json()
app.use(express.urlencoded({ extended: true }));

// template engine to populate html pages with dynamic content that is served on the go.
app.set('view engine', 'ejs');

// connect with mongodb.
mongoose.set('useFindAndModify', false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log(`connected to db`);
    app.listen(3000, () => console.log('Server Up and running'));
});

// GET METHOD
app.get('/', (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render('todo.ejs', { todoTasks: tasks });
    });
});

//READ
app.post('/', async (req, res) => {
    console.log(req.body);

    const todoTask = new TodoTask({
        content: req.body.content,
    });

    try {
        await todoTask.save();
        res.redirect('/');
    } catch (err) {
        res.redirect('/');
    }
});

//UPDATE
app.route('/edit/:id')
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render('todoEdit.ejs', { todoTasks: tasks, idTask: id });
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
app.route('/remove/:id').get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, (err) => {
        if (err) return res.send(500, err);
        res.redirect('/');
    });
});
