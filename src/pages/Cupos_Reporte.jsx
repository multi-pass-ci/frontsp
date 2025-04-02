import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from "../components/Menu";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function CuposReporte() {
    const data = {
        labels: ['Hoy', 'Promedio Mes', 'Año Anterior', 'Objetivo'],
        datasets: [
            {
                label: 'Ocupación (%)',
                data: [65, 58, 70, 80],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(153, 102, 255, 0.6)'
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Disponibilidad de Cupos Comparada',
                font: {
                    size: 18
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Porcentaje de Ocupación'
                }
            }
        }
    };

    return (
        <>
            <Menu />
            <div className="content-container">
                <div className="container">
                    <h2 className="text-2xl font-bold text-center mb-4">Reporte de Cupos</h2>

                    <div className="bg-white p-4 rounded-lg shadow mt-4">
                        <Bar data={data} options={options} />
                        <div className="mt-4 text-gray-600">
                            <p><strong>Hoy:</strong> 65% de ocupación (65/100 cupos)</p>
                            <p><strong>Promedio del mes:</strong> 58% de ocupación</p>
                            <p><strong>Mismo día año anterior:</strong> 70% de ocupación</p>
                            <p><strong>Objetivo:</strong> 80% de ocupación</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}