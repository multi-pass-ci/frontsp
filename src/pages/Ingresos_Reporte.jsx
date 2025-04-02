import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from "../components/Menu";
import { Link } from "react-router-dom";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function IngresosReporte() {
    const data = {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [
            {
                label: 'Semana Actual',
                data: [1200, 1900, 1700, 2100, 2300, 2500, 1800],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.3,
            },
            {
                label: 'Semana Anterior',
                data: [1000, 1700, 1500, 1900, 2100, 2300, 1600],
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                tension: 0.3,
            },
            {
                label: 'Objetivo',
                data: [1500, 1500, 1500, 1500, 1500, 2000, 2000],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderDash: [5, 5],
                tension: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Ingresos Generados Comparados',
                font: {
                    size: 18
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Ingresos ($)'
                }
            }
        }
    };

    return (
        <>
            <Menu />
            <div className="content-container">
                <div className="container">
                    <h2 className="text-2xl font-bold text-center mb-4">Reporte de Ingresos</h2>

                    <div className="bg-white p-4 rounded-lg shadow mt-4">
                        <Line data={data} options={options} />
                        <div className="mt-4 text-gray-600">
                            <p><strong>Total semana actual:</strong> $13,500</p>
                            <p><strong>Total semana anterior:</strong> $11,200</p>
                            <p><strong>Objetivo semanal:</strong> $12,500</p>
                            <p className="text-green-600 font-medium">+18% vs semana anterior</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}