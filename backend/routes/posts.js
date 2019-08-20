const express = require('express');
const Post = require('../models/post');
const multer = require('multer');

const router = express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, 'backend/images')
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
        //console.log(ext)
    }
});

// create
router.post('', multer({ storage: storage }).single('image'), (req, res, use) => {
    const url = req.protocol + '://' + req.get('host')
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename
    });
    post.save().then(createdPost => {
       res.status('201').json({
           message: 'post added successfully!',
           post: {
               ...createdPost,
               id: createdPost._id
               //imagePath: createdPost.imagePath,
           }
       });
    });
});

// update 
router.put('/:id', multer({ storage: storage }).single('image'), (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = `${req.protocol}://${req.get('host')}`;
        imagePath = `${url}/images/${req.file.filename}`
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: `${req.body.content} (edited)`,
        imagePath: imagePath
    });
    //console.log(post);
    Post.updateOne({ _id: req.params.id }, post)
        .then(result => {
            console.log(result)
            res.status(200).json({ message: 'Updated Successfully!' });
        });
});

// get
router.get('' ,(req, res, next) => {
   const pageSize = +req.query.pagesize;
   const currentPage = +req.query.page;
   const pageQuery = Post.find();
   let fetchedPosts;
   if (currentPage && pageSize) {
      pageQuery
         .skip(pageSize * (currentPage - 1))
         .limit(pageSize);
   }
   pageQuery
      .then(documents => {
         fetchedPosts = documents
         return Post.count()
      })
      .then(count => {
         res.status(200).json({
            message: "Post fetched successfully!",
            posts: fetchedPosts,
            maxPosts:  count
         })
      });
})

router.get('/:id', (req, res, next) => {
   Post.findById(req.params.id).then(post => {
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