import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from "../components/Menu";
import { Link } from "react-router-dom";

const Reportes = () => {
    return (
        <>
            <Menu />
            <div className="content-container">
                <div className="container">
                    <h2 className="text-2xl font-bold text-center mb-4">Reportes</h2>
                    <div className="d-flex justify-content-center mt-4">
                        <div className="btn-group" role="group" aria-label="Reportes disponibles">
                            <Link 
                                to="/cupos" 
                                className="btn btn-primary m-2"
                            >
                                Reporte de cupos
                            </Link>
                            <Link 
                                to="/ingresos" 
                                className="btn btn-primary m-2"
                            >
                                Reporte de ingresos
                            </Link>
                            <Link 
                                to="/tiempos" 
                                className="btn btn-primary m-2"
                            >
                                Reporte por tiempo de uso
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reportes;