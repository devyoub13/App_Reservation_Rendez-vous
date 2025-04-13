import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ComposantInscription = () => {

  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [role, setRole] = useState("patient");
  const [error, setError] = useState(""); 
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate(); 

 
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError("");
    setSuccessMessage("");
    const userData = { nom, prenom, email, pass, dateNaissance, role };

    try {
  
      const response = await axios.post("http://localhost:6001/api/inscription", userData);
      console.log(response.data); //
      if (response.data.message === "Utilisateur crée") {
       
        setSuccessMessage("Inscription réussie !");
        setTimeout(() => {
            navigate("/connexion");
          }, 2000);
      }
    } catch (err) {
      
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="inscription-container">
      <h2 class="titre">Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom :</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prénom :</label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {setEmail(e.target.value);
            setError("");
        }}
            required
          />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date de naissance :</label>
          <input
            type="date"
            value={dateNaissance}
            onChange={(e) => setDateNaissance(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Rôle :</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="patient">Patient</option>
            <option value="medecin">Médecin</option>
            <option value="admin">Administrateur</option>
          </select>
        </div>
        {error && <div className="error">{error}</div>} 
        {successMessage && <div className="success">{successMessage}</div>}
        <button type="submit">S'inscrire</button>
        Vous avez dèja un compte?<a href="/connexion">Se connecter ici</a>
      </form>
    </div>
  );
};

export default ComposantInscription;
