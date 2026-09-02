const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const register = async(name, email, password) => {
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
        throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "VIEWER"
    });

    return {
        id: userId,
        name,
        email,
        role: "VIEWER"
    };
};

const login = async(email, password) => {
    const user = await User.findByEmail(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET, {
            expiresIn: "1h"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

module.exports = {
    register,
    login
};