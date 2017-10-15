const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const rtAPIv1 = express.Router();
let users = [
    {
        id: '1',
        name: 'Vasya',
        score: '10'
    },
    {
        id: '2',
        name: 'Petya',
        score: '15'
    }
]

function handleBadRequest(res)
{
    res.writeHead(400, 'Bad Request');
    res.write('Bad Request');
    res.end();    
}

rtAPIv1.get("/users/", function(req, res) {
    res.writeHead(200, 'OK', {'Content-Type': 'text/html;charset=utf-8'})
    res.write(JSON.stringify(users));
    res.end();
});

rtAPIv1.get("/users/:id", function(req, res) {
    if (users.find(user => user.id === req.params.id))
    {
        res.writeHead(200,'OK', {'Content-Type': 'text/html;charset=utf-8'});
        res.write(JSON.stringify(users.find(user => user.id == req.params.id)))
        res.end()        
    }
    else
    {
        handleBadRequest(res);
    }

    
});

rtAPIv1.post("/users/", function(req, res) {
    if ((req.query.name) && (req.query.score))
    {
        let newUser = {
            id: parseInt(users[users.length - 1].id) + 1,
            name: req.query.name,
            score: req.query.score
        } 
        users.push(newUser)
        res.writeHead(200, 'OK', {'Content-Type': 'text/html;charset=utf-8'})
        res.write(`Пользователь ID: ${newUser.id} создан`)
        res.end()
    }
    else
    {
        handleBadRequest(res);
    }
});

rtAPIv1.put("/users/:id", function(req, res) {
    let userEdit = users.find(user => user.id === req.params.id)
    console.log(users.find(user => user.id === req.params.id))
    if (userEdit)
    {
        if (req.query.name)
        {
            userEdit.name = req.query.name
        }
        if (req.query.score)
        {
            userEdit.score = req.query.score
        }
        res.writeHead(200, 'OK', {'Content-Type': 'text/html;charset=utf-8'})
        res.write(`Данные пользователя ID: ${req.params.id} обновлены`)
        res.end()
    }
    else
    {
        handleBadRequest(res)
    }
});

rtAPIv1.delete("/users/:id", function(req, res) {
    let userDelete = users.find(user => user.id === req.params.id)
    if (userDelete)
    {
        users.splice(users.indexOf(userDelete), 1)
        res.end()
    }
    else
    {
        handleBadRequest(res);
    }
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended": true}));
app.use("/api/v1", rtAPIv1);
app.use(function(err, req, res, next) {
    console.error(err.stack);   
    res.status(500).send('Something broke!');
});
app.listen(3000)