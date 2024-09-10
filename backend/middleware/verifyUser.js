import jwt from 'jsonwebtoken'

const verifyUser = (req, res, next) => {
    // const accessToken = req.headers.cookie?.split("=")[1];
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json({ success: false, message: "Access token is missing" });
    }

    // Verify the access token
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Handle specific JWT error cases
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ success: false, message: "Access token has expired" });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ success: false, message: "Invalid access token" });
            } else {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        }

        // If the token is valid, store the decoded email in the request
        req.email = decoded.email;
        next();
    });
};

export default verifyUser;
