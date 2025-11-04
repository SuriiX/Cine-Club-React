'use client'; 

import { useState, useEffect } from 'react';
import Toast from '@/components/Toast'; // Importamos el Toast

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

  // ¡NUEVO! Estado para manejar el Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // --- Cargar datos ---
  useEffect(() => {
    cargarCombosYTabla();
  }, []);

  const cargarCombosYTabla = async () => {
    // Cargar Géneros
    fetch('/api/generos')
      .then((res) => res.json())
      .then((data) => setGeneros(data));

    // Cargar Tipos de Documento
    fetch('/api/tiposdoc')
      .then((res) => res.json())
      .then((data) => setTiposDoc(data));

    // Cargar Empleados (para combo y tabla)
    fetch('/api/empleados')
      .then((res) => res.json())
      .then((data) => {
        setSupervisores(data); 
        setListaEmpleados(data);
      });
  };

  // --- Función para limpiar el formulario ---
  const limpiarFormulario = () => {
    setCodigo('');
    setNombre('');
    setFechaNacimiento('');
    setNroDoc('');
    setSalario('');
    setActivo(true);
    setGeneroId('');
    setTipoDocId('');
    setSupervisorId('');
    setCodigoActual(null); // Vuelve a modo "Agregar"
  };

  // --- Recolectar datos del formulario (helper) ---
  const recolectarDatos = () => {
    if (!nombre || !generoId || !tipoDocId || !fechaNacimiento) {
      setToast({ message: 'Nombre, Fecha, Género y Tipo Doc son requeridos.', type: 'error' });
      return null;
    }
    
    return {
      Nombre: nombre,
      Fecha_Nacimiento: new Date(fechaNacimiento),
      NroDoc: nroDoc || null,
      Salario: salario ? parseFloat(salario) : null,
      Activo: activo,
      Id_Genero: parseInt(generoId),
      Id_TipoDoc: parseInt(tipoDocId),
      Id_Supervisor: supervisorId ? parseInt(supervisorId) : null,
    };
  };

  // --- Lógica de Botones ---

  const handleAgregar = async () => {
    const datosEmpleado = recolectarDatos();
    if (!datosEmpleado) return;

    try {
      const response = await fetch('/api/empleados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosEmpleado),
      });

      if (!response.ok) throw new Error('Error al agregar el empleado');
      
      limpiarFormulario();
      cargarCombosYTabla();
      setToast({ message: '¡Empleado agregado con éxito!', type: 'success' });

    } catch (error) {
      console.error(error);
      setToast({ message: 'Hubo un error al agregar.', type: 'error' });
    }
  };

  const handleCargarParaEditar = (emp: EmpleadoConRelaciones) => {
    const fecha = emp.Fecha_Nacimiento ? new Date(emp.Fecha_Nacimiento).toISOString().split('T')[0] : '';
    
    setCodigo(emp.Codigo.toString());
    setNombre(emp.Nombre || '');
    setFechaNacimiento(fecha);
    setNroDoc(emp.NroDoc || '');
    setSalario(emp.Salario ? emp.Salario.toString() : '');
    setActivo(emp.Activo || false);
    setGeneroId(emp.Id_Genero ? emp.Id_Genero.toString() : '');
    setTipoDocId(emp.Id_TipoDoc ? emp.Id_TipoDoc.toString() : '');
    setSupervisorId(emp.Id_Supervisor ? emp.Id_Supervisor.toString() : '');
    setCodigoActual(emp.Codigo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModificar = async () => {
    const datosEmpleado = recolectarDatos();
    if (!datosEmpleado || !codigoActual) return;

    try {
      const response = await fetch('/api/empleados', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Codigo: codigoActual, ...datosEmpleado }),
      });

      if (!response.ok) throw new Error('Error al modificar el empleado');
      
      limpiarFormulario();
      cargarCombosYTabla();
      setToast({ message: '¡Empleado modificado con éxito!', type: 'success' });

    } catch (error) {
      console.error(error);
      setToast({ message: 'Hubo un error al modificar.', type: 'error' });
    }
  };
  
  const handleDelete = async (codigo: number) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el empleado con código ${codigo}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/empleados?id=${codigo}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el empleado');
      }

      cargarCombosYTabla();
      setToast({ message: '¡Empleado eliminado con éxito!', type: 'success' });

    } catch (error) {
      console.error(error);
      setToast({ message: 'Hubo un error al eliminar.', type: 'error' });
    }
  };

  const handleBuscar = async () => {
    setToast({ message: 'Función BUSCAR no implementada', type: 'error' });
  };

  return (
    <main className="container mx-auto"> {/* Quitamos p-8 para que el toast se posicione bien */}
      
      {/* Renderiza el Toast si existe */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-6">
          Gestión de Empleados
        </h1>
        
        {/* Fila 1: Código, Nombre, Fecha Nacimiento */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label htmlFor="txtCodigo" className="block text-sm font-medium text-gray-700">Código:</label>
            <input type="text" id="txtCodigo" value={codigo} disabled
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100" />
          </div>
          <div>
            <label htmlFor="txtNombre" className="block text-sm font-medium text-gray-700">Nombre:</label>
            <input type="text" id="txtNombre" value={nombre} onChange={(e) => setNombre(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label htmlFor="txtFechaNacimiento" className="block text-sm font-medium text-gray-700">Fecha de Nacimiento:</label>
            <input type="date" id="txtFechaNacimiento" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>

        {/* Fila 2: Tipo Doc, Nro Doc */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="cboTipoDoc" className="block text-sm font-medium text-gray-700">Tipo de Documento:</label>
            <select id="cboTipoDoc" value={tipoDocId} onChange={(e) => setTipoDocId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {tiposDoc.map((doc) => (
                <option key={doc.Codigo} value={doc.Codigo}>{doc.Nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="txtNroDoc" className="block text-sm font-medium text-gray-700">Número de Documento:</label>
            <input type="number" id="txtNroDoc" value={nroDoc} onChange={(e) => setNroDoc(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>

        {/* Fila 3: Género, Salario */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="cboGenero" className="block text-sm font-medium text-gray-700">Género:</label>
            <select id="cboGenero" value={generoId} onChange={(e) => setGeneroId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Seleccione --</option>
              {generos.map((gen) => (
                <option key={gen.Codigo} value={gen.Codigo}>{gen.Nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="txtSalario" className="block text-sm font-medium text-gray-700">Salario:</label>
            <input type="number" id="txtSalario" value={salario} onChange={(e) => setSalario(e.target.value)}
                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>

        {/* Fila 4: Supervisor, Activo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 items-center">
          <div className="md:col-span-2">
            <label htmlFor="cboEmpleado" className="block text-sm font-medium text-gray-700">Supervisor:</label>
            <select id="cboEmpleado" value={supervisorId} onChange={(e) => setSupervisorId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
              <option value="">-- Ninguno --</option>
              {supervisores.map((sup) => (
                // Evita que un empleado sea su propio supervisor en el combo
                sup.Codigo !== codigoActual && (
                  <option key={sup.Codigo} value={sup.Codigo}>{sup.Nombre}</option>
                )
              ))}
            </select>
          </div>
          <div className="flex items-center justify-center h-full pt-6">
            <input type="checkbox" id="chkActivo" checked={activo} onChange={(e) => setActivo(e.target.checked)}
                   className="h-5 w-5 text-blue-600 border-gray-300 rounded" />
            <label htmlFor="chkActivo" className="ml-2 block text-sm font-medium text-gray-700">Activo</label>
          </div>
        </div>

        {/* Fila 5: Botones (Lógica condicional) */}
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

          <button onClick={handleBuscar} className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700">
            Buscar
          </button>
          
          {codigoActual !== null && (
            <button onClick={limpiarFormulario} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700">
              Cancelar
            </button>
          )}
        </div>

        {/* Fila 6: Tabla de Datos */}
        <div className="mt-8 overflow-x-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Lista de Empleados</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Acciones</th>
                <th className="px-4 py-2 border">Código</th>
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">TipoDoc</th>
                <th className="px-4 py-2 border">NroDoc</th>
                <th className="px-4 py-2 border">Genero</th>
                <th className="px-4 py-2 border">Supervisor</th>
                <th className="px-4 py-2 border">Activo</th>
              </tr>
            </thead>
            <tbody>
              {listaEmpleados.map((emp) => (
                <tr key={emp.Codigo} className="text-center hover:bg-gray-50">
                  <td className="px-4 py-2 border flex justify-center gap-2">
                    <button 
                      onClick={() => handleCargarParaEditar(emp)} 
                      className="text-blue-500 hover:text-blue-700"
                      title="Editar Empleado"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(emp.Codigo)}
                      className="text-red-500 hover:text-red-700"
                      title="Eliminar Empleado"
                    >
                      🗑️
                    </button>
                  </td>
                  <td className="px-4 py-2 border">{emp.Codigo}</td>
                  <td className="px-4 py-2 border">{emp.Nombre}</td>
                  <td className="px-4 py-2 border">{emp.TipoDoc?.Nombre}</td>
                  <td className="px-4 py-2 border">{emp.NroDoc}</td>
                  <td className="px-4 py-2 border">{emp.Genero?.Nombre}</td>
                  <td className="px-4 py-2 border">{emp.Supervisor?.Nombre}</td>
                  <td className="px-4 py-2 border">{emp.Activo ? 'Sí' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}