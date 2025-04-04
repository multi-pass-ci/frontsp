import React, { useState, useEffect, useRef } from 'react';
import Menu from "../components/Menu";
import { toast } from 'react-toastify';
import JsBarcode from 'jsbarcode';
import jsPDF from 'jspdf';

const PublicUserEntry = () => {
  const [formData, setFormData] = useState({
    matricula: '',
    cajonId: '',
    fecha: '',
    hora: ''
  });

  const [registroExitoso, setRegistroExitoso] = useState(null);
  const [loading, setLoading] = useState(false);
  const [barcodeImage, setBarcodeImage] = useState(null);
  const barcodeRef = useRef(null);

  const [cajonesDisponibles, setCajonesDisponibles] = useState([
    { id: 1, numero: 'A1', disponible: true },
    { id: 2, numero: 'A2', disponible: true },
    { id: 3, numero: 'A3', disponible: true },
    { id: 4, numero: 'A4', disponible: true },
    { id: 5, numero: 'A5', disponible: true },
  ]);

  // Generar código de barras cuando cambie registroExitoso
  useEffect(() => {
    if (registroExitoso?.cb && barcodeRef.current) {
      try {
        JsBarcode(barcodeRef.current, registroExitoso.cb, {
          format: "CODE128",
          width: 2,
          height: 100,
          displayValue: true,
          margin: 10
        });

        // Convertir a imagen para descarga
        const canvas = barcodeRef.current;
        const image = canvas.toDataURL('image/png');
        setBarcodeImage(image);
        localStorage.setItem(`barcode_${registroExitoso.cb}`, image);
      } catch (error) {
        console.error('Error al generar código de barras:', error);
      }
    }
  }, [registroExitoso]);

  const generatePDFTicket = () => {
    if (!registroExitoso || !barcodeImage) return;
  
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
    doc.text('TICKET DE ESTACIONAMIENTO', pageWidth / 2, 25, { align: 'center' });
  
    // --- Línea divisoria ---
    doc.setDrawColor(200);
    doc.line(20, 30, pageWidth - 20, 30);
  
    // --- Detalles del ticket ---
    doc.setFontSize(12);
    const detailsStartY = 40;
    const lineHeight = 10;
    
    doc.text(`Matrícula: ${registroExitoso.matricula || '--'}`, 20, detailsStartY);
    doc.text(`Cajón: ${registroExitoso.cajon_numero || registroExitoso.cajon_id || '--'}`, 20, detailsStartY + lineHeight);
    doc.text(`Fecha: ${registroExitoso.fecha || '--'}`, 20, detailsStartY + lineHeight * 2);
    doc.text(`Hora entrada: ${formatHoraEntrada(registroExitoso.entrada)}`, 20, detailsStartY + lineHeight * 3);
  
    // --- Código de barras centrado ---
    // AJUSTA ESTOS VALORES PARA CAMBIAR EL TAMAÑO DEL CÓDIGO DE BARRAS
    const barcodeWidth = 50;  // Cambia este valor para ajustar el ancho
    const barcodeHeight = 30; // Cambia este valor para ajustar el alto
    const barcodeY = detailsStartY + lineHeight * 4 + 10; // 10mm después de los detalles
    
    doc.addImage(
      barcodeImage, 
      'PNG', 
      (pageWidth - barcodeWidth) / 2, // Centrado horizontalmente
      barcodeY, 
      barcodeWidth, 
      barcodeHeight
    );
  
    // --- Texto del código debajo del código de barras ---
    doc.setFontSize(10);
    doc.text(
      `Código: ${registroExitoso.cb || '--'}`, 
      pageWidth / 2, 
      barcodeY + barcodeHeight + 5, // 5mm debajo del código
      { align: 'center' }
    );

    // --- Textos del footer debajo del código de barras ---
    doc.setFontSize(8);
    doc.setTextColor(100);
    const footerY = barcodeY + barcodeHeight + 15; // 15mm debajo del código de barras
    
    doc.text('Conserve este ticket durante su estancia', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Presentarlo al momento de salir', pageWidth / 2, footerY + 5, { align: 'center' });
  
    // --- Guardar el PDF ---
    doc.save(`ticket_${registroExitoso.cb || 'estacionamiento'}.pdf`);
  };

  const getHoraActual = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.matricula) {
      toast.error('La matrícula es requerida');
      setLoading(false);
      return;
    }

    if (formData.matricula.length !== 9) {
      toast.error('La matrícula no cumple con el formato correcto');
      setLoading(false);
      return;
    }

    if (!formData.cajonId) {
      toast.error('Debe seleccionar un cajón disponible');
      setLoading(false);
      return;
    }

    if (!formData.fecha) {
      toast.error('La fecha es requerida');
      setLoading(false);
      return;
    }

    if (!formData.hora) {
      toast.error('La hora de entrada es requerida');
      setLoading(false);
      return;
    }

    try {
      const horaCompleta = `${formData.hora}:00`;

      const response = await fetch('https://smartparking-production-dee6.up.railway.app/parking/registros/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          matricula: formData.matricula,
          cajon_id: formData.cajonId,
          fecha: formData.fecha,
          entrada: horaCompleta,
          tipo: 'Público'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar entrada');
      }

      // Construir objeto registro con datos del formulario y respuesta
      const registro = {
        ...data.id, // Extraemos id, cb, usuario_id
        matricula: formData.matricula,
        cajon_id: formData.cajonId,
        cajon_numero: cajonesDisponibles.find(c => c.id == formData.cajonId)?.numero || `Cajón ${formData.cajonId}`,
        fecha: formData.fecha,
        entrada: horaCompleta,
        message: data.message
      };

      toast.success(`Entrada registrada para matrícula ${formData.matricula}`);

      setRegistroExitoso(registro);

      // Actualizar lista de cajones
      setCajonesDisponibles(prev =>
        prev.map(c => c.id == formData.cajonId ? { ...c, disponible: false } : c)
      );

    } catch (error) {
      toast.error(error.message || 'Error al registrar la entrada');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoRegistro = () => {
    setFormData({
      matricula: '',
      cajonId: '',
      fecha: '',
      hora: ''
    });
    setRegistroExitoso(null);
    setBarcodeImage(null);
  };

  const formatHoraEntrada = (hora) => {
    if (!hora) return '--:--';
    try {
      return hora.substring(0, 5); // Mostrar solo horas y minutos
    } catch {
      return hora;
    }
  };

  return (
    <>
      <Menu />
      <div className="content-container">
        <div className="container">
          <h2 className="font-bold text-center mb-4">Registro de entrada - Usuario público</h2>

          {!registroExitoso ? (
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Matrícula del vehículo:</label>
                    <input
                      type="text"
                      name="matricula"
                      className="form-control"
                      value={formData.matricula}
                      onChange={handleInputChange}
                      placeholder="Ej: ABC-00-00"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Cajón asignado:</label>
                    <select
                      name="cajonId"
                      className="form-select"
                      value={formData.cajonId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Seleccione un cajón</option>
                      {cajonesDisponibles
                        .filter(c => c.disponible)
                        .map(cajon => (
                          <option key={cajon.id} value={cajon.id}>
                            Cajón {cajon.numero}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Fecha de entrada:</label>
                    <input
                      type="date"
                      name="fecha"
                      className="form-control"
                      value={formData.fecha}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Hora de entrada:</label>
                    <input
                      type="time"
                      name="hora"
                      className="form-control"
                      value={formData.hora}
                      onChange={handleInputChange}
                      step="60"
                      required
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Registrando...' : 'Registrar entrada'}
                    </button>
                  </div>
                </form>

                <div className="mt-4">
                  <h5 className="text-center">Registro rápido</h5>
                  <div className="d-flex gap-2 justify-content-center">
                    {cajonesDisponibles
                      .filter(c => c.disponible)
                      .slice(0, 5)
                      .map(cajon => (
                        <button
                          key={cajon.id}
                          className="btn btn-outline-primary"
                          onClick={() => {
                            const hoy = new Date().toISOString().split('T')[0];
                            setFormData(prev => ({
                              ...prev,
                              cajonId: cajon.id,
                              fecha: hoy,
                              hora: getHoraActual()
                            }));
                            document.getElementsByName('matricula')[0].focus();
                          }}
                        >
                          Cajón {cajon.numero} (Ahora)
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6 text-center">
                <h4 className="text-success mb-4">¡Registro exitoso!</h4>

                <div className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">Detalles del registro</h5>
                    <p><strong>Matrícula:</strong> {registroExitoso.matricula || '--'}</p>
                    <p><strong>Cajón:</strong> {registroExitoso.cajon_numero || `Cajón ${registroExitoso.cajon_id}` || '--'}</p>
                    <p><strong>Fecha:</strong> {registroExitoso.fecha || '--'}</p>
                    <p><strong>Hora de entrada:</strong> {formatHoraEntrada(registroExitoso.entrada)}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h5>Código de barras asignado</h5>
                  <div className="d-flex justify-content-center">
                    <div className="bg-white p-2">
                      {registroExitoso.cb ? (
                        <>
                          <canvas
                            ref={barcodeRef}
                            style={{ display: 'none' }}
                          />
                          <img
                            src={barcodeImage}
                            alt={`Código de barras ${registroExitoso.cb}`}
                            className="img-fluid border p-1"
                          />
                        </>
                      ) : (
                        <p className="text-danger">No se generó código de barras</p>
                      )}
                    </div>
                  </div>

                  {barcodeImage && (
                    <div className="mt-3">
                      <div className="mt-2 d-flex justify-content-center gap-2">
                      <a
                          href={barcodeImage}
                          download={`codigo_barras_${registroExitoso.cb || 'temp'}.png`}
                          className="btn btn-sm btn-outline-secondary"
                        >
                          <i className='bi bi-image me-2'></i>
                          Descargar Código
                        </a>
                        <button
                          onClick={generatePDFTicket}
                          className="btn btn-sm btn-danger"
                        >
                          <i className="bi bi-file-earmark-pdf me-2"></i>
                          Descargar Ticket
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleNuevoRegistro}
                  className="btn btn-primary"
                >
                  Realizar nuevo registro
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PublicUserEntry;