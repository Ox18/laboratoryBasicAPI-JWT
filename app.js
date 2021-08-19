// make api with express
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        name: 'John Doe',
        email: 'jhon@gmail.com',
        password: '123456'
    };

    jwt.sign( { user: user }, 'secretkey', {  expiresIn: '32s' }, (err, token)=>{
        res.json({
            token: token
        })
    });

});


// Authorization: Bearer <token>
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
}

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, decoded) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                mensaje: 'Post guardado correctamente',
                authData: decoded
            })
        }
    })
});


app.listen(3000, () => {
    console.log('Listening on port 3000');
})