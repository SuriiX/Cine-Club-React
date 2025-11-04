'use client'; 

import { useState, useEffect, useMemo } from 'react'; // Importamos useMemo
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

  // Estado para controlar edición
  const [codigoActual, setCodigoActual] = useState<number | null>(null);
  // Estado para manejar el Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  // ¡NUEVO! Estado para la búsqueda
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

  // ¡NUEVO! Lógica de filtrado para la búsqueda
  const peliculasFiltradas = useMemo(() => {
    return listaPeliculas.filter(peli =>
      peli.Nombre?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [listaPeliculas, searchQuery]);

  return (
    <main className="container mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-emerald-800 mb-6">
          Gestión de Películas
        </h1>
        
        {/* --- FORMULARIO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="txtNombre" className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input type="text" id="txtNombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="txtFechaEstreno" className="block text-sm font-medium text-gray-700">Fecha de Estreno:</label>
            <input type="date" id="txtFechaEstreno" value={fechaEstreno} onChange={(e) => setFechaEstreno(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="cboProductora" className="block text-sm font-medium text-gray-700">Productora:</label>
            <select id="cboProductora" value={productoraId} onChange={(e) => setProductoraId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {productoras.map((prod) => (<option key={prod.Codigo} value={prod.Codigo}>{prod.Nombre}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="cboPais" className="block text-sm font-medium text-gray-700">País (Nacionalidad):</label>
            <select id="cboPais" value={paisId} onChange={(e) => setPaisId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {paises.map((pais) => (<option key={pais.Codigo} value={pais.Codigo}>{pais.Nombre}</option>))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="cboDirector" className="block text-sm font-medium text-gray-700">Director:</label>
            <select id="cboDirector" value={directorId} onChange={(e) => setDirectorId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {directores.map((dir) => (<option key={dir.Codigo} value={dir.Codigo}>{dir.Nombre}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="cboEmpleado" className="block text-sm font-medium text-gray-700">Empleado (Registró):</label>
            <select id="cboEmpleado" value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {empleados.map((emp) => (<option key={emp.Codigo} value={emp.Codigo}>{emp.Nombre}</option>))}
            </select>
          </div>
        </div>

        {/* --- BOTONES (Con nuevos colores y sin "Buscar") --- */}
        <div className="flex justify-around items-center pt-6 border-t mt-6">
          {codigoActual === null ? (
            <button onClick={handleAgregar} className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700">
              Agregar
            </button>
          ) : (
            <button onClick={handleModificar} className="px-6 py-2 bg-yellow-600 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-700">
              Modificar
            </button>
          )}
          {codigoActual !== null && (
            <button onClick={limpiarFormulario} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700">
              Cancelar
            </button>
          )}
        </div>

        {/* --- TABLA DE DATOS (Con Búsqueda y nuevos estilos) --- */}
        <div className="mt-8 overflow-x-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Lista de Películas</h2>
            {/* ¡NUEVO! Campo de Búsqueda */}
            <input
              type="text"
              placeholder="Buscar por Nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm w-1/3"
            />
          </div>
          <table className="min-w-full bg-white">
            <thead className="bg-stone-100 text-gray-700 uppercase text-sm">
              <tr>
                <th className="px-6 py-3 text-center font-medium">Acciones</th>
                <th className="px-6 py-3 text-left font-medium">Código</th>
                <th className="px-6 py-3 text-left font-medium">Nombre</th>
                <th className="px-6 py-3 text-left font-medium">Fecha Estreno</th>
                <th className="px-6 py-3 text-left font-medium">Productora</th>
                <th className="px-6 py-3 text-left font-medium">País</th>
                <th className="px-6 py-3 text-left font-medium">Director</th>
                <th className="px-6 py-3 text-left font-medium">Empleado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* ¡CAMBIO! Mapeamos la lista filtrada */}
              {peliculasFiltradas.map((pelicula) => (
                <tr key={pelicula.Codigo} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleCargarParaEditar(pelicula)} className="text-yellow-600 hover:text-yellow-800" title="Editar">✏️</button>
                      <button onClick={() => handleDelete(pelicula.Codigo)} className="text-red-600 hover:text-red-800" title="Eliminar">🗑️</button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{pelicula.Codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{pelicula.Nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{pelicula.Fecha_Estreno ? new Date(pelicula.Fecha_Estreno).toLocaleDateString() : ''}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{pelicula.Productora?.Nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{pelicula.Pais?.Nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{pelicula.Director?.Nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{pelicula.Empleado?.Nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}