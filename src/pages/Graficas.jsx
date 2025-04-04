import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from '../components/Menu';
import ApexChart from 'react-apexcharts';

const Graficas = () => {
  const [cuposData, setCuposData] = useState([]);
  const [ingresosData, setIngresosData] = useState([]);
  const [tiemposData, setTiemposData] = useState([]);

  const objetivoCupos = 100;
  const objetivoIngresos = 1500;
  const objetivoTiempos = 80;

  useEffect(() => {
    fetch('https://smartparking-production-dee6.up.railway.app/parking/graficas/cupos')
      .then(res => res.json())
      .then(data => setCuposData(data));

    fetch('https://smartparking-production-dee6.up.railway.app/parking/graficas/ingresos')
      .then(res => res.json())
      .then(data => setIngresosData(data));

    fetch('https://smartparking-production-dee6.up.railway.app/parking/graficas/utilizacion')
      .then(res => res.json())
      .then(data => setTiemposData(data));
  }, []);

  const opcionesBasicas = {
    chart: { type: 'bar' },
    dataLabels: { enabled: true },
    plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
    xaxis: { categories: [] },
  };

  return (
    <>
      <Menu />
      <div className="content-container">
        <div className="container">
          <h2 className="text-2xl font-bold text-center mb-4">Gráficas</h2>

          <div className="mb-5">
            <h4>Gráfica de Cupos por Día (vs. objetivo)</h4>
            <ApexChart
              type="bar"
              series={[{
                name: 'Cupos diarios',
                data: cuposData.map(d => d.total),
              }, {
                name: 'Objetivo',
                data: cuposData.map(() => objetivoCupos)
              }]}
              options={{
                ...opcionesBasicas,
                xaxis: { categories: cuposData.map(d => `${d.dia}/${d.mes}`) }
              }}
              height={350}
            />
          </div>

          <div className="mb-5">
            <h4>Gráfica de Ingresos por Semana</h4>
            <ApexChart
              type="line"
              series={[{
                name: 'Ingresos semana actual',
                data: ingresosData.map(d => d.actual)
              }, {
                name: 'Ingresos semana año pasado',
                data: ingresosData.map(d => d.anterior)
              }, {
                name: 'Objetivo',
                data: ingresosData.map(() => objetivoIngresos)
              }]}
              options={{
                chart: { type: 'line' },
                xaxis: { categories: ingresosData.map(d => `Semana ${d.semana}`) },
              }}
              height={350}
            />
          </div>

          <div className="mb-5">
            <h4>Porcentaje de Utilización por Cajón</h4>
            <ApexChart
              type="bar"
              series={[{
                name: 'Uso actual (%)',
                data: tiemposData.map(d => d.actual)
              }, {
                name: 'Año pasado (%)',
                data: tiemposData.map(d => d.anterior)
              }, {
                name: 'Objetivo (%)',
                data: tiemposData.map(() => objetivoTiempos)
              }]}
              options={{
                ...opcionesBasicas,
                xaxis: { categories: tiemposData.map(d => d.cajon) }
              }}
              height={350}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Graficas;
