const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const app = express();
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://zak:Zc9T0p2g3aGwZLKQ@cluster0-ykygt.mongodb.net/mean-stack?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to the Database');
    })
    .catch(() => {
        console.log('Connection failed!')
    });

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
// Zc9T0p2g3aGwZLKQ
app.post('/api/posts', (req, res, use) => {
     const post = new Post({
         title: req.body.title,
         content: req.body.content
     });
     post.save();
     res.status('201').json({
         message: 'post added successfully!'
     });
});

app.get('/api/posts' ,(req, res, next) => {
    Post.find()
        .then(documents => {
            console.log(documents)
            res.status(200).json({
                message: 'Posts fetched successfully!',
                posts: documents 
            })
        })
        .catch(error => {
            console.log(error);
        });
});

module.exports = app