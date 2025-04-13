import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ComposantConnexion = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:6001/api/connexion", { email, pass });
      console.log(response.data);


      if (response.data.token) {
        setSuccessMessage("Connexion réussie !");
       
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.user.role); 

        


        if(response.data.user.role==="admin"){
          setTimeout(() => {
            navigate("/liste_inscrits");
          }, 2000);
        }
        else if(response.data.user.role==="patient")
        {
          setTimeout(()=>{
            navigate("/mes-reservations");
          },2000)
        }
        else if (response.data.user.role==="medecin")
        {
          setTimeout(()=>{
            navigate("/mes-rendez-vous");  
          },2000);

        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la connexion");
    }
  };

  return (
    <div className="connexion-container">
      <h2 class="titre">Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
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
        {error && <div className="error">{error}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
        <button type="submit">Se connecter</button>
        Vous n'avez pas un compte ? <a href="/inscription">Inscrivez vous ici</a>
      </form>
    </div>
  );
};

export default ComposantConnexion;
