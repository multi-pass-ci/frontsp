import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; //libreria para las alertas de las validaciones.
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import '../assets/Login.css';

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Función para manejar el login tradicional con usuarios normales, no de google.
  const handleSubmit = async (e) => {
    e.preventDefault();

    const usuario = {
      correo,
      contrasena: password,
    };

    try {
      const response = await axios.post(
        "https://smartparking-production-dee6.up.railway.app/parking/usuarios/login",
        usuario
      );
      console.log(response.data);

      // Guardar el token en localStorage para manejarlo correctamente
      localStorage.setItem("token", response.data.token);

      if ((response.data.tipo === 3 || response.data.tipo === 2) && response.data.estado === "activo") {        toast.success("Inicio de sesión exitoso");
        navigate("/home");
      } else {
        toast.error("Usuario no autorizado para acceder a esta página");
      }
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      toast.error("Usuario o contraseña incorrecto");
    }
  };

  // Función para manejar el login con Google
  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;

    try {
      // Enviar el token de Google al backend
      const res = await axios.post("https://smartparking-production-dee6.up.railway.app/parking/auth/google", {
        token: credential,
      });

      localStorage.setItem("token", res.data.token); // guarda el token JWT en localStorage

      navigate("/home"); //manda al usuario a home si la validación es correcta
      toast.success("Inicio de sesión con Google exitoso");
    } catch (error) {
      console.error("Error en la autenticación con Google:", error);
      toast.error("Error al iniciar sesión con Google");
    }
  };

  const handleGoogleError = () => {
    console.log("Error en el inicio de sesión con Google");
    toast.error("Error al iniciar sesión con Google");
  };

  return (
    <div className="login-container">
      <img src="/estacionamiento.jpg" alt="Background" className="background-image"/>

      {}
      <div className="login-form">
        <div className="card shadow-lg p-4">
          <h3 className="text-center">Iniciar Sesión</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Iniciar Sesión
            </button>

            {/* Botón de Google Sign-In */}
            <GoogleOAuthProvider clientId="502548877339-iau4hvt7nlhm3p9d31q33960q1c10524.apps.googleusercontent.com">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="continue_with"
                theme="outline"
                shape="rectangular"
                size="large"
                width="100%"
              />
            </GoogleOAuthProvider>
          </form>
        </div>
      </div>

      
      <ToastContainer />
    </div>
  );
};

export default Login;