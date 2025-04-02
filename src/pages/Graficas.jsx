import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from "../components/Menu";
import { Link } from "react-router-dom";

const Graficas = () => {
    return (
        <>
            <Menu />
            <div className="content-container">
                <div className="container">
                    <h2 className="text-2xl font-bold text-center mb-4">Gráficas</h2>
                    <div className="d-flex justify-content-center mt-4">
                        <div className="btn-group" role="group" aria-label="Gráficas disponibles">
                            <Link 
                                to="/cupos_grafica" 
                                className="btn btn-primary m-2">
                                Gráfica de cupos
                            </Link>
                            <Link 
                                to="/ingresos_grafica" 
                                className="btn btn-primary m-2">
                                Gráfica de ingresos
                            </Link>
                            <Link 
                                to="/tiempos_grafica" 
                                className="btn btn-primary m-2">
                                Gráfica por tiempo de uso
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Graficas;