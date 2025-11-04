'use client'; 

import { useState, useEffect, useMemo } from 'react';
import Toast from '@/components/Toast';

// --- Definición de Tipos ---
type Productora = { Codigo: number; Nombre: string };
type Pais = { Codigo: number; Nombre: string };
type Director = { Codigo: number; Nombre: string };
type Empleado = { Codigo: number; Nombre: string };
type PeliculaConRelaciones = {
  Codigo: number; Nombre: string | null; Fecha_Estreno: string | null;
  Id_Productora: number | null; Id_Pais: number | null; Id_Director: number | null; Id_Empleado: number | null;
  Productora?: { Nombre: string }; Pais?: { Nombre: string }; Director?: { Nombre: string }; Empleado?: { Nombre: string };
};

export default function PeliculasPage() {
  // --- Estados para los combos ---
  const [productoras, setProductoras] = useState<Productora[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [directores, setDirectores] = useState<Director[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [listaPeliculas, setListaPeliculas] = useState<PeliculaConRelaciones[]>([]);

  // --- Estados para los campos del formulario ---
  const [nombre, setNombre] = useState('');
  const [fechaEstreno, setFechaEstreno] = useState('');
  const [productoraId, setProductoraId] = useState('');
  const [paisId, setPaisId] = useState('');
  const [directorId, setDirectorId] = useState('');
  const [empleadoId, setEmpleadoId] = useState('');

  const [codigoActual, setCodigoActual] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // --- Cargar datos ---
  useEffect(() => { cargarDatos(); }, []);
  const cargarDatos = async () => {
    fetch('/api/productoras').then(res => res.json()).then(setProductoras);
    fetch('/api/paises').then(res => res.json()).then(setPaises);
    fetch('/api/directores').then(res => res.json()).then(setDirectores);
    fetch('/api/empleados').then(res => res.json()).then(setEmpleados);
    fetch('/api/peliculas').then(res => res.json()).then(setListaPeliculas);
  };

  // --- Función para limpiar el formulario ---
  const limpiarFormulario = () => {
    setNombre(''); setFechaEstreno(''); setProductoraId('');
    setPaisId(''); setDirectorId(''); setEmpleadoId('');
    setCodigoActual(null);
  };

  // --- Recolectar datos del formulario (helper) ---
  const recolectarDatos = () => {
    if (!nombre || !fechaEstreno || !productoraId || !paisId || !directorId || !empleadoId) {
      setToast({ message: 'Todos los campos son requeridos.', type: 'error' });
      return null;
    }
    return {
      Nombre: nombre, Fecha_Estreno: new Date(fechaEstreno),
      Id_Productora: parseInt(productoraId), Id_Pais: parseInt(paisId),
      Id_Director: parseInt(directorId), Id_Empleado: parseInt(empleadoId),
    };
  };

  // --- Lógica de Botones ---
  const handleAgregar = async () => {
    const datosPelicula = recolectarDatos(); if (!datosPelicula) return;
    try {
      const res = await fetch('/api/peliculas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datosPelicula) });
      if (!res.ok) throw new Error('Error al agregar');
      limpiarFormulario(); cargarDatos();
      setToast({ message: '¡Película agregada con éxito!', type: 'success' });
    } catch (error) { setToast({ message: 'Hubo un error al agregar.', type: 'error' }); }
  };

  const handleCargarParaEditar = (pelicula: PeliculaConRelaciones) => {
    const fecha = pelicula.Fecha_Estreno ? new Date(pelicula.Fecha_Estreno).toISOString().split('T')[0] : '';
    setNombre(pelicula.Nombre || ''); setFechaEstreno(fecha);
    setProductoraId(pelicula.Id_Productora?.toString() || '');
    setPaisId(pelicula.Id_Pais?.toString() || '');
    setDirectorId(pelicula.Id_Director?.toString() || '');
    setEmpleadoId(pelicula.Id_Empleado?.toString() || '');
    setCodigoActual(pelicula.Codigo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModificar = async () => {
    const datosPelicula = recolectarDatos(); if (!datosPelicula || !codigoActual) return;
    try {
      const res = await fetch('/api/peliculas', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ Codigo: codigoActual, ...datosPelicula }) });
      if (!res.ok) throw new Error('Error al modificar');
      limpiarFormulario(); cargarDatos();
      setToast({ message: '¡Película modificada con éxito!', type: 'success' });
    } catch (error) { setToast({ message: 'Hubo un error al modificar.', type: 'error' }); }
  };

  const handleDelete = async (codigo: number) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la película ${codigo}?`)) return;
    try {
      const res = await fetch(`/api/peliculas?id=${codigo}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      cargarDatos();
      setToast({ message: '¡Película eliminada con éxito!', type: 'success' });
    } catch (error) { setToast({ message: 'Hubo un error al eliminar.', type: 'error' }); }
  };

  // Lógica de filtrado
  const peliculasFiltradas = useMemo(() => {
    return listaPeliculas.filter(peli =>
      peli.Nombre?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [listaPeliculas, searchQuery]);

  return (
    <main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* --- FORMULARIO --- */}
      <div className="form-container">
        <h1 className="form-title">
          Gestión de Películas
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="txtNombre" className="form-label">Nombre:</label>
            <input type="text" id="txtNombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="form-input" />
          </div>
          <div>
            <label htmlFor="txtFechaEstreno" className="form-label">Fecha de Estreno:</label>
            <input type="date" id="txtFechaEstreno" value={fechaEstreno} onChange={(e) => setFechaEstreno(e.target.value)} className="form-input" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="cboProductora" className="form-label">Productora:</label>
            <select id="cboProductora" value={productoraId} onChange={(e) => setProductoraId(e.target.value)} className="form-select">
              <option value="">-- Seleccione --</option>
              {productoras.map((prod) => (<option key={prod.Codigo} value={prod.Codigo}>{prod.Nombre}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="cboPais" className="form-label">País (Nacionalidad):</label>
            <select id="cboPais" value={paisId} onChange={(e) => setPaisId(e.target.value)} className="form-select">
              <option value="">-- Seleccione --</option>
              {paises.map((pais) => (<option key={pais.Codigo} value={pais.Codigo}>{pais.Nombre}</option>))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="cboDirector" className="form-label">Director:</label>
            <select id="cboDirector" value={directorId} onChange={(e) => setDirectorId(e.target.value)} className="form-select">
              <option value="">-- Seleccione --</option>
              {directores.map((dir) => (<option key={dir.Codigo} value={dir.Codigo}>{dir.Nombre}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="cboEmpleado" className="form-label">Empleado (Registró):</label>
            <select id="cboEmpleado" value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} className="form-select">
              <option value="">-- Seleccione --</option>
              {empleados.map((emp) => (<option key={emp.Codigo} value={emp.Codigo}>{emp.Nombre}</option>))}
            </select>
          </div>
        </div>

        {/* --- BOTONES --- */}
        <div className="form-button-container">
          {codigoActual === null ? (
            <button onClick={handleAgregar} className="form-button form-button-add">
              Agregar
            </button>
          ) : (
            <button onClick={handleModificar} className="form-button form-button-edit">
              Modificar
            </button>
          )}
          {codigoActual !== null && (
            <button onClick={limpiarFormulario} className="form-button form-button-cancel">
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* --- TABLA DE DATOS --- */}
      <div className="table-section-container">
        <div className="table-header-container">
          <h2 className="table-title">Lista de Películas</h2>
          <input
            type="text"
            placeholder="Buscar por Nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="table-search-input"
          />
        </div>
        <div className="table-wrapper">
          <table className="table-element">
            <thead className="table-head">
              <tr>
                <th className="table-head-cell text-center">Acciones</th>
                <th className="table-head-cell text-left">Código</th>
                <th className="table-head-cell text-left">Nombre</th>
                <th className="table-head-cell text-left">Fecha Estreno</th>
                <th className="table-head-cell text-left">Productora</th>
                <th className="table-head-cell text-left">País</th>
                <th className="table-head-cell text-left">Director</th>
                <th className="table-head-cell text-left">Empleado</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {peliculasFiltradas.map((pelicula) => (
                <tr key={pelicula.Codigo} className="table-body-row">
                  <td className="table-body-cell">
                    <div className="flex justify-center gap-4">
                      <button onClick={() => handleCargarParaEditar(pelicula)} className="table-action-button table-action-edit" title="Editar">✏️</button>
                      <button onClick={() => handleDelete(pelicula.Codigo)} className="table-action-button table-action-delete" title="Eliminar">🗑️</button>
                    </div>
                  </td>
                  <td className="table-body-cell">{pelicula.Codigo}</td>
                  <td className="table-body-cell">{pelicula.Nombre}</td>
                  <td className="table-body-cell">{pelicula.Fecha_Estreno ? new Date(pelicula.Fecha_Estreno).toLocaleDateString() : ''}</td>
                  <td className="table-body-cell">{pelicula.Productora?.Nombre}</td>
                  <td className="table-body-cell">{pelicula.Pais?.Nombre}</td>
                  <td className="table-body-cell">{pelicula.Director?.Nombre}</td>
                  <td className="table-body-cell">{pelicula.Empleado?.Nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}