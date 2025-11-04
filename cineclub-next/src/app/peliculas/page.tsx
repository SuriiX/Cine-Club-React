'use client'; 

import { useState, useEffect } from 'react';

// --- Definición de Tipos ---
type Productora = { Codigo: number; Nombre: string };
type Pais = { Codigo: number; Nombre: string };
type Director = { Codigo: number; Nombre: string };
type Empleado = { Codigo: number; Nombre: string };

type PeliculaConRelaciones = {
  Codigo: number;
  Nombre: string | null;
  Fecha_Estreno: string | null;
  Id_Productora: number | null;
  Id_Pais: number | null;
  Id_Director: number | null;
  Id_Empleado: number | null;
  Productora?: { Nombre: string };
  Pais?: { Nombre: string };
  Director?: { Nombre: string };
  Empleado?: { Nombre: string };
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

  // --- Cargar datos ---
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    // Cargar combos
    fetch('/api/productoras').then(res => res.json()).then(setProductoras);
    fetch('/api/paises').then(res => res.json()).then(setPaises);
    fetch('/api/directores').then(res => res.json()).then(setDirectores);
    fetch('/api/empleados').then(res => res.json()).then(setEmpleados);
    
    // Cargar tabla principal
    fetch('/api/peliculas').then(res => res.json()).then(setListaPeliculas);
  };

  // --- Función para limpiar el formulario ---
  const limpiarFormulario = () => {
    setNombre('');
    setFechaEstreno('');
    setProductoraId('');
    setPaisId('');
    setDirectorId('');
    setEmpleadoId('');
    setCodigoActual(null);
  };

  // --- Recolectar datos del formulario (helper) ---
  const recolectarDatos = () => {
    if (!nombre || !fechaEstreno || !productoraId || !paisId || !directorId || !empleadoId) {
      alert('Todos los campos son requeridos.');
      return null;
    }
    return {
      Nombre: nombre,
      Fecha_Estreno: new Date(fechaEstreno),
      Id_Productora: parseInt(productoraId),
      Id_Pais: parseInt(paisId),
      Id_Director: parseInt(directorId),
      Id_Empleado: parseInt(empleadoId),
    };
  };

  // --- Lógica de Botones ---

  const handleAgregar = async () => {
    const datosPelicula = recolectarDatos();
    if (!datosPelicula) return;

    try {
      const res = await fetch('/api/peliculas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosPelicula),
      });
      if (!res.ok) throw new Error('Error al agregar');
      limpiarFormulario();
      cargarDatos();
      alert('¡Película agregada con éxito!');
    } catch (error) {
      alert('Hubo un error al agregar la película.');
    }
  };

  const handleCargarParaEditar = (pelicula: PeliculaConRelaciones) => {
    const fecha = pelicula.Fecha_Estreno ? new Date(pelicula.Fecha_Estreno).toISOString().split('T')[0] : '';
    
    setNombre(pelicula.Nombre || '');
    setFechaEstreno(fecha);
    setProductoraId(pelicula.Id_Productora?.toString() || '');
    setPaisId(pelicula.Id_Pais?.toString() || '');
    setDirectorId(pelicula.Id_Director?.toString() || '');
    setEmpleadoId(pelicula.Id_Empleado?.toString() || '');
    setCodigoActual(pelicula.Codigo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModificar = async () => {
    const datosPelicula = recolectarDatos();
    if (!datosPelicula || !codigoActual) return;

    try {
      const res = await fetch('/api/peliculas', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Codigo: codigoActual, ...datosPelicula }),
      });
      if (!res.ok) throw new Error('Error al modificar');
      limpiarFormulario();
      cargarDatos();
      alert('¡Película modificada con éxito!');
    } catch (error) {
      alert('Hubo un error al modificar la película.');
    }
  };

  const handleDelete = async (codigo: number) => {
    if (!window.confirm(`¿Seguro que deseas eliminar la película ${codigo}?`)) return;

    try {
      const res = await fetch(`/api/peliculas?id=${codigo}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      cargarDatos();
      alert('¡Película eliminada con éxito!');
    } catch (error) {
      alert('Hubo un error al eliminar la película.');
    }
  };

  return (
    <main className="container mx-auto p-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Gestión de Películas
        </h1>
        
        {/* --- FORMULARIO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="txtNombre" className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input type="text" id="txtNombre" value={nombre} onChange={(e) => setNombre(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="txtFechaEstreno" className="block text-sm font-medium text-gray-700">Fecha de Estreno:</label>
            <input type="date" id="txtFechaEstreno" value={fechaEstreno} onChange={(e) => setFechaEstreno(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="cboProductora" className="block text-sm font-medium text-gray-700">Productora:</label>
            <select id="cboProductora" value={productoraId} onChange={(e) => setProductoraId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {productoras.map((prod) => (
                <option key={prod.Codigo} value={prod.Codigo}>{prod.Nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="cboPais" className="block text-sm font-medium text-gray-700">País (Nacionalidad):</label>
            <select id="cboPais" value={paisId} onChange={(e) => setPaisId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {paises.map((pais) => (
                <option key={pais.Codigo} value={pais.Codigo}>{pais.Nombre}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="cboDirector" className="block text-sm font-medium text-gray-700">Director:</label>
            <select id="cboDirector" value={directorId} onChange={(e) => setDirectorId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {directores.map((dir) => (
                <option key={dir.Codigo} value={dir.Codigo}>{dir.Nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="cboEmpleado" className="block text-sm font-medium text-gray-700">Empleado (Registró):</label>
            <select id="cboEmpleado" value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {empleados.map((emp) => (
                <option key={emp.Codigo} value={emp.Codigo}>{emp.Nombre}</option>
              ))}
            </select>
          </div>
        </div>

        {/* --- BOTONES --- */}
        <div className="flex justify-around items-center pt-6 border-t mt-6">
          {codigoActual === null ? (
            <button onClick={handleAgregar} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
              Agregar
            </button>
          ) : (
            <button onClick={handleModificar} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700">
              Modificar
            </button>
          )}
          {codigoActual !== null && (
            <button onClick={limpiarFormulario} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700">
              Cancelar
            </button>
          )}
        </div>

        {/* --- TABLA DE DATOS --- */}
        <div className="mt-8 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Lista de Películas</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Acciones</th>
                <th className="px-4 py-2 border">Código</th>
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Fecha Estreno</th>
                <th className="px-4 py-2 border">Productora</th>
                <th className="px-4 py-2 border">País</th>
                <th className="px-4 py-2 border">Director</th>
                <th className="px-4 py-2 border">Empleado</th>
              </tr>
            </thead>
            <tbody>
              {listaPeliculas.map((pelicula) => (
                <tr key={pelicula.Codigo} className="text-center hover:bg-gray-50">
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    <button onClick={() => handleCargarParaEditar(pelicula)} className="text-blue-500 hover:text-blue-700" title="Editar">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(pelicula.Codigo)} className="text-red-500 hover:text-red-700" title="Eliminar">
      
                      🗑️
                    </button>
                  </td>
                  <td className="px-4 py-2 border">{pelicula.Codigo}</td>
                  <td className="px-4 py-2 border">{pelicula.Nombre}</td>
                  <td className="px-4 py-2 border">{pelicula.Fecha_Estreno ? new Date(pelicula.Fecha_Estreno).toLocaleDateString() : ''}</td>
                  <td className="px-4 py-2 border">{pelicula.Productora?.Nombre}</td>
                  <td className="px-4 py-2 border">{pelicula.Pais?.Nombre}</td>
                  <td className="px-4 py-2 border">{pelicula.Director?.Nombre}</td>
                  <td className="px-4 py-2 border">{pelicula.Empleado?.Nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}