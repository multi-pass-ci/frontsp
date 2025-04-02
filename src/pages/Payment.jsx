import React, { useState, useEffect } from 'react';
import Menu from "../components/Menu";
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';

const PublicUserExit = () => {
  const [formData, setFormData] = useState({
    cb: '', // Código de barras
    salida: '', // Hora de salida (HH:MM)
    pago: '', // Monto del pago
    status: 'Pagado' // Estado del pago
  });

  const [registroInfo, setRegistroInfo] = useState(null);
  const [registroExitoso, setRegistroExitoso] = useState(null);
  const [loading, setLoading] = useState(false);
  const [horaActual, setHoraActual] = useState('');

  // Actualizar hora actual cada minuto
  useEffect(() => {
    const updateHoraActual = () => {
      const now = new Date();
      const horas = String(now.getHours()).padStart(2, '0');
      const minutos = String(now.getMinutes()).padStart(2, '0');
      setHoraActual(`${horas}:${minutos}`);
    };

    updateHoraActual();
    const interval = setInterval(updateHoraActual, 60000);

    return () => clearInterval(interval);
  }, []);

  const generatePDFTicket = () => {
    if (!registroExitoso) return;

    const doc = new jsPDF();

    // Tamaño del documento (por defecto A4: 210mm x 297mm)
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // --- Configuración del documento ---
    doc.setFont('helvetica');
    doc.setTextColor(40);

    // --- Logo en esquina superior derecha ---
    const logo = '/public/estacion.jpeg'; // Ruta a tu logo
    const logoWidth = 20; // Ancho del logo en mm
    const logoHeight = 15; // Alto del logo en mm (mantiene proporción)
    const logoMargin = 10; // Margen desde los bordes

    doc.addImage(
      logo,
      'JPEG',
      pageWidth - logoWidth - logoMargin, // Posición X (esquina derecha con margen)
      logoMargin, // Posición Y (margen superior)
      logoWidth,
      logoHeight
    );

    // --- Título centrado ---
    doc.setFontSize(16);
    doc.text('COMPROBANTE DE SALIDA', pageWidth / 2, 25, { align: 'center' });

    // --- Línea divisoria ---
    doc.setDrawColor(200);
    doc.line(20, 30, pageWidth - 20, 30);

    // --- Detalles del ticket ---
    doc.setFontSize(12);
    const detailsStartY = 40;
    const lineHeight = 10;

    doc.text(`Matrícula: ${registroExitoso.matricula || '--'}`, 20, detailsStartY);
    doc.text(`Cajón: ${registroExitoso.cajon_numero || '--'}`, 20, detailsStartY + lineHeight);
    doc.text(`Fecha entrada: ${new Date(registroExitoso.fecha).toLocaleDateString() || '--'}`, 20, detailsStartY + lineHeight * 2);
    doc.text(`Hora entrada: ${registroExitoso.entrada || '--'}`, 20, detailsStartY + lineHeight * 3);
    doc.text(`Hora salida: ${registroExitoso.salida || '--'}`, 20, detailsStartY + lineHeight * 4);
    doc.text(`Tiempo estancia: ${calculateTimeDifference(registroExitoso.entrada, registroExitoso.salida)}`, 20, detailsStartY + lineHeight * 5);
    doc.text(`Monto pagado: $${registroExitoso.pago ? parseFloat(registroExitoso.pago).toFixed(2) : '0.00'}`, 20, detailsStartY + lineHeight * 6);
    doc.text(`Estado: ${registroExitoso.status}`, 20, detailsStartY + lineHeight * 7);

    // --- Texto del código de barras ---
    // doc.setFontSize(10);
    // doc.text(
    //   `Código: ${registroExitoso.cb || '--'}`,
    //   pageWidth / 2,
    //   detailsStartY + lineHeight * 8 + 10,
    //   { align: 'center' }
    // );

    // --- Textos del footer ---
    doc.setFontSize(8);
    doc.setTextColor(100);
    const footerY = detailsStartY + lineHeight * 8 + 12;

    doc.text('Gracias por su visita', pageWidth / 2, footerY, { align: 'center' });
    doc.text('¡Vuelva pronto!', pageWidth / 2, footerY + 5, { align: 'center' });

    // --- Guardar el PDF ---
    doc.save(`comprobante_salida_${registroExitoso.cb || 'estacionamiento'}.pdf`);
  };

  const calculateTimeDifference = (entrada, salida) => {
    if (!entrada || !salida) return '--';

    try {
      const [entradaH, entradaM] = entrada.split(':').map(Number);
      const [salidaH, salidaM] = salida.split(':').map(Number);

      let horas = salidaH - entradaH;
      let minutos = salidaM - entradaM;

      if (minutos < 0) {
        horas--;
        minutos += 60;
      }

      return `${horas}h ${minutos}m`;
    } catch {
      return '--';
    }
  };

  // Buscar registro por código de barras
  const buscarRegistro = async (cb) => {
    try {
      setLoading(true);

      const response = await fetch(`http://localhost:4000/parking/registros/${cb}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registro no encontrado');
      }

      // Verificar si ya tiene salida registrada
      if (data.salida) {
        throw new Error('Este vehículo ya tiene registrada su salida');
      }

      setRegistroInfo(data);

      // Establecer valores por defecto
      setFormData(prev => ({
        ...prev,
        salida: horaActual,
        status: 'Pagado'
      }));

    } catch (error) {
      toast.error(error.message);
      setRegistroInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'pago' ? (value === '' ? '' : parseFloat(value)) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!registroInfo) {
      toast.error('Debe buscar primero un registro');
      return;
    }

    try {
      // Convertir HH:MM a HH:MM:00 para el backend
      const salidaCompleta = `${formData.salida}:00`;

      const response = await fetch(`http://localhost:4000/parking/registros/${formData.cb}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          salida: salidaCompleta,
          pago: formData.pago === '' ? 0 : formData.pago,
          status: formData.status,
          cajon_id: registroInfo.cajon_id
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar salida');
      }

      toast.success(`Salida registrada para matricula ${registroInfo.matricula}`);

      // Guardar datos para mostrar en la pantalla de éxito
      setRegistroExitoso({
        ...registroInfo,
        salida: formData.salida,
        pago: formData.pago,
        status: formData.status
      });

      // Resetear el formulario
      setFormData({
        cb: '',
        salida: '',
        pago: '',
        status: 'Pagado'
      });
      setRegistroInfo(null);

    } catch (error) {
      toast.error(error.message);
      console.error(error);
    }
  };

  const handleNuevoRegistro = () => {
    setRegistroExitoso(null);
  };

  return (
    <>
      <Menu />
      <div className="content-container">
        <div className="container">
          <h2 className="font-bold text-center mb-4">Registro de salida - Usuario público</h2>

          {!registroExitoso ? (
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <div className="card mb-4">
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Buscar vehículo por código de barras:</label>
                      <div className="input-group">
                        <input
                          type="text"
                          name="cb"
                          className="form-control"
                          value={formData.cb}
                          onChange={handleInputChange}
                          placeholder="Ej: 002"
                          disabled={!!registroInfo}
                        />
                        <button
                          className="btn btn-primary"
                          type="button"
                          onClick={() => buscarRegistro(formData.cb)}
                          disabled={!formData.cb || loading || !!registroInfo}
                        >
                          {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                        {registroInfo && (
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => {
                              setFormData({
                                cb: '',
                                salida: '',
                                pago: '',
                                status: 'Pagado'
                              });
                              setRegistroInfo(null);
                            }}
                          >
                            Cambiar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {registroInfo && (
                  <form onSubmit={handleSubmit}>
                    <div className="card mb-3">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Información del vehículo</h5>
                      </div>
                      <div className="card-body">
                        <div className="row mb-2">
                          <div className="col-md-6">
                            <strong>Código de barras:</strong> {registroInfo.cb}
                          </div>
                          <div className="col-md-6">
                            <strong>Matrícula:</strong> {registroInfo.matricula}
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-6">
                            <strong>Cajón:</strong> {registroInfo.cajon_numero}
                          </div>
                          <div className="col-md-6">
                            <strong>Estado:</strong> {registroInfo.status}
                          </div>
                        </div>
                        <div className="row mb-2">
                          <div className="col-md-6">
                            <strong>Fecha:</strong> {new Date(registroInfo.fecha).toLocaleDateString()}
                          </div>
                          <div className="col-md-6">
                            <strong>Hora de entrada:</strong> {registroInfo.entrada}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card mb-4">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Registrar salida</h5>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label">Hora de salida:</label>
                          <input
                            type="time"
                            name="salida"
                            className="form-control"
                            value={formData.salida}
                            onChange={handleInputChange}
                            required
                          />
                          <small className="text-muted">Hora actual: {horaActual}</small>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Monto a pagar:</label>
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                              type="number"
                              name="pago"
                              className="form-control"
                              value={formData.pago}
                              onChange={handleInputChange}
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Estado de pago:</label>
                          <select
                            name="status"
                            className="form-select"
                            value={formData.status}
                            onChange={handleInputChange}
                            required
                          >
                            <option value="Pagado">Pagado</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="d-grid gap-2">
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                      >
                        {loading ? 'Procesando...' : 'Registrar salida'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6 text-center">
                <h4 className="text-success mb-4">¡Salida registrada exitosamente!</h4>

                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Detalles de la salida</h5>
                    <p><strong>Matrícula:</strong> {registroExitoso.matricula || '--'}</p>
                    <p><strong>Cajón:</strong> {registroExitoso.cajon_numero || '--'}</p>
                    <p><strong>Fecha entrada:</strong> {new Date(registroExitoso.fecha).toLocaleDateString() || '--'}</p>
                    <p><strong>Hora entrada:</strong> {registroExitoso.entrada || '--'}</p>
                    <p><strong>Hora salida:</strong> {registroExitoso.salida || '--'}</p>
                    <p><strong>Tiempo estancia:</strong> {calculateTimeDifference(registroExitoso.entrada, registroExitoso.salida)}</p>
                    <p><strong>Monto pagado:</strong> ${registroExitoso.pago ? parseFloat(registroExitoso.pago).toFixed(2) : '0.00'}</p>
                    <p><strong>Estado:</strong> {registroExitoso.status}</p>
                  </div>
                </div>

                <div className="d-flex justify-content-center gap-3">
                  <button
                    onClick={generatePDFTicket}
                    className="btn btn-danger"
                  >
                    <i className="bi bi-file-earmark-pdf me-2"></i>
                    Descargar Comprobante
                  </button>
                  <button
                    onClick={handleNuevoRegistro}
                    className="btn btn-primary"
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Nueva Salida
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PublicUserExit;