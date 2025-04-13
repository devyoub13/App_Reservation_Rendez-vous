import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);

  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    hour: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/connexion");
          return;
        }

       
        const resResponse = await axios.get("http://localhost:6001/api/mes-reservations", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReservations(resResponse.data);

        
        const docResponse = await axios.get("http://localhost:6001/api/liste_medecins", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(docResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors du chargement des données");
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/connexion");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      


      await axios.post("http://localhost:6001/api/reserver", 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage("Réservation ajoutée avec succès");
      setShowForm(false);
      setFormData({ doctorId: "", date: "", hour: "" });
      
     
      const resResponse = await axios.get("http://localhost:6001/api/mes-reservations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(resResponse.data);

      setTimeout(() => setSuccessMessage(""), 3000);
    } 
    
    catch (err)
    
      {
      setError(err.response?.data?.message || "Erreur lors de l'ajout de la réservation");
    }


  };

  return (
    <div className="liste-inscrits-container">
      <div style={{
        position: 'relative',
        width: '100%',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h2 className="titre">Mes Rendez-vous</h2>
        
        <button 
          onClick={handleLogout}
          className="deconnexion"
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Déconnexion
        </button>
      </div>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="ajout-reservation-btn"
          style={{
            padding: '8px 16px',
            backgroundColor: showForm ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showForm ? 'Annuler' : 'Ajouter une réservation'}
        </button>
      </div>

      {successMessage && (
        <div style={{
          padding: '10px',
          backgroundColor: '#dff0d8',
          color: '#3c763d',
          textAlign: 'center',
          marginBottom: '15px',
          borderRadius: '4px'
        }}>
          {successMessage}
        </div>
      )}

      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f2dede',
          color: '#a94442',
          textAlign: 'center',
          marginBottom: '15px',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      {showForm && (
        <div style={{
          maxWidth: '500px',
          margin: '0 auto 30px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '5px'
        }}>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Médecin:</label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="">Sélectionnez un médecin</option>
                {doctors.map(doctor => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.nom} {doctor.prenom} - {doctor.specialite}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Heure:</label>
              <input
                type="time"
                name="hour"
                value={formData.hour}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>

            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#5cb85c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Confirmer la réservation
            </button>
          </form>
        </div>
      )}

      {!error && reservations.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '20px' }}>Aucune réservation trouvée.</div>
      )}

      {!error && reservations.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                 <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Heure</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Médecin</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Statut</th>
            </tr>

          </thead>

          <tbody>


            {reservations.map((res) => (
              <tr key={res._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{new Date(res.date).toLocaleDateString()}</td>
                <td style={{ padding: '12px' }}>{res.hour}</td>

                <td style={{ padding: '12px' }}>{res.doctorId?.nom} {res.doctorId?.prenom}</td>
                <td style={{ padding: '12px' }}>{res.status || "en attente"}</td>
              </tr>
            ))}
          </tbody>
          
        </table>
      )}
    </div>
  );
};

export default MesReservations;