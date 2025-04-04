import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from "../components/Menu";
import ApexChart from "react-apexcharts";
import { useEffect, useState } from "react";

const Graficas = () => {
    const [cuposData, setCuposData] = useState([]);
    const [ingresosData, setIngresosData] = useState([]);
    const [utilizacionData, setUtilizacionData] = useState([]);

    const objetivoIngresos = 300; // ingreso meta semanal
    const objetivoUso = 0.8; // objetivo de uso por cajon en porcentaje

    useEffect(() => {
        fetch("https://smartparking-production-dee6.up.railway.app/parking/graficas/cupos")
            .then(res => res.json())
            .then(data => setCuposData(data));

        fetch("https://smartparking-production-dee6.up.railway.app/parking/graficas/ingresos")
            .then(res => res.json())
            .then(data => setIngresosData(data));

        fetch("https://smartparking-production-dee6.up.railway.app/parking/graficas/utilizacion")
            .then(res => res.json())
            .then(data => setUtilizacionData(data));
    }, []);

    const formatFecha = (isoDate) => {
        const date = new Date(isoDate);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    return (
        <>
            <Menu />
            <div className="content-container container mt-4">
                <h2 className="text-2xl font-bold text-center mb-4">Gráficas</h2>

                <div className="mb-5">
                    <h4>Gráfica de Cupos por Día</h4>
                    <ApexChart
                        type="bar"
                        height={350}
                        series={[{
                            name: "Cupos",
                            data: cuposData.map(d => d.total)
                        }]}
                        options={{
                            chart: { id: "cupos-chart" },
                            xaxis: {
                                categories: cuposData.map(d => formatFecha(d.dia)),
                                title: { text: "Día" }
                            },
                            yaxis: {
                                title: { text: "Cantidad de Cupos" }
                            }
                        }}
                    />
                </div>

                <div className="mb-5">
                    <h4>Gráfica de Ingresos por Semana</h4>
                    <ApexChart
                        type="line"
                        height={350}
                        series={[
                            {
                                name: "Ingresos Semanales",
                                data: ingresosData.map(i => parseFloat(i.total_ingresos))
                            },
                            {
                                name: "Objetivo",
                                data: ingresosData.map(() => objetivoIngresos)
                            }
                        ]}
                        options={{
                            chart: { id: "ingresos-chart" },
                            xaxis: {
                                categories: ingresosData.map(i => `Semana ${i.semana}`),
                                title: { text: "Semana" }
                            },
                            yaxis: {
                                title: { text: "Ingresos ($MXN)" }
                            }
                        }}
                    />
                </div>

                <div className="mb-5">
                    <h4>Gráfica de Utilización por Cajón</h4>
                    <ApexChart
                        type="bar"
                        height={350}
                        series={[
                            {
                                name: "Utilización",
                                data: utilizacionData.map(u => parseFloat(u.porcentaje_uso))
                            },
                            {
                                name: "Objetivo",
                                data: utilizacionData.map(() => objetivoUso)
                            }
                        ]}
                        options={{
                            chart: { id: "utilizacion-chart" },
                            xaxis: {
                                categories: utilizacionData.map(u => u.cajon),
                                title: { text: "Cajón" }
                            },
                            yaxis: {
                                title: { text: "% de Utilización" },
                                labels: {
                                    formatter: val => `${(val * 100).toFixed(0)}%`
                                },
                                max: 1
                            },
                            tooltip: {
                                y: {
                                    formatter: val => `${(val * 100).toFixed(1)}%`
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </>
    );
};

export default Graficas;