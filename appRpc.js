const app = require('express')();
const bodyParser = require('body-parser');

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

class RPC {  
    getAll(params, callback) 
    {
        callback(null, users)
    }
  
    getUser(params, callback) 
    {
        params = JSON.parse(params)
        let user = users.find(user => user.id === params.id);
            
        if (user)
        {
            callback(null, user)
        }
        else
        {
            callback('Bad Request') 
        }
    }
    addUser(params, callback) {
        params = JSON.parse(params);
        if (params.name && params.score)
        {
            let user = {
                id: parseInt(users[users.length - 1].id) + 1,
                name: params.name,
                score: params.score
            }
            users.push(user);
            callback(null, `Юзернейм с ID ${user.id} добавлен`)
        }
        else
        {
            callback('Bad Request') 
        }
    }  
    update(params, callback) {
        params = JSON.parse(params);
        let user = users.find(user => user.id === params.id);
        if (user)
        {
            user.name = params.name;
            user.score = params.score;
            callback(null, `Данные юзернейма ID ${user.id} обновлены`)
        }
        else {
            callback('Bad Request') 
        }
    }
  
    delete(params, callback) {
        params = JSON.parse(params);
        let user = users.find(user => user.id === params.id);
        if (user)
        {
            users.splice(users.indexOf(user), 1)
            callback(null, `Юзернейм с ID ${user.id} удален`)
        }
        else
        {
            callback('Bad Request') 
        }
        
    }
}

const rpcVersion = '2.0';
const rpc = new RPC();

const error = (res, id, err, code) => {
  res.status(400).json({
    jsonrpc: rpcVersion,
    error: err,
    id: id
  });
};

app.use(bodyParser.json());
app.post('/rpc', (req, res) => {
  let rpcMethod = rpc[req.query.method];
  
  if (!rpcMethod) {
    return error(res, req.body.id, 'Method not found');
  }
  
  rpcMethod(req.query.params, (err, result) => {
    if (err) {
      return error(res, req.query.id, err);
    }
    
    res.json({
      jsonrpc: rpcVersion,
      result: result,
      id: req.query.id
    });
  });
});

app.listen(3000)