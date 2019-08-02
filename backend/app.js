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
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
})

// Zc9T0p2g3aGwZLKQ

// create
app.post('/api/posts', (req, res, use) => {
     const post = new Post({
         title: req.body.title,
         content: req.body.content
     });
     post.save().then(createdPost => {
        res.status('201').json({
            message: 'post added successfully!',
            postId: createdPost._id
        });
     });
});

// update 
app.put('/api/posts/:id', (req, res, next) => {
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: `${req.body.content} (edited)`
    });
    Post.updateOne({ _id: req.params.id }, post)
        .then(result => {
            console.log(result)
            res.status(200).json({ message: 'Updated Successfully!' });
        });
});

// get
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

app.get('api/posts/:id', (req, res, next) => {
    Posts.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            console.log('not found')
            res.status(404).json({ message: 'Post not found' });
        }
    })
});

// api/posts/someid
// delete
app.delete('/api/posts/:id', (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
        .then(result => console.log(result))
        .catch(error => console.log(error))
    res.status(200).json({ message: 'Post Deleted!' });
});

module.exports = app