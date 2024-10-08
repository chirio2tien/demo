const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Token không hợp lệ
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // Không có token
    }
};

module.exports = authenticateJWT;