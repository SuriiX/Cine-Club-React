'use client'; 

import { useState, useEffect, useMemo } from 'react'; // Importamos useMemo
import Toast from '@/components/Toast';

// --- Definición de Tipos ---
type Genero = { Codigo: number; Nombre: string };
type TipoDoc = { Codigo: number; Nombre: string };
type EmpleadoSimple = { Codigo: number; Nombre: string };

type EmpleadoConRelaciones = {
  Codigo: number;
  Nombre: string | null;
  Fecha_Nacimiento: string | null;
  NroDoc: string | null;
  Salario: number | null;
  Activo: boolean | null;
  Id_Genero: number | null;
  Id_TipoDoc: number | null;
  Id_Supervisor: number | null;
  Genero?: { Nombre: string };
  TipoDoc?: { Nombre: string };
  Supervisor?: { Nombre: string };
};

export default function EmpleadosPage() {
  // --- Estados para los combos ---
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [tiposDoc, setTiposDoc] = useState<TipoDoc[]>([]);
  const [supervisores, setSupervisores] = useState<EmpleadoSimple[]>([]);
  const [listaEmpleados, setListaEmpleados] = useState<EmpleadoConRelaciones[]>([]);

  // --- Estados para los campos del formulario ---
  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [nroDoc, setNroDoc] = useState('');
  const [salario, setSalario] = useState('');
  const [activo, setActivo] = useState(true);
  const [generoId, setGeneroId] = useState('');
  const [tipoDocId, setTipoDocId] = useState('');
  const [supervisorId, setSupervisorId] = useState('');

  // Estado para controlar edición
  const [codigoActual, setCodigoActual] = useState<number | null>(null);
  // Estado para manejar el Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  // ¡NUEVO! Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  // --- Cargar datos ---
  useEffect(() => {
    cargarCombosYTabla();
  }, []);

  const cargarCombosYTabla = async () => {
    fetch('/api/generos').then((res) => res.json()).then((data) => setGeneros(data));
    fetch('/api/tiposdoc').then((res) => res.json()).then((data) => setTiposDoc(data));
    fetch('/api/empleados').then((res) => res.json()).then((data) => {
        setSupervisores(data); 
        setListaEmpleados(data);
    });
  };

  // --- Función para limpiar el formulario ---
  const limpiarFormulario = () => {
    setCodigo(''); setNombre(''); setFechaNacimiento('');
    setNroDoc(''); setSalario(''); setActivo(true);
    setGeneroId(''); setTipoDocId(''); setSupervisorId('');
    setCodigoActual(null);
  };

  // --- Recolectar datos del formulario (helper) ---
  const recolectarDatos = () => {
    if (!nombre || !generoId || !tipoDocId || !fechaNacimiento) {
      setToast({ message: 'Nombre, Fecha, Género y Tipo Doc son requeridos.', type: 'error' });
      return null;
    }
    return {
      Nombre: nombre, Fecha_Nacimiento: new Date(fechaNacimiento),
      NroDoc: nroDoc || null, Salario: salario ? parseFloat(salario) : null,
      Activo: activo, Id_Genero: parseInt(generoId),
      Id_TipoDoc: parseInt(tipoDocId),
      Id_Supervisor: supervisorId ? parseInt(supervisorId) : null,
    };
  };

  // --- Lógica de Botones ---
  const handleAgregar = async () => {
    const datosEmpleado = recolectarDatos(); if (!datosEmpleado) return;
    try {
      const res = await fetch('/api/empleados', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datosEmpleado) });
      if (!res.ok) throw new Error('Error al agregar');
      limpiarFormulario(); cargarCombosYTabla();
      setToast({ message: '¡Empleado agregado con éxito!', type: 'success' });
    } catch (error) { setToast({ message: 'Hubo un error al agregar.', type: 'error' }); }
  };

  const handleCargarParaEditar = (emp: EmpleadoConRelaciones) => {
    const fecha = emp.Fecha_Nacimiento ? new Date(emp.Fecha_Nacimiento).toISOString().split('T')[0] : '';
    setCodigo(emp.Codigo.toString()); setNombre(emp.Nombre || '');
    setFechaNacimiento(fecha); setNroDoc(emp.NroDoc || '');
    setSalario(emp.Salario ? emp.Salario.toString() : '');
    setActivo(emp.Activo || false);
    setGeneroId(emp.Id_Genero ? emp.Id_Genero.toString() : '');
    setTipoDocId(emp.Id_TipoDoc ? emp.Id_TipoDoc.toString() : '');
    setSupervisorId(emp.Id_Supervisor ? emp.Id_Supervisor.toString() : '');
    setCodigoActual(emp.Codigo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModificar = async () => {
    const datosEmpleado = recolectarDatos(); if (!datosEmpleado || !codigoActual) return;
    try {
      const res = await fetch('/api/empleados', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ Codigo: codigoActual, ...datosEmpleado }) });
      if (!res.ok) throw new Error('Error al modificar');
      limpiarFormulario(); cargarCombosYTabla();
      setToast({ message: '¡Empleado modificado con éxito!', type: 'success' });
    } catch (error) { setToast({ message: 'Hubo un error al modificar.', type: 'error' }); }
  };
  
  const handleDelete = async (codigo: number) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el empleado ${codigo}?`)) return;
    try {
      const res = await fetch(`/api/empleados?id=${codigo}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      cargarCombosYTabla();
      setToast({ message: '¡Empleado eliminado con éxito!', type: 'success' });
    } catch (error) { setToast({ message: 'Hubo un error al eliminar.', type: 'error' }); }
  };

  // ¡NUEVO! Lógica de filtrado para la búsqueda
  const empleadosFiltrados = useMemo(() => {
    return listaEmpleados.filter(emp =>
      emp.Nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.NroDoc?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [listaEmpleados, searchQuery]);

  return (
    <main className="container mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Título con nuevo color */}
        <h1 className="text-3xl font-bold text-center text-emerald-800 mb-6">
          Gestión de Empleados
        </h1>
        
        {/* --- FORMULARIO --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label htmlFor="txtCodigo" className="block text-sm font-medium text-gray-700">Código:</label>
            <input type="text" id="txtCodigo" value={codigo} disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-stone-100" />
          </div>
          <div>
            <label htmlFor="txtNombre" className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input type="text" id="txtNombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="txtFechaNacimiento" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento:</label>
            <input type="date" id="txtFechaNacimiento" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="cboTipoDoc" className="block text-sm font-medium text-gray-700">Tipo de Documento:</label>
            <select id="cboTipoDoc" value={tipoDocId} onChange={(e) => setTipoDocId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {tiposDoc.map((doc) => (<option key={doc.Codigo} value={doc.Codigo}>{doc.Nombre}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="txtNroDoc" className="block text-sm font-medium text-gray-700">Número de Documento:</label>
            <input type="number" id="txtNroDoc" value={nroDoc} onChange={(e) => setNroDoc(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="cboGenero" className="block text-sm font-medium text-gray-700">Género:</label>
            <select id="cboGenero" value={generoId} onChange={(e) => setGeneroId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {generos.map((gen) => (<option key={gen.Codigo} value={gen.Codigo}>{gen.Nombre}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="txtSalario" className="block text-sm font-medium text-gray-700">Salario:</label>
            <input type="number" id="txtSalario" value={salario} onChange={(e) => setSalario(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 items-center">
          <div className="md:col-span-2">
            <label htmlFor="cboEmpleado" className="block text-sm font-medium text-gray-700">Supervisor:</label>
            <select id="cboEmpleado" value={supervisorId} onChange={(e) => setSupervisorId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Ninguno --</option>
              {supervisores.map((sup) => ( sup.Codigo !== codigoActual && (<option key={sup.Codigo} value={sup.Codigo}>{sup.Nombre}</option>) ))}
            </select>
          </div>
          <div className="flex items-center justify-center h-full pt-6">
            <input type="checkbox" id="chkActivo" checked={activo} onChange={(e) => setActivo(e.target.checked)} className="h-5 w-5 text-emerald-600 border-gray-300 rounded" />
            <label htmlFor="chkActivo" className="ml-2 block text-sm font-medium text-gray-700">Activo</label>
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
            <h2 className="text-2xl font-semibold text-gray-800">Lista de Empleados</h2>
            {/* ¡NUEVO! Campo de Búsqueda */}
            <input
              type="text"
              placeholder="Buscar por Nombre o NroDoc..."
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
                <th className="px-6 py-3 text-left font-medium">TipoDoc</th>
                <th className="px-6 py-3 text-left font-medium">NroDoc</th>
                <th className="px-6 py-3 text-left font-medium">Genero</th>
                <th className="px-6 py-3 text-left font-medium">Supervisor</th>
                <th className="px-6 py-3 text-left font-medium">Activo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* ¡CAMBIO! Mapeamos la lista filtrada */}
              {empleadosFiltrados.map((emp) => (
                <tr key={emp.Codigo} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleCargarParaEditar(emp)} className="text-yellow-600 hover:text-yellow-800" title="Editar Empleado">✏️</button>
                      <button onClick={() => handleDelete(emp.Codigo)} className="text-red-600 hover:text-red-800" title="Eliminar Empleado">🗑️</button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{emp.Codigo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{emp.Nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{emp.TipoDoc?.Nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{emp.NroDoc}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{emp.Genero?.Nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{emp.Supervisor?.Nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{emp.Activo ? 'Sí' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}