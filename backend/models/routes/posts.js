const express = require('express');
const Post = require('../../models/post');

const router = express.Router();

// create
router.post('', (req, res, use) => {
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
router.put('/:id', (req, res, next) => {
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
router.get('' ,(req, res, next) => {
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

router.get('/:id', (req, res, next) => {
   Post.findById(req.params.id).then(post => {
       console.log(post)
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
router.delete('/:id', (req, res, next) => {
   Post.deleteOne({ _id: req.params.id })
       .then(result => console.log(result))
       .catch(error => console.log(error))
   res.status(200).json({ message: 'Post Deleted!' });
});

module.exports = router; 