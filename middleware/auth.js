import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            return res.status(403).send("Access Denied");
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, "xR0H4EBFIkdERNo5VmzSN1FfXvGoKO0x7nKuWI0qdYyKdytnk6NM0NHkdrCZPLrF");
        req.user = verified;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};