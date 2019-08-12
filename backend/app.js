const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const postsRoutes = require('./models/routes/posts');

mongoose.connect('mongodb+srv://zak:Zc9T0p2g3aGwZLKQ@cluster0-ykygt.mongodb.net/mean-stack?retryWrites=true&w=majority', {     useNewUrlParser: true   })
    .then(() => {
        console.log('Connected to the Database');
    })
    .catch(() => {
        console.log('Connection failed!')
    });

app.use(bodyParser.json() );
app.use('/images', express.static(path.join('backend/images')));

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

app.use('/api/posts', postsRoutes);

module.exports = app;