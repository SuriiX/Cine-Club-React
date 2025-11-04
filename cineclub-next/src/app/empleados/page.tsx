'use client'; 

import { useState, useEffect, useMemo } from 'react';
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

  const [codigoActual, setCodigoActual] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
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

  // Lógica de filtrado
  const empleadosFiltrados = useMemo(() => {
    return listaEmpleados.filter(emp =>
      emp.Nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.NroDoc?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [listaEmpleados, searchQuery]);

  return (
    <main className="management-page-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* --- FORMULARIO --- */}
      <div className="form-card">
        <h1 className="form-title">
          Gestión de Empleados
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label htmlFor="txtCodigo" className="form-label">Código:</label>
            <input type="text" id="txtCodigo" value={codigo} disabled className="form-input form-input-disabled" />
          </div>
          <div>
            <label htmlFor="txtNombre" className="form-label">Nombre:</label>
            <input type="text" id="txtNombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="form-input" placeholder="Nombre completo"/>
          </div>
          <div>
            <label htmlFor="txtFechaNacimiento" className="form-label">Fecha de Nacimiento:</label>
            <input type="date" id="txtFechaNacimiento" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} className="form-input" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="cboTipoDoc" className="form-label">Tipo de Documento:</label>
            <select id="cboTipoDoc" value={tipoDocId} onChange={(e) => setTipoDocId(e.target.value)} className="form-select">
              <option value="">-- Seleccione --</option>
              {tiposDoc.map((doc) => (<option key={doc.Codigo} value={doc.Codigo}>{doc.Nombre}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="txtNroDoc" className="form-label">Número de Documento:</label>
            <input type="number" id="txtNroDoc" value={nroDoc} onChange={(e) => setNroDoc(e.target.value)} className="form-input" placeholder="1010202030"/>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="cboGenero" className="form-label">Género:</label>
            <select id="cboGenero" value={generoId} onChange={(e) => setGeneroId(e.target.value)} className="form-select">
              <option value="">-- Seleccione --</option>
              {generos.map((gen) => (<option key={gen.Codigo} value={gen.Codigo}>{gen.Nombre}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="txtSalario" className="form-label">Salario:</label>
            <input type="number" id="txtSalario" value={salario} onChange={(e) => setSalario(e.target.value)} className="form-input" placeholder="50000"/>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 items-center">
          <div className="md:col-span-2">
            <label htmlFor="cboEmpleado" className="form-label">Supervisor:</label>
            <select id="cboEmpleado" value={supervisorId} onChange={(e) => setSupervisorId(e.target.value)} className="form-select">
              <option value="">-- Ninguno --</option>
              {supervisores.map((sup) => ( sup.Codigo !== codigoActual && (<option key={sup.Codigo} value={sup.Codigo}>{sup.Nombre}</option>) ))}
            </select>
          </div>
          <div className="form-checkbox-container">
            <input type="checkbox" id="chkActivo" checked={activo} onChange={(e) => setActivo(e.target.checked)} className="form-checkbox" />
            <label htmlFor="chkActivo" className="form-checkbox-label">Activo</label>
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
      <div className="table-card">
        <div className="table-header-container">
          <h2 className="table-title">Lista de Empleados</h2>
          <input
            type="text"
            placeholder="Buscar por Nombre o NroDoc..."
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
                <th className="table-head-cell text-left">TipoDoc</th>
                <th className="table-head-cell text-left">NroDoc</th>
                <th className="table-head-cell text-left">Genero</th>
                <th className="table-head-cell text-left">Supervisor</th>
                <th className="table-head-cell text-left">Activo</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {empleadosFiltrados.map((emp) => (
                <tr key={emp.Codigo} className="table-body-row">
                  <td className="table-body-cell">
                    <div className="flex justify-center gap-4">
                      <button onClick={() => handleCargarParaEditar(emp)} className="table-action-button table-action-edit" title="Editar Empleado">✏️</button>
                      <button onClick={() => handleDelete(emp.Codigo)} className="table-action-button table-action-delete" title="Eliminar Empleado">🗑️</button>
                    </div>
                  </td>
                  <td className="table-body-cell font-mono">{emp.Codigo}</td>
                  <td className="table-body-cell">{emp.Nombre}</td>
                  <td className="table-body-cell">{emp.TipoDoc?.Nombre}</td>
                  <td className="table-body-cell">{emp.NroDoc}</td>
                  <td className="table-body-cell">{emp.Genero?.Nombre}</td>
                  <td className="table-body-cell">{emp.Supervisor?.Nombre}</td>
                  <td className="table-body-cell">{emp.Activo ? 'Sí' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}