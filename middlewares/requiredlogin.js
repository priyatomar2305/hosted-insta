const User = require('../models/signup');
const { Jwt_secret } = require('../keys');
const Jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in" });
    }

    const token = authorization.replace("Bearer ", "");

    Jwt.verify(token, Jwt_secret, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must be logged in" });
        }

        const { _id } = payload;

        User.findById(_id)
            .then(userdata => {
                if (!userdata) {
                    console.log("User not found.");
                    return res.status(401).json({ error: "User not found" });
                }
                req.User = userdata;
                next();
            })
            .catch(err => {
                console.error("Database query error:", err.message);
                return res.status(500).json({ error: "Internal server error" });
            });
    });
};
