import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./pages/Login";
import Home from "./pages/Home";
import Capture from "./pages/Capture";
import Payment from "./pages/Payment";
import Crudusers from "./pages/Crud_Users";
import Crudregistros from "./pages/Crud_registros";
import Reportes from "./pages/Reportes";
import Cupos_Reporte from "./pages/Cupos_Reporte";
import Tiempos_Reporte from "./pages/Tiempos_Reporte";
import Ingresos_Reporte from "./pages/Ingresos_Reporte";
import Graficas from "./pages/Graficas";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";


const App = () => {
  return (
    <div>
      {/* Contenedor de notificaciones - debe estar en el nivel más alto */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        {/* Rutas públicas (no protegidas) */}
        <Route path="/" element={<Login />} />
        <Route path="/l" element={<LoginPage />} />

        {/* Rutas protegidas */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/capture"
          element={
            <ProtectedRoute>
              <Capture />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pago"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crudusers"
          element={
            <ProtectedRoute>
              <Crudusers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reportes"
          element={
            <ProtectedRoute>
              <Reportes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cupos"
          element={
            <ProtectedRoute>
              <Cupos_Reporte />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tiempos"
          element={
            <ProtectedRoute>
              <Tiempos_Reporte />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ingresos"
          element={
            <ProtectedRoute>
              <Ingresos_Reporte />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crudregistros"
          element={
            <ProtectedRoute>
              <Crudregistros />
            </ProtectedRoute>
          }
        />
        <Route
          path="/graficas"
          element={
            <ProtectedRoute>
              <Graficas />
            </ProtectedRoute>
          }
        />
      </Routes>
      
    </div>
  );
};

export default App;