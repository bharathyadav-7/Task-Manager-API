const User = require("../models/user");
const bcrypt = require("bcrypt");

const registerUser = async (name, email, password) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error("User already exists");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return user;
};
const jwt = require("jsonwebtoken");

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const accessToken = jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m"
        }
    );

    const refreshToken = jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "7d"
        }
    );
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    user.refreshToken = hashedRefreshToken;

    await user.save();

    return {
        accessToken,
        refreshToken
    };
};
const refreshAccessToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user || !user.refreshToken) {
            const error = new Error("Invalid refresh token");
            error.statusCode = 401;
            throw error;
        }
        console.log("Stored hash:", user.refreshToken);
console.log("Incoming refresh token:", refreshToken);

        const isValidToken = await bcrypt.compare(
            refreshToken,
            user.refreshToken
        );

        if (!isValidToken) {
            const error = new Error("Invalid refresh token");
            error.statusCode = 401;
            throw error;
        }

        const newAccessToken = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        const newRefreshToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: "7d"
            }
        );

        const hashedRefreshToken = await bcrypt.hash(
            newRefreshToken,
            10
        );

        user.refreshToken = hashedRefreshToken;

        await user.save();
        console.log("New refresh token hash saved:", user.refreshToken);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        const refreshError = new Error("Invalid refresh token");
        refreshError.statusCode = 401;
        throw refreshError;
    }
};
const logoutUser = async (refreshToken) => {
    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user || !user.refreshToken) {
            const error = new Error("Invalid refresh token");
            error.statusCode = 401;
            throw error;
        }

        const isValidToken = await bcrypt.compare(
            refreshToken,
            user.refreshToken
        );

        if (!isValidToken) {
            const error = new Error("Invalid refresh token");
            error.statusCode = 401;
            throw error;
        }

        user.refreshToken = null;

        await user.save();

        return true;
    } catch (error) {
        if (error.statusCode) {
            throw error;
        }

        const logoutError = new Error("Invalid refresh token");
        logoutError.statusCode = 401;
        throw logoutError;
    }
};

module.exports = {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser
};