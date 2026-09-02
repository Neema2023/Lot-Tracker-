const authService = require("../services/auth.service");

const register = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await authService.register(name, email, password);

        res.status(201).json({
            message: "User registered successfully",
            user
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        res.status(200).json(result);
    } catch (error) {
        res.status(401).json({
            message: error.message
        });
    }
};

module.exports = {
    register,
    login
};