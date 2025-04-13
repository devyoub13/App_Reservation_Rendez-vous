const express = require('express');
const routerr = express.Router();
const Reservation = require("../models/Reservations");
const User = require("../models/Users");
const verifyToken = require("../middlewares/auth");


// afficher toutes les réservations : acces pour l admin


routerr.get("/reservations", verifyToken, async (req, res) => {

    try {
        // condition si c pas l admin, so pas d acces a cette route
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Accès refusé. Seul l'admin peut voir toutes les réservations." });
        }
        // Récupérer toutes les réservations depuis la  bdd 
        const reservations = await Reservation.find()
        .populate('patientId', 'nom prenom')
        .populate('doctorId', 'nom prenom');;

        
        res.status(200).json(reservations);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des réservations" });
    }
});

// afficher toutes les reservations de l utilisateur connecté :

routerr.get("/mes-reservations", verifyToken, async (req, res) => {
    try {
        let mesReserv;

        if (req.user.role === "patient") {
            
            mesReserv = await Reservation.find({ patientId: req.user.userId }).populate("doctorId", "nom prenom email"); 
        } else if (req.user.role === "medecin") {
            
            mesReserv = await Reservation.find({ doctorId: req.user.userId }).populate("patientId", "nom prenom email"); 
        } else {
            return res.status(403).json({ message: "Accès non autorisé" });
        }

        res.status(200).json(mesReserv);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des réservations" });
    }
});


routerr.post("/reserver", verifyToken, async (req, res) => {
    try {
        const patientId = req.user.userId;
        const { doctorId, date, hour } = req.body;

        const doctor = await User.findOne({ _id: doctorId, role: "medecin" });
        if (!doctor) {
            return res.status(400).json({ message: "Le docteur choisi n'existe pas" });
        }

        //const {patientId,doctorId,date,hour}=req.body;
        if (!patientId || !doctorId || !date || !hour) { return res.status(400).json({ message: "Tous les champs sont obligatoires" }); }


        const doctorBusy = await Reservation.findOne({ doctorId, date, hour });
        if (doctorBusy) {
            return res.status(400).json({ message: "Réservation dèja prise à cette date et heure" });
        }

        const newreserv = new Reservation({ patientId, doctorId, date: new Date(date), hour });
        await newreserv.save();
        res.status(201).json(newreserv);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la demande d'une réservation" });
    }
});

// Supprimer une reservation



routerr.delete("/:id", verifyToken, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ message: "Réservation non trouvée" });
        }

      
        if (req.user.role === "admin") {

            await reservation.deleteOne();
            return res.json({ message: "Réservation supprimée par l'admin", reservation });
        }
        else if (req.user.role === "patient" && reservation.patientId.toString() === req.user.userId) {

            await reservation.deleteOne();
            return res.json({ message: "Votre réservation a été supprimée", reservation });
        }
        else {
            return res.status(403).json({ message: "Accès refusé. Vous ne pouvez pas supprimer cette réservation." });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression de la réservation" });
    }
});



/*routerr.delete("/:id", verifyToken, async (req, res) => {
    try {
        const removres = await Reservation.findByIdAndDelete(req.params.id);
        if (!removres) return res.status(404).json({ message: "Réservation non trouvée" });

        res.json({ message: "Réservation supprimée", reservation: removres });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la suppression de la réservation" });
    }
});
*/


// Mettre à jour le statut d'une réservation (pour médecin => hwa li possible ymodifié statuts to validé)
routerr.put("/:id/status", verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({ message: "Réservation non trouvée" });
        }

        
        if (req.user.role !== "medecin" || reservation.doctorId.toString() !== req.user.userId) {
            return res.status(403).json({ message: "Accès refusé. Seul le médecin concerné peut modifier le statut." });
        }


        if (!["En cours", "Validée", "Annulée"].includes(status)) {
            return res.status(400).json({ message: "Statut invalide" });
        }

        reservation.status = status;
        await reservation.save();

        res.status(200).json({ message: "Statut mis à jour", reservation });
    }
    
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du statut" });
    }
});


module.exports = routerr;
