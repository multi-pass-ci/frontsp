import React, { useState, useEffect } from 'react';
import Menu from "../components/Menu";
import "bootstrap-icons/font/bootstrap-icons.css";
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const CrudRegistros = () => {
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        fecha: '',
        status: '',
        cajon: '',
        matricula: '',
        tipo: ''
    });

    // Obtener registros al cargar el componente
    useEffect(() => {
        const fetchRegistros = async () => {
            try {
                const response = await fetch('http://localhost:4000/parking/registros');
                if (!response.ok) {
                    throw new Error('Error al obtener los registros');
                }
                const data = await response.json();
                setRegistros(data);
            } catch (err) {
                setError(err.message);
                toast.error('Error al cargar registros');
            } finally {
                setLoading(false);
            }
        };

        fetchRegistros();
    }, []);

    // Filtrar registros
    const filteredRegistros = registros.filter(registro => {
        const fechaMatch = filters.fecha ?
            new Date(registro.fecha).toISOString().split('T')[0] === filters.fecha :
            true;

        const statusMatch = filters.status ?
            registro.status === filters.status :
            true;

        const tipoMatch = filters.tipo ?
            registro.tipo === filters.tipo :
            true;

        const cajonMatch = filters.cajon ?
            registro.cajon_numero?.toString() === filters.cajon.toString() :
            true;

        const matriculaMatch = filters.matricula ?
            registro.matricula?.toLowerCase().includes(filters.matricula.toLowerCase()) :
            true;

        return fechaMatch && tipoMatch && statusMatch && cajonMatch && matriculaMatch;
    });

    // Formatear fecha para mostrar
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-MX');
    };

    // Estilo para los tipos de registro
    const getTipoBadge = (tipo) => {
        switch (tipo) {
            case 'Publico':
                return <span className="badge bg-success">Público</span>;
            case 'Reserva':
                return <span className="badge bg-warning text-dark">Reserva</span>;
            default:
                return <span className="badge bg-secondary">{tipo || 'N/A'}</span>;
        }
    };

    // Estilo para los estados
    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pagado':
                return <span className="badge bg-success">Pagado</span>;
            case 'Pendiente':
                return <span className="badge bg-warning text-dark">Pendiente</span>;
            case 'Cancelado':
                return <span className="badge bg-danger">Cancelado</span>;
            default:
                return <span className="badge bg-secondary">{status || 'N/A'}</span>;
        }
    };

    // Generar PDF con los registros filtrados
    const generatePDF = () => {
        if (filteredRegistros.length === 0) {
            toast.warning('No hay registros para generar el reporte');
            return;
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 15;

        // Logo y título
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('Reporte de Registros de Estacionamiento', pageWidth / 2, 20, { align: 'center' });

        // Información de filtros aplicados
        doc.setFontSize(10);
        doc.setTextColor(100);

        let filtersText = 'Filtros aplicados: ';
        if (filters.fecha) filtersText += `Fecha: ${filters.fecha} `;
        if (filters.status) filtersText += `Estado: ${filters.status} `;
        if (filters.tipo) filtersText += `Tipo: ${filters.tipo} `;
        if (filters.cajon) filtersText += `Cajón: ${filters.cajon} `;
        if (filters.matricula) filtersText += `Matrícula: ${filters.matricula} `;

        if (filtersText === 'Filtros aplicados: ') {
            filtersText = 'Mostrando todos los registros';
        }

        doc.text(filtersText, margin, 30);

        // Fecha de generación del reporte
        doc.text(`Generado el: ${new Date().toLocaleDateString('es-MX')}`, pageWidth - margin, 30, { align: 'right' });

        // Datos de la tabla
        const headers = [
            'Código',
            'Matrícula',
            'Cajón',
            'Fecha',
            'Entrada',
            'Salida',
            'Pago',
            'Estado',
            'Usuario',
            'Tipo'
        ];

        const data = filteredRegistros.map(registro => [
            registro.cb || 'N/A',
            registro.matricula || 'N/A',
            registro.cajon_numero || 'N/A',
            formatDate(registro.fecha),
            registro.entrada?.substring(0, 5) || 'N/A',
            registro.salida?.substring(0, 5) || '',
            `$${registro.pago || '0.00'}`,
            registro.status || 'N/A',
            registro.usuario_nombre || 'Público',
            registro.tipo || 'N/A'
        ]);

        // Configuración de la tabla usando autoTable
        autoTable(doc, {
            startY: 40,
            head: [headers],
            body: data,
            margin: { top: 40, right: margin, bottom: 20, left: margin },
            styles: {
                fontSize: 8,
                cellPadding: 2,
                overflow: 'linebreak'
            },
            headStyles: {
                fillColor: [25, 40, 76],
                textColor: 255,
                fontStyle: 'bold'
            },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 25 },
                2: { cellWidth: 15 },
                3: { cellWidth: 20 },
                4: { cellWidth: 15 },
                5: { cellWidth: 15 },
                6: { cellWidth: 15 },
                7: { cellWidth: 20 },
                8: { cellWidth: 20 }
            },
            didDrawPage: function (data) {
                // Footer
                doc.setFontSize(8);
                doc.setTextColor(100);
                const pageCount = doc.internal.getNumberOfPages();
                doc.text(`Página ${data.pageNumber} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
            }
        });

        // Guardar el PDF
        const fileName = `Reporte_Registros_${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    };

    return (
        <>
            <Menu />
            <div className="content-container">
                <div className="container mt-4">
                    <h2 className="text-center mb-4">Registros del estacionamiento</h2>

                    {/* Filtros */}
                    <div className="card mb-4">
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-2">
                                    <label className="form-label">Fecha</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        onChange={(e) => setFilters({ ...filters, fecha: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Estado</label>
                                    <select
                                        className="form-select"
                                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                    >
                                        <option value="">Todos</option>
                                        <option value="Pagado">Pagado</option>
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Tipo</label>
                                    <select
                                        className="form-select"
                                        onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                                    >
                                        <option value="">Todos</option>
                                        <option value="Público">Público</option>
                                        <option value="Reserva">Reserva</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Cajón</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: A1"
                                        onChange={(e) => setFilters({ ...filters, cajon: e.target.value })}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label">Matrícula</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: UNR-61-98"
                                        onChange={(e) => setFilters({ ...filters, matricula: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Botón para generar PDF */}
                            <div className="row mt-3">
                                <div className="col-12 d-flex justify-content-end">
                                    <button
                                        className="btn btn-primary"
                                        onClick={generatePDF}
                                        disabled={loading || filteredRegistros.length === 0}
                                    >
                                        <i className="bi bi-file-earmark-pdf me-2"></i>
                                        Generar Reporte
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info de resultados */}
                    <div className="alert alert-info mb-3">
                        Mostrando <strong>{filteredRegistros.length}</strong> registros
                        {filters.fecha || filters.status || filters.tipo || filters.cajon || filters.matricula ?
                            ' (con filtros aplicados)' : ' (todos los registros)'}
                    </div>

                    {/* Tabla de registros */}
                    <div className="card">
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Cargando...</span>
                                    </div>
                                    <p>Cargando registros...</p>
                                </div>
                            ) : error ? (
                                <div className="alert alert-danger">{error}</div>
                            ) : filteredRegistros.length === 0 ? (
                                <div className="alert alert-warning">No se encontraron registros</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead>
                                            <tr className='table-dark'>
                                                <th>Código</th>
                                                <th>Matrícula</th>
                                                <th>Cajón</th>
                                                <th>Fecha</th>
                                                <th>Entrada</th>
                                                <th>Salida</th>
                                                <th>Pago</th>
                                                <th>Estado</th>
                                                <th>Usuario</th>
                                                <th>Tipo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredRegistros.map((registro) => (
                                                <tr key={registro.id}>
                                                    <td>{registro.cb || 'N/A'}</td>
                                                    <td>{registro.matricula || 'N/A'}</td>
                                                    <td className='text-start'>{registro.cajon_numero || 'N/A'}</td>
                                                    <td>{formatDate(registro.fecha)}</td>
                                                    <td>{registro.entrada || 'N/A'}</td>
                                                    <td>{registro.salida || ''}</td>
                                                    <td>${registro.pago || '0.00'}</td>
                                                    <td>{getStatusBadge(registro.status)}</td>
                                                    <td>{registro.usuario_nombre || 'Público'}</td>
                                                    <td>{getTipoBadge(registro.tipo)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CrudRegistros;