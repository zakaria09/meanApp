const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    res.status(201)
                        .json({
                            message: 'Account Has Been Created Successfully!',
                            result: result
                        });
                })
                .catch(error => {
                    res.status(500)
                        .json({
                            message: 'Error: Account was not created',
                            error: error
                        });
                });
        });
});

router.post('/signin', (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
              return res.status(401)
                  .json({ message: 'Login failed! No User found.' })
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, fetchedUser.password)
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Login failed line 48!'
                })
            }
            const token = jwt.sign({
                userId: fetchedUser._id,
                name: fetchedUser.name,
                email: fetchedUser.email,
                password: fetchedUser.password
            }, 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiw', {
                expiresIn: '20m'
            });
            res.status(200)
                .json({
                    token: token
                });
        })
        .catch(error => {
            return res.status(401).json({
                message: 'Login failed line 66!'
            })
        });
});

module.exports = router;
