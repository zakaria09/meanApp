const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiw');
        req.userData = { 
            userId: decodedToken.userId,
            name: decodedToken.name,
            email: decodedToken.email,
        };
        next();
    } catch {
        res.status(401).json(
            {message: 'Login failed!'}
        );
    }
};