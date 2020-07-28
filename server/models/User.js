// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const saltRounds = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    },
});

userSchema.pre("save", function (next) {
    let user = this;

    if (!user.isModified("password")) return next();

    bcrypt.genSalt(saltRounds, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return nexr(err);

            user.password = hash;
            console.log("password", user.password);
            next();
        });
    });
});

userSchema.methods.comparePassword = function (plainPassword, callback) {
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

userSchema.methods.generateToken = function (callback) {
    let user = this;

    let token = jwt.sign(user._id.toHexString(), "secretToken");
    user.token = token;
    user.save((err, user) => {
        if (err) return callback(err);
        callback(null, user);
    });
};

userSchema.statics.findByToken = function (token, callback) {
    let user = this;

    jwt.verify(token, "secretToken", (err, decoded) => {
        user.findOne({ _id: decoded, token: token }, (err, user) => {
            if (err) return callback(err);
            callback(null, user);
        });
    });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
