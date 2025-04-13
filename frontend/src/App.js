import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ComposantInscription from "./ComposantInscription";
import ComposantConnexion from "./ComposantConnexion";
import ListeInscrits from "./ComposantInscrits";
import MesReservations from "./ComposantReservations";
import ComposantReservationsMedecin from "./ComposantReservationsMedecin";
import ComposantReservationsAdmin from "./ComposantReservationsAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routess */}
        <Route path="/inscription" element={<ComposantInscription />} />
        <Route path="/connexion" element={<ComposantConnexion />} />
        <Route path="/liste_inscrits" element={<ListeInscrits />} />
        <Route path="/mes-reservations" element={<MesReservations />} />
        <Route path="/mes-rendez-vous" element={<ComposantReservationsMedecin />} />
        <Route path="/toutesreservations" element={<ComposantReservationsAdmin />} />
        {/* Redirection d vers l'inscription apres npm start  :  /  c a dire la racine */}
        <Route path="/" element={<Navigate to="/connexion" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
