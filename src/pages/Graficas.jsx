import React, { useEffect, useState } from 'react';
import Menu from "../components/Menu";
import ApexChart from 'react-apexcharts';
import axios from 'axios';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';

const Graficas = () => {
  const [cuposData, setCuposData] = useState([]);
  const [ingresosData, setIngresosData] = useState([]);
  const [utilizacionData, setUtilizacionData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const baseUrl = 'https://smartparking-production-dee6.up.railway.app/parking/graficas';

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  useEffect(() => {
    const fetchCuposData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/cupos`, { params: { mes: selectedMonth } });
        setCuposData(response.data);
      } catch (error) {
        console.error('Error al cargar datos de cupos:', error);
      }
    };
    fetchCuposData();
  }, [selectedMonth]);

  useEffect(() => {
    const fetchIngresosData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/ingresos`, { params: { semana: selectedWeek } });
        setIngresosData(response.data);
      } catch (error) {
        console.error('Error al cargar datos de ingresos:', error);
      }
    };
    fetchIngresosData();
  }, [selectedWeek]);

  useEffect(() => {
    const fetchUtilizacionData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/utilizacion`, { params: { anio: selectedYear } });
        setUtilizacionData(response.data);
      } catch (error) {
        console.error('Error al cargar datos de utilización:', error);
      }
    };
    fetchUtilizacionData();
  }, [selectedYear]);

  const chartCupos = {
    options: {
      chart: { id: 'cupos-chart' },
      xaxis: {
        categories: cuposData.map(item => new Date(item.dia).toLocaleDateString()),
        title: { text: 'Día' }
      },
      title: { text: `Cupos en el Mes ${selectedMonth}`, align: 'center' }
    },
    series: [{
      name: 'Total cupos',
      data: cuposData.map(item => item.total)
    }]
  };

  const chartIngresos = {
    options: {
      chart: { id: 'ingresos-chart' },
      xaxis: {
        categories: ingresosData.map(item => `Semana ${item.semana}`),
        title: { text: 'Semana' }
      },
      title: { text: `Ingresos en la Semana ${selectedWeek}`, align: 'center' }
    },
    series: [{
      name: 'Ingresos',
      data: ingresosData.map(item => parseFloat(item.total_ingresos))
    }]
  };

  const chartUtilizacion = {
    options: {
      chart: { id: 'utilizacion-chart' },
      xaxis: {
        categories: utilizacionData.map(item => item.cajon),
        title: { text: 'Cajón' }
      },
      yaxis: {
        labels: {
          formatter: val => `${(val * 100).toFixed(2)}%`
        }
      },
      title: { text: `Utilización de Cajones en el Año ${selectedYear}`, align: 'center' }
    },
    series: [{
      name: 'Utilización',
      data: utilizacionData.map(item => parseFloat(item.porcentaje_uso))
    }]
  };

  return (
    <>
      <Menu />
      <div className="content-container container">
        <h2 className="text-2xl font-bold text-center mb-4">Gráficas</h2>

        <FormControl fullWidth className="mb-4">
          <InputLabel id="select-month-label">Selecciona el Mes</InputLabel>
          <Select labelId="select-month-label" value={selectedMonth} onChange={handleMonthChange}>
            {[...Array(12)].map((_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString('es-ES', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="mb-5">
          <ApexChart options={chartCupos.options} series={chartCupos.series} type="bar" height={300} />
        </div>

        <FormControl fullWidth className="mb-4">
          <InputLabel id="select-week-label">Selecciona la Semana</InputLabel>
          <Select labelId="select-week-label" value={selectedWeek} onChange={handleWeekChange}>
            {[...Array(52)].map((_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                Semana {index + 1}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="mb-5">
          <ApexChart options={chartIngresos.options} series={chartIngresos.series} type="line" height={300} />
        </div>

        <FormControl fullWidth className="mb-4">
          <InputLabel id="select-year-label">Selecciona el Año</InputLabel>
          <Select labelId="select-year-label" value={selectedYear} onChange={handleYearChange}>
            {[2023, 2024, 2025].map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className="mb-5">
          <ApexChart options={chartUtilizacion.options} series={chartUtilizacion.series} type="bar" height={300} />
        </div>
      </div>
    </>
  );
};

export default Graficas;