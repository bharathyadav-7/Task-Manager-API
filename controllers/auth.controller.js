// const { registerUser } = require("../services/auth.service");
const { registerUser, loginUser,refreshAccessToken,logoutUser} = require("../services/auth.service");

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const user = await registerUser(name, email, password);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const tokens = await loginUser(email, password);

        res.status(200).json({
            message: "Login successful",
            ...tokens
        });
    } catch (error) {
        next(error);
    }
};
const refresh = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token is required"
            });
        }

        const tokens = await refreshAccessToken(refreshToken);

        res.status(200).json(tokens);
    } catch (error) {
        next(error);
    }
};
const logout = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Refresh token is required"
            });
        }

        await logoutUser(refreshToken);

        res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    refresh,
    logout
};