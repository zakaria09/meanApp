const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json() );

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
    'Access-Control-Allow-Headers', 
    'Origin, X-Request-With, Content-Type, Accept'
    );
    res.setHeader(
    'Access-Control-Allow-Methods', 
    'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
})

app.post('/api/posts', (req, res, use) => {
     const post = req.body;
     console.log(post);
     res.status('201').json({
         message: 'post added successfully!'
     });
});

app.get('/api/posts' ,(req, res, next) => {
    const posts = [
        { 
            id: 'ewfd4334dd', 
            title: 'first server side post', 
            content: 'This is coming from the server!' 
        }, 
        { 
            id: 'ew5g45g6huj', 
            title: 'Second server side post', 
            content: 'This is another great post' 
        }
    ]
    res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: posts 
    })
    res.json();
});

module.exports = app