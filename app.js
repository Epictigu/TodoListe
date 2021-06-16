
const api = require("./api.js");

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors());
app.use(express.json());  // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

function start(){
    api.init();
    app.get('/api/todos', api.getTodos);
    app.post('/api/todos', api.addTodo);

    app.delete('/api/todos/:id', api.deleteTodo);
    app.put('/api/todos/:id', api.editTodo);

    app.listen(port);
    console.log("Listening on port: " + port);
}

start();
