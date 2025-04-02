import React from 'react';
import Menu from "../components/Menu";

const Home = () => {
  return (
    <>
      <Menu />
      <div className="content-container">
        <div className="p-3">
          <h1 className="text-center mb-4">Bienvenido a Smart Parking</h1>
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center">Panel de administrador</h3>
              {/* Contenido del dashboard... */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;