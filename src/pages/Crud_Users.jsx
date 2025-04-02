import React, { useState, useEffect } from 'react';
import Menu from "../components/Menu";
import { getUsers, createUser, updateUser, deleteUser, getUserById } from '../api/Crud';
import { toast } from 'react-toastify';

const CrudUsers = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        tipo: 'Cliente',
        estado: 'Activo',
        contrasena: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cargar usuarios al montar el componente
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar usuarios');
            console.error(err);
        } finally {
            setLoading(false);
        }
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

        try {
            if (editingId) {
                await updateUser(editingId, formData);
            } else {
                await createUser(formData);
            }

            await fetchUsers();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message ||
                (editingId ? 'Error al actualizar usuario' : 'Error al crear usuario'));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = async (id) => {
        try {
            const user = await getUserById(id);
            setFormData({
                nombre: user.nombre,
                correo: user.correo,
                tipo: user.tipo,
                estado: user.estado,
                contrasena: ''
            });
            setEditingId(id);
            setShowForm(true);
        } catch (err) {
            setError('Error al cargar usuario para editar');
            console.error(err);
        }
    };


    const handleDelete = async (id) => {
        // Mostrar confirmación personalizada con Toastify
        toast.info(
            <div>
                <p>¿Estás seguro de eliminar este usuario?</p>
                <div className="d-flex justify-content-around mt-2">
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                            toast.dismiss(); // Cierra el toast de confirmación
                            executeDelete(id); // Ejecuta la eliminación
                        }}
                    >
                        Sí, eliminar
                    </button>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => toast.dismiss()}
                    >
                        Cancelar
                    </button>
                </div>
            </div>,
            {
                position: "top-center",
                autoClose: false, // No se cierra automáticamente
                closeButton: false, // Ocultamos el botón de cierre estándar
                draggable: false,
            }
        );
    };

    const executeDelete = async (id) => {
        setLoading(true);
        try {
            await deleteUser(id);
            await fetchUsers();
            toast.success("Usuario eliminado correctamente");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Error al eliminar usuario");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            correo: '',
            tipo: 'Cliente',
            estado: 'Activo',
            contrasena: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const displayUserType = (type) => {
        switch (type) {
            case 3: return 'Administrador';
            case 2: return 'Empleado';
            case 1: return 'Cliente';
            default: return type;
        }
    };

    return (
        <>
            <Menu />
            <div className="content-container">
                <div className="p-3">
                    <div className="mt-3">
                        <h2 className="text-2xl font-bold text-center mb-3">Lista de Usuarios</h2>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="d-flex justify-content-start mt-2 mb-2">
                            <button
                                className="btn btn-success ms-2"
                                onClick={() => {
                                    resetForm();
                                    setShowForm(true);
                                }}
                                disabled={loading}
                            >
                                {loading ? 'Cargando...' : 'Agregar Usuario'}
                            </button>
                        </div>

                        {showForm && (
                            <div className="card mb-3">
                                <div className="card-body">
                                    <h3 className="card-title">
                                        {editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
                                    </h3>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label">Nombre</label>
                                            <input
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleInputChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Correo</label>
                                            <input
                                                type="email"
                                                name="correo"
                                                value={formData.correo}
                                                onChange={handleInputChange}
                                                className="form-control"
                                                required
                                            />
                                        </div>

                                        {!editingId && (
                                            <div className="mb-3">
                                                <label className="form-label">Contraseña</label>
                                                <input
                                                    type="password"
                                                    name="contrasena"
                                                    value={formData.contrasena}
                                                    onChange={handleInputChange}
                                                    className="form-control"
                                                    required={!editingId}
                                                    minLength="3"
                                                />
                                            </div>
                                        )}

                                        <div className="mb-3">
                                            <label className="form-label">Tipo</label>
                                            <select
                                                name="tipo"
                                                value={formData.tipo}
                                                onChange={handleInputChange}
                                                className="form-select"
                                                required
                                            >
                                                <option value="Administrador">Administrador</option>
                                                <option value="Empleado">Empleado</option>
                                                <option value="Cliente">Cliente</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Estado</label>
                                            <select
                                                name="estado"
                                                value={formData.estado}
                                                onChange={handleInputChange}
                                                className="form-select"
                                                required
                                            >
                                                <option value="Activo">Activo</option>
                                                <option value="Inactivo">Inactivo</option>
                                            </select>
                                        </div>

                                        <div className="d-flex justify-content-end gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={resetForm}
                                                disabled={loading}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={loading}
                                            >
                                                {loading ? 'Guardando...' : 'Guardar'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {loading && !showForm ? (
                            <div className="text-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Correo</th>
                                            <th>Tipo</th>
                                            <th>Estado</th>
                                            <th className="text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="text-center">No hay usuarios registrados</td>
                                            </tr>
                                        ) : (
                                            users.map((user) => (
                                                <tr key={user.id}>
                                                    <td>{user.nombre}</td>
                                                    <td>{user.correo}</td>
                                                    <td>{displayUserType(user.tipo)}</td>
                                                    <td>{user.estado}</td>
                                                    <td className="text-center">
                                                        <button
                                                            onClick={() => handleEdit(user.id)}
                                                            className="btn btn-warning btn-sm me-2"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(user.id)}
                                                            className="btn btn-danger btn-sm"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CrudUsers;