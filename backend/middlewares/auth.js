const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {


    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) 
            {
        return res.status(401).json({ message: "Accès refusé, token requis" });
    }

    const token = authHeader.split(" ")[1];

    try 
    {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user ={ userId: verified.userId, role: verified.role }; 
        //req.user = verified;


        next();
    } catch (err) 
    {

        console.error("Erreur de vérification du token:", err.message);
        return res.status(403).json({ message: "Token invalide ou expiré" });
    }

    
};

module.exports = verifyToken;
