import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import '../assets/Login.css';

const Menu = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://smartparking-production-dee6.up.railway.app/parking/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Error en la solicitud de logout:", error);
    }
  };

  return (
    <div className="menu-container">
      {/* Título en la parte superior */}
      <div className="menu-title">
        <h4 className="text-white">Smart Parking</h4>
      </div>

      {/* Menú principal */}
      <div className="menu-items">
        <ul className="navbar-nav flex-column">
          <li className="nav-item">
            <Link className="nav-link text-white" to="/home">
              <i className="bi bi-house-door menu-icon"></i> Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/capture">
              <i className="bi bi-pencil menu-icon"></i> Capturar Matrícula
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/pago">
              <i className="bi bi-wallet menu-icon"></i> Sistema de Pago
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/crudusers">
              <i className="bi bi-people menu-icon"></i> Usuarios
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/crudregistros">
              <i className="bi bi-clipboard-data menu-icon"></i> Registros
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/reportes">
              <i className="bi bi-file-earmark-pdf menu-icon"></i> Reportes
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link text-white" to="/graficas">
              <i className="bi bi-graph-up menu-icon"></i> Gráficas
            </Link>
          </li>
        </ul>
      </div>

      {/* Footer del menú (Cerrar sesión) */}
      <div className="menu-footer">
        <Link
          className="nav-link text-danger"
          to="#"
          onClick={handleLogout}
        >
          <i className="bi bi-box-arrow-right menu-icon"></i> Cerrar sesión
        </Link>
      </div>
    </div>
  );
};

export default Menu;