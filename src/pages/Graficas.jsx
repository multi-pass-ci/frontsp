import React, { useEffect, useState } from 'react';
import Menu from "../components/Menu";
import ApexChart from 'react-apexcharts';
import axios from 'axios';

const Graficas = () => {
  const [cuposData, setCuposData] = useState([]);
  const [ingresosData, setIngresosData] = useState([]);
  const [utilizacionData, setUtilizacionData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = 'https://smartparking-production-dee6.up.railway.app/parking';
      try {
        const cupos = await axios.get(`${baseUrl}/graficas/cupos`);
        const ingresos = await axios.get(`${baseUrl}/graficas/ingresos`);
        const utilizacion = await axios.get(`${baseUrl}/graficas/utilizacion`);
        setCuposData(cupos.data);
        setIngresosData(ingresos.data);
        setUtilizacionData(utilizacion.data);
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    };
    fetchData();
  }, []);

  const chartCupos = {
    options: {
      chart: { id: 'cupos-chart' },
      xaxis: {
        categories: cuposData.map(item => new Date(item.dia).toLocaleDateString()),
        title: { text: 'Día' }
      },
      title: { text: 'Cupos por Día del Mes', align: 'center' }
    },
    series: [
      {
        name: 'Total cupos',
        data: cuposData.map(item => item.total)
      }
    ]
  };

  const chartIngresos = {
    options: {
      chart: { id: 'ingresos-chart' },
      xaxis: {
        categories: ingresosData.map(item => `Semana ${item.semana}`),
        title: { text: 'Semana' }
      },
      title: { text: 'Ingresos Semanales vs Objetivo y Año Anterior', align: 'center' }
    },
    series: [
      {
        name: 'Ingresos 2025',
        data: ingresosData.map(item => parseFloat(item.total_ingresos))
      },
      {
        name: 'Año anterior',
        data: ingresosData.map(() => 100) // valor ficticio
      },
      {
        name: 'Objetivo',
        data: ingresosData.map(() => 250) // valor objetivo fijo
      }
    ]
  };

  const chartUtilizacion = {
    options: {
      chart: { id: 'utilizacion-chart' },
      xaxis: {
        categories: utilizacionData.map(item => item.cajon),
        title: { text: 'Cajón' }
      },
      yaxis: {
        max: 1,
        labels: {
          formatter: val => `${(val * 100).toFixed(0)}%`
        }
      },
      title: { text: 'Utilización por Cajón (%)', align: 'center' }
    },
    series: [
      {
        name: 'Actual',
        data: utilizacionData.map(item => parseFloat(item.porcentaje_uso))
      },
      {
        name: 'Año anterior',
        data: utilizacionData.map(() => 0.3) // valor ficticio
      },
      {
        name: 'Objetivo',
        data: utilizacionData.map(() => 0.5) // objetivo
      }
    ]
  };

  return (
    <>
      <Menu />
      <div className="content-container container">
        <h2 className="text-2xl font-bold text-center mb-4">Gráficas</h2>

        <div className="mb-5">
          <ApexChart options={chartCupos.options} series={chartCupos.series} type="bar" height={300} />
        </div>

        <div className="mb-5">
          <ApexChart options={chartIngresos.options} series={chartIngresos.series} type="line" height={300} />
        </div>

        <div className="mb-5">
          <ApexChart options={chartUtilizacion.options} series={chartUtilizacion.series} type="bar" height={300} />
        </div>
      </div>
    </>
  );
};

export default Graficas;