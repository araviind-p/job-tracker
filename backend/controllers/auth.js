import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user with the hashed password
        const user = await User.create({ name, email, password: hashedPassword });

        // Respond with the created user
        res.json(user);
    } catch (err) {
        // Handle any errors
        res.status(400).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ Login: false, message: 'You have to register first' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ Login: false, message: 'Incorrect password' });
        }

        // Generate access token (short-lived)
        const accessToken = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '10d' } // 10 days
        );

        // Set the access token in an HTTP-only cookie
        res.cookie("accessToken", accessToken, {
            maxAge: 10 * 24 * 60 * 60 * 1000,  // 10 days seconds
            httpOnly: true,
            sameSite: "lax"
        });

        // Respond with the login status and access token
        res.json({ Login: true, user, accessToken });
    } catch (err) {
        // Handle errors
        res.status(500).json({ error: err.message });
    }
};

export const logout = (req, res) => {
    res
        .clearCookie("accessToken", {
            httpOnly: true,
            // secure: process.env.NODE_ENV,
            sameSite: "lax",
        })
        .status(200)
        .json({ message: "Logout successful" });
}


