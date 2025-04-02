import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GoogleSignIn = () => {
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        const { credential } = credentialResponse;

        try {
            // Enviar el token de Google al backend
            const res = await axios.post("http://localhost:4000/parking/auth/google", {
                token: credential,
            });

            // Guardar el token JWT en las cookies o localStorage
            document.cookie = `token=${res.data.token}; path=/`;

            // Redirigir al usuario a /home
            navigate("/home");
        } catch (error) {
            console.error("Error en la autenticación con Google:", error);
        }
    };

    const handleError = () => {
        console.log("Error en el inicio de sesión con Google");
    };

    return (
        <GoogleOAuthProvider clientId="502548877339-iau4hvt7nlhm3p9d31q33960q1c10524.apps.googleusercontent.com">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
            />
        </GoogleOAuthProvider>
    );
};

export default GoogleSignIn;