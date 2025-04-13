const express = require("express");
const routerr = express.Router();
const authen = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middlewares/auth");

// route qui affiche toutes les sessions (only acces 4 admin)::

routerr.get('/liste_inscrits', verifyToken, async (req, res) => {

    try {

        if (req.user.role !== "admin") {
            return res.status(400).json({ message: "Désolé , mais seuls les admins peuvent consulter cette liste " });
        }

        const aut = await authen.find();
        res.status(200).json(aut);
    }
    catch (er) {
        console.error(er);
        res.json({ message: "erreur lors du récupération des utilisateurs" });

    }

});

// route d inscription:

routerr.post("/inscription", async (req, res) => {

    try {
        const { nom, prenom, email, pass, dateNaissance, role } = req.body;


        if (!nom || !prenom || !email || !pass || !dateNaissance) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        if (pass.length < 8) {
            return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères" });
        }

        const existingUser = await authen.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email déjà inscrit" });
        }
        

        const hashedPassword = await bcrypt.hash(pass, 10);
        const user = new authen({ nom, prenom, email, pass: hashedPassword, dateNaissance, role });
        await user.save();
        res.json({ message: "Utilisateur crée" });

    } catch (err) {
        console.error("Erreur lors de l'inscription: ", err);
        //if (err.code == 11000) { return res.status(400).json({ message: "Email déjà inscrit" }); }
        res.status(400).json({ message: err.message || "Un Problème est survenu" });

    }

});


//route de connexion :

routerr.post("/connexion", async (req, res) => {

    const { email, pass } = req.body;


    try {

        const user = await authen.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Veuillez s'inscrire d'abord" });
        }

        const comparePass = await bcrypt.compare(pass, user.pass);
        if (!comparePass) {
            return res.status(404).json({ message: "Mot de passe incorrect" });
        }


        // Générer le   token :
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Utilisateur connecté(e) avec succés", token, user });
    }


    catch (err) {

        console.error(err);
        res.status(500).json({ message: "Erreur lors de la connexion" });
    }

});




// Route pour obtenir la liste des médecins 


routerr.get('/liste_medecins', verifyToken, async (req, res) => {
    try 
    
    {
        const medecins = await authen.find({ role: "medecin" }).select("nom prenom specialite");


        res.status(200).json(medecins);
    } catch (er) {

        console.error(er);


        res.status(500).json({ message: "Erreur lors de la récupération des médecins" });
    }
});



module.exports = routerr;