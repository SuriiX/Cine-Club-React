'use client'; 

import { useState, useEffect, useMemo } from 'react'; // Importamos useMemo
import Toast from '@/components/Toast';

// --- Definición de Tipos ---
type Pais = { Codigo: number; Nombre: string };
type Empleado = { Codigo: number; Nombre: string };
type Genero = { Codigo: number; Nombre: string };
type TipoDoc = { Codigo: number; Nombre: string };
type DirectorConRelaciones = {
  Codigo: number; Nombre: string | null;
  Id_Pais: number | null; Id_Empleado: number | null; Id_Genero: number | null; Id_TipoDoc: number | null;
  Pais?: { Nombre: string }; Empleado?: { Nombre: string }; Genero?: { Nombre: string }; TipoDoc?: { Nombre: string };
};

export default function DirectoresPage() {
  // --- Estados para los combos ---
  const [paises, setPaises] = useState<Pais[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [tiposDoc, setTiposDoc] = useState<TipoDoc[]>([]);
  const [listaDirectores, setListaDirectores] = useState<DirectorConRelaciones[]>([]);

  // --- Estados para los campos del formulario ---
  const [nombre, setNombre] = useState('');
  const [paisId, setPaisId] = useState('');
  const [empleadoId, setEmpleadoId] = useState('');
  const [generoId, setGeneroId] = useState('');
  const [tipoDocId, setTipoDocId] = useState('');
  
  // Estado para controlar edición
  const [codigoActual, setCodigoActual] = useState<number | null>(null);
  // Estado para manejar el Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  // ¡NUEVO! Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  // --- Cargar datos ---
  useEffect(() => { cargarDatos(); }, []);
  const cargarDatos = async () => {
    fetch('/api/paises').then(res => res.json()).then(setPaises);
    fetch('/api/empleados').then(res => res.json()).then(setEmpleados);
    fetch('/api/generos').then(res => res.json()).then(setGeneros);
    fetch('/api/tiposdoc').then(res => res.json()).then(setTiposDoc);
    fetch('/api/directores').then(res => res.json()).then(setListaDirectores);
  };

  // --- Función para limpiar el formulario ---
  const limpiarFormulario = () => {
    setNombre(''); setPaisId(''); setEmpleadoId('');
    setGeneroId(''); setTipoDocId(''); setCodigoActual(null);
  };

  // --- Recolectar datos del formulario (helper) ---
  const recolectarDatos = () => {
    if (!nombre || !paisId || !empleadoId || !generoId || !tipoDocId) {
      setToast({ message: 'Todos los campos son requeridos.', type: 'error' });
      return null;
    }
    return {
      Nombre: nombre, Id_Pais: parseInt(paisId),
      Id_Empleado: parseInt(empleadoId), Id_Genero: parseInt(generoId),
      Id_TipoDoc: parseInt(tipoDocId),
    };
  };

  // --- Lógica de Botones ---
  const handleAgregar = async () => {
    const datosDirector = recolectarDatos(); if (!datosDirector) return;
    try {
      const res = await fetch('/api/directores', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datosDirector) });
      if (!res.ok) throw new Error('Error al agregar');
      limpiarFormulario(); cargarDatos();
      setToast({ message: '¡Director agregado con éxito!', type: 'success' });
    } catch (error) { setToast({ message: 'Hubo un error al agregar.', type: 'error' }); }
  };

  const handleCargarParaEditar = (director: DirectorConRelaciones) => {
    setNombre(director.Nombre || '');
    setPaisId(director.Id_Pais?.toString() || '');
    setEmpleadoId(director.Id_Empleado?.toString() || '');
    setGeneroId(director.Id_Genero?.toString() || '');
    setTipoDocId(director.Id_TipoDoc?.toString() || '');
    setCodigoActual(director.Codigo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModificar = async () => {
    const datosDirector = recolectarDatos(); if (!datosDirector || !codigoActual) return;
    try {
      const res = await fetch('/api/directores', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ Codigo: codigoActual, ...datosDirector }) });
      if (!res.ok) throw new Error('Error al modificar');
      limpiarFormulario(); cargarDatos();
      setToast({ message: '¡Director modificado con éxito!', type: 'success' });
    } catch (error) { setToast({ message: 'Hubo un error al modificar.', type: 'error' }); }
  };

  const handleDelete = async (codigo: number) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el director ${codigo}?`)) return;
    try {
      const res = await fetch(`/api/directores?id=${codigo}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      cargarDatos();
      setToast({ message: '¡Director eliminado con éxito!', type: 'success' });
    } catch (error) { setToast({ message: 'Hubo un error al eliminar.', type: 'error' }); }
  };

  // ¡NUEVO! Lógica de filtrado para la búsqueda
  const directoresFiltrados = useMemo(() => {
    return listaDirectores.filter(dir =>
      dir.Nombre?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [listaDirectores, searchQuery]);

  return (
    <main className="container mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-emerald-800 mb-6">
          Gestión de Directores
        </h1>
        
        {/* --- FORMULARIO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="txtNombre" className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input type="text" id="txtNombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="cboPais" className="block text-sm font-medium text-gray-700">País:</label>
            <select id="cboPais" value={paisId} onChange={(e) => setPaisId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {paises.map((pais) => (<option key={pais.Codigo} value={pais.Codigo}>{pais.Nombre}</option>))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label htmlFor="cboEmpleado" className="block text-sm font-medium text-gray-700">Empleado (Registró):</label>
            <select id="cboEmpleado" value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {empleados.map((emp) => (<option key={emp.Codigo} value={emp.Codigo}>{emp.Nombre}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="cboGenero" className="block text-sm font-medium text-gray-700">Género:</label>
            <select id="cboGenero" value={generoId} onChange={(e) => setGeneroId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {generos.map((gen) => (<option key={gen.Codigo} value={gen.Codigo}>{gen.Nombre}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="cboTipoDoc" className="block text-sm font-medium text-gray-700">Tipo Documento:</label>
            <select id="cboTipoDoc" value={tipoDocId} onChange={(e) => setTipoDocId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {tiposDoc.map((doc) => (<option key={doc.Codigo} value={doc.Codigo}>{doc.Nombre}</option>))}
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
            <h2 className="text-2xl font-semibold text-gray-800">Lista de Directores</h2>
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
                <th className="px-6 py-3 text-left font-medium">País</th>
                <th className="px-6 py-3 text-left font-medium">Empleado</th>
                <th className="px-6 py-3 text-left font-medium">Género</th>
                <th className="px-6 py-3 text-left font-medium">Tipo Doc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* ¡CAMBIO! Mapeamos la lista filtrada */}
              {directoresFiltrados.map((director) => (
                <tr key={director.Codigo} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleCargarParaEditar(director)} className="text-yellow-600 hover:text-yellow-800" title="Editar">✏️</button>
                      <button onClick={() => handleDelete(director.Codigo)} className="text-red-600 hover:text-red-800" title="Eliminar">🗑️</button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{director.Codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{director.Nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{director.Pais?.Nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{director.Empleado?.Nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{director.Genero?.Nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{director.TipoDoc?.Nombre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}