import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ComposantReservationsAdmin = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {

    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/connexion');
          return;
        }

        const response = await axios.get('http://localhost:6001/api/reservations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setReservations(response.data);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors du chargement des réservations");
        setLoading(false);
        if (err.response?.status === 403) {
          navigate('/non-autorise');
        }
      }
    };

    fetchReservations();
  }, [navigate]);

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

  if (loading) return <div className="loading">Chargement en cours...</div>;

  if (error) return <div className="error">{error}</div>;

  return (

    <div className="admin-reservations-container">

      <div style={{
        position: 'relative',
        width: '100%',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h2 className="titre">Tous les rendez-vous</h2>
        <button 
          onClick={handleLogout}
          className="deconnexion"
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          Déconnexion
        </button>
        <div>
          <Link 
            to="/liste_inscrits" 
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              borderRadius: '4px',
              textDecoration: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >

            Voir tous les utilisateurs inscrits
          </Link>
        </div>
      </div>
      
      {reservations.length === 0 ? (
        <p>Aucune réservation trouvée.</p>
      ) : (
        <table className="reservations-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>


              <tr style={{ backgroundColor: '#f2f2f2' }}>
               <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Patient</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Médecin</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Heure</th>
                   <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Statut</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>
                  {reservation.patientId?.nom} {reservation.patientId?.prenom}
                </td>
                <td style={{ padding: '12px' }}>
                  {reservation.doctorId?.nom} {reservation.doctorId?.prenom}
                </td>
                  <td style={{ padding: '12px' }}>{formatDate(reservation.date)}</td>
                     <td style={{ padding: '12px' }}>{reservation.hour}</td>
            <td style={{ padding: '12px' }}>{reservation.status || "En attente"}</td>
              </tr>


            ))}
          </tbody>


        </table>
      )}

    </div>
  );
};



export default ComposantReservationsAdmin;