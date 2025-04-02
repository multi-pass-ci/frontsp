import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from "../components/Menu";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TiemposReporte() {
    const data = {
        labels: ['Ocupado', 'Disponible', 'Mantenimiento'],
        datasets: [
            {
                label: 'Horas',
                data: [8, 12, 4],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Permite controlar el tamaño manualmente
        plugins: {
            title: {
                display: true,
                text: 'Tiempo de Uso - Cajón A1 (8 horas)',
                font: {
                    size: 16 // Tamaño más pequeño para el título
                },
                padding: {
                    top: 10,
                    bottom: 20
                }
            },
            legend: {
                position: 'bottom',
                labels: {
                    boxWidth: 12, // Hace más pequeños los cuadros de la leyenda
                    padding: 12, // Espaciado entre elementos
                    font: {
                        size: 12 // Texto más pequeño
                    }
                }
            },
            tooltip: {
                bodyFont: {
                    size: 12 // Texto más pequeño en tooltips
                }
            }
        },
        cutout: '65%' // Hace el agujero central más grande (gráfico más delgado)
    };

    return (
        <>
            <Menu />
            <div className="content-container">
                <div className="container">
                    <h2 className="text-2xl font-bold text-center mb-4">Reporte de Tiempos de Uso</h2>

                    <div className="bg-white p-4 rounded-lg shadow mt-4">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            {/* Contenedor del gráfico más pequeño */}
                            <div className="w-full md:w-1/2 lg:w-1/3 mx-auto" style={{ height: '300px' }}>
                                <Doughnut data={data} options={options} />
                            </div>
                            
                            {/* Información detallada */}
                            <div className="w-full md:w-1/2">
                                <h3 className="font-bold text-lg mb-3">Detalles de uso</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center">
                                        <span className="inline-block w-3 h-3 bg-red-500 mr-2 rounded-full"></span>
                                        <strong>Ocupado:</strong> 8 horas (33%)
                                    </li>
                                    <li className="flex items-center">
                                        <span className="inline-block w-3 h-3 bg-teal-500 mr-2 rounded-full"></span>
                                        <strong>Disponible:</strong> 12 horas (50%)
                                    </li>
                                    <li className="flex items-center">
                                        <span className="inline-block w-3 h-3 bg-yellow-500 mr-2 rounded-full"></span>
                                        <strong>Mantenimiento:</strong> 4 horas (17%)
                                    </li>
                                </ul>
                                <div className="mt-4 p-3 bg-gray-50 rounded">
                                    <p className="text-sm text-gray-600">
                                        <strong>Nota:</strong> Datos correspondientes al día de hoy
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}