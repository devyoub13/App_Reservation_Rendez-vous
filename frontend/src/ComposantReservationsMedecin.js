import React, { useState, useEffect } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const ComposantReservationsMedecin = () => {
   const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token");
         
        if (!token) {
          navigate("/connexion");
          return;
        }

        const response = await axios.get("http://localhost:6001/api/mes-reservations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReservations(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors de la récupération des réservations");
        setLoading(false);
      }
    };

    fetchReservations();
  }, [navigate]);

  const handleValidate = async (reservationId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:6001/api/${reservationId}/status`,
        { status: "Validée" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage("Réservation validée avec succès");
      const response = await axios.get("http://localhost:6001/api/mes-reservations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(response.data);
      
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la validation");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/connexion");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  if (loading) return <div>Chargement des réservations...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="reservations-container">
      <div style={{
        position: 'relative',
        width: '100%',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h2 class="titre">Mes Rendez-vous</h2>
        <button 
          onClick={handleLogout}
          class="deconnexion"
        >
          Déconnexion
        </button>
      </div>
      
      {successMessage && <div className="success">{successMessage}</div>}
      
      {reservations.length === 0 ? (
        <p>Aucune réservation trouvée.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Heure</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>
                  {reservation.patientId?.nom} {reservation.patientId?.prenom}
                  <br />
                </td>
                <td>{formatDate(reservation.date)}</td>
                <td>{reservation.hour}</td>
                <td>{reservation.status}</td>
                <td>
                  {reservation.status === "En cours" && (
                    <button 
                      onClick={() => handleValidate(reservation._id)}
                      className="validate-btn"
                    >
                      Valider
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ComposantReservationsMedecin;