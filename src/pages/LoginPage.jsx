import React from 'react';
import GoogleSignIn from '../components/GoogleSignIn';
import '../assets/Login.css'; // Asegúrate de crear este archivo CSS

const LoginPage = () => {
    return (
        <div className="login-container">
            <div className="left-section">
                <div className="parking-theme">
                    <h2>Bienvenido a Smart-Parking</h2>
                    <p>Gestiona tu estacionamiento de manera eficiente y segura.</p>
                    {/* Puedes añadir más elementos decorativos o informativos aquí */}
                </div>
            </div>
            <div className="right-section">
                <h1>Iniciar sesión</h1>
                <form>
                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input type="password" id="password" name="password" required />
                    </div>
                    <button type="submit" className="login-button">Iniciar sesión</button>
                </form>
                <GoogleSignIn />
            </div>
        </div>
    );
};

export default LoginPage;