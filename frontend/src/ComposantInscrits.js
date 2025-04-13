import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate, Link } from "react-router-dom";

const ListeInscrits = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/connexion");
          return;

        }

        const response = await axios.get("http://localhost:6001/api/liste_inscrits", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUtilisateurs(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur lors du chargement des utilisateurs");
      }
    };

    fetchUtilisateurs();
  }, [navigate]);

  const handleLogout = () => {
    if (window.confirm("Voulez-vous vraiment vous déconnecter ?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      
      navigate("/connexion");
    }
  };

  return (
    <div className="liste-inscrits-container" style={{ padding: '20px' }}>
      <div style={{
        position: 'relative',
        width: '100%',
        textAlign: 'center',
        marginBottom: '20px'
      }}>
        <h2 className="titre">Liste des utilisateurs inscrits</h2>
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
            to="/toutesreservations" 
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
            Voir tous les rendez-vous
          </Link>
        </div>
      </div>

      {error && <div className="error" style={{ color: 'red', margin: '10px 0' }}>{error}</div>}
      {!error && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Nom</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Prénom</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date de naissance</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Rôle</th>
                </tr>
          </thead>


          <tbody>
            {utilisateurs.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '12px' }}>{user.nom}</td>
                  <td style={{ padding: '12px' }}>{user.prenom}</td>
                  <td style={{ padding: '12px' }}>{user.email}</td>
                  <td style={{ padding: '12px' }}>{new Date(user.dateNaissance).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>{user.role}</td>
                  </tr>
            ))}
          </tbody>

   </table>
      )}


    </div>
  );
};

export default ListeInscrits;