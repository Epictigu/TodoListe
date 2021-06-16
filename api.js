
let mysql = require('mysql');
let con = mysql.createConnection({
    host: 'epicclan.eu',
    user: 'todojs',
    password: 'redma123',
    database: 'todojs',
    port: 3306
});;

module.exports = {
    init: () => {
        con.connect(function(err){
            if(err) throw err;
            console.log("Connected!");
        });

        return con;
    },

    getTodos: (req, res) => {
        var sql = "SELECT * FROM Todo";
        con.query(sql, function(err, results){
            if(err) {
                console.log("error: " + err);
                res.status(500).send(err);
            }
            console.log(results);
            res.send(results);
        });
    },

    addTodo: (req, res) => {
        var sql = "INSERT INTO Todo (Title, Due, Status) "
         + "VALUES('" + req.body.Title + "', '" + req.body.Due + "', '" + req.body.Status + "')";
        con.query(sql, function(err, results){
            if(err){
                console.log("error: " + err);
                res.status(500).send(err);
            }
            res.send(results);
        });
    },

    deleteTodo: (req, res) => {
        let id = req.params.id;
        var sql = "DELETE FROM Todo WHERE ID='" + id + "'";
        console.log(sql);
        con.query(sql, function(err, results){
            if(err){
                console.log("error: " + err);
                res.status(500).send(err);
            }
            res.send(results);
        });
    },

    editTodo: (req, res) => {
        let id = req.params.id;

        var date = req.body.Due.split("T");
        var time = date[1].split(":")

        var sql = "UPDATE Todo SET Title='"
            + req.body.Title + "', Due='" + date[0] + "T" + time[0] + ":" + time[1]
            + "', Status='" + req.body.Status + "' WHERE ID=" + id;
        con.query(sql, function(err, results){
            if(err){
                console.log("error: " + err);
                res.status(500).send(err);
            }
            console.log(req.body);
            res.send(results);
        });
    }

    
}