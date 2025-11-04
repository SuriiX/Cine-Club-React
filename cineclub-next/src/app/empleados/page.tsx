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

  const inputClass =
    'block w-full rounded-xl border border-rose-700/40 bg-[#1a0010]/80 px-3 py-2 text-sm text-rose-100 placeholder-rose-200/50 shadow-sm transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40';

  return (
<<<<<<< HEAD
    <main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* --- FORMULARIO --- */}
      <div className="form-container">
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
            <input type="text" id="txtNombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="form-input" />
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
            <input type="number" id="txtNroDoc" value={nroDoc} onChange={(e) => setNroDoc(e.target.value)} className="form-input" />
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
            <input type="number" id="txtSalario" value={salario} onChange={(e) => setSalario(e.target.value)} className="form-input" />
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
          <div className="flex items-center justify-center h-full pt-6">
            <input type="checkbox" id="chkActivo" checked={activo} onChange={(e) => setActivo(e.target.checked)} className="h-5 w-5 text-rose-500 border-rose-800/60 rounded bg-black/30 focus:ring-rose-600" />
            <label htmlFor="chkActivo" className="ml-2 form-label">Activo</label>
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
                  <td className="table-body-cell">{emp.Codigo}</td>
                  <td className="table-body-cell">{emp.Nombre}</td>
                  <td className="table-body-cell">{emp.TipoDoc?.Nombre}</td>
                  <td className="table-body-cell">{emp.NroDoc}</td>
                  <td className="table-body-cell">{emp.Genero?.Nombre}</td>
                  <td className="table-body-cell">{emp.Supervisor?.Nombre}</td>
                  <td className="table-body-cell">{emp.Activo ? 'Sí' : 'No'}</td>
=======
    <main className="min-h-screen bg-gradient-to-br from-[#0d0003] via-[#180007] to-[#050002] px-4 py-10 text-rose-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="relative overflow-hidden rounded-3xl border border-rose-900/60 bg-gradient-to-br from-[#200008]/90 via-[#31010c]/85 to-[#120005]/95 p-10 shadow-cinema">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,120,150,0.12),transparent_60%)]" />
          <div className="relative flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-400/50 bg-rose-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-rose-100/80">
              Equipo en escena
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-rose-50 md:text-5xl">Gestión de Empleados</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-rose-100/80">
              Administra al reparto que hace posible cada función. Controla sus datos, asigna supervisiones y mantén viva la experiencia cinematográfica con la misma energía de la pantalla principal.
            </p>
          </div>
        </header>

        <section className="space-y-10 rounded-3xl border border-rose-900/60 bg-black/30 p-8 shadow-cinema backdrop-blur">
          <div className="grid grid-cols-1 gap-6 text-sm text-rose-200 lg:grid-cols-3">
            <div>
              <label htmlFor="txtCodigo" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">Código</label>
              <input
                type="text"
                id="txtCodigo"
                value={codigo}
                disabled
                className={`mt-2 ${inputClass} cursor-not-allowed bg-[#2b0013]/60 text-rose-300/70`}
              />
            </div>
            <div>
              <label htmlFor="txtNombre" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">Nombre</label>
              <input
                type="text"
                id="txtNombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={`mt-2 ${inputClass}`}
              />
            </div>
            <div>
              <label htmlFor="txtFechaNacimiento" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">Fecha de nacimiento</label>
              <input
                type="date"
                id="txtFechaNacimiento"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                className={`mt-2 ${inputClass}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 text-sm text-rose-200 md:grid-cols-2">
            <div>
              <label htmlFor="cboTipoDoc" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">Tipo de documento</label>
              <select
                id="cboTipoDoc"
                value={tipoDocId}
                onChange={(e) => setTipoDocId(e.target.value)}
                className={`mt-2 ${inputClass}`}
              >
                <option value="">-- Seleccione --</option>
                {tiposDoc.map((doc) => (
                  <option key={doc.Codigo} value={doc.Codigo}>
                    {doc.Nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="txtNroDoc" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">Número de documento</label>
              <input
                type="number"
                id="txtNroDoc"
                value={nroDoc}
                onChange={(e) => setNroDoc(e.target.value)}
                className={`mt-2 ${inputClass}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 text-sm text-rose-200 md:grid-cols-2">
            <div>
              <label htmlFor="cboGenero" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">Género</label>
              <select
                id="cboGenero"
                value={generoId}
                onChange={(e) => setGeneroId(e.target.value)}
                className={`mt-2 ${inputClass}`}
              >
                <option value="">-- Seleccione --</option>
                {generos.map((gen) => (
                  <option key={gen.Codigo} value={gen.Codigo}>
                    {gen.Nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="txtSalario" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">Salario</label>
              <input
                type="number"
                id="txtSalario"
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                className={`mt-2 ${inputClass}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 items-end gap-6 text-sm text-rose-200 md:grid-cols-3">
            <div className="md:col-span-2">
              <label htmlFor="cboEmpleado" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">Supervisor</label>
              <select
                id="cboEmpleado"
                value={supervisorId}
                onChange={(e) => setSupervisorId(e.target.value)}
                className={`mt-2 ${inputClass}`}
              >
                <option value="">-- Ninguno --</option>
                {supervisores
                  .filter((sup) => sup.Codigo !== codigoActual)
                  .map((sup) => (
                    <option key={sup.Codigo} value={sup.Codigo}>
                      {sup.Nombre}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="chkActivo"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="h-5 w-5 rounded border-rose-600/60 bg-[#1a0010] text-rose-400 focus:ring-rose-400/60"
              />
              <label htmlFor="chkActivo" className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-200">
                Activo
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-rose-900/50 pt-6">
            {codigoActual === null ? (
              <button
                onClick={handleAgregar}
                className="rounded-full border border-rose-500/60 bg-rose-500/20 px-8 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-rose-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-500/35 hover:text-rose-50"
              >
                Agregar
              </button>
            ) : (
              <button
                onClick={handleModificar}
                className="rounded-full border border-amber-400/60 bg-amber-400/15 px-8 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-amber-100 transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-400/25"
              >
                Modificar
              </button>
            )}
            {codigoActual !== null && (
              <button
                onClick={limpiarFormulario}
                className="rounded-full border border-rose-300/50 bg-transparent px-8 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-rose-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-500/10 hover:text-rose-100"
              >
                Cancelar
              </button>
            )}
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-rose-900/60 bg-black/30 p-8 shadow-cinema backdrop-blur">
          <div className="flex flex-col gap-4 text-sm text-rose-200 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-rose-50">Lista de empleados</h2>
              <p className="text-xs uppercase tracking-[0.35em] text-rose-300/70">Filtra por nombre o documento</p>
            </div>
            <input
              type="text"
              placeholder="Buscar por Nombre o NroDoc..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${inputClass} mt-0 w-full text-sm md:w-72`}
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-rose-900/60 bg-black/40">
            <table className="min-w-full text-sm text-rose-100">
              <thead className="bg-rose-900/50 text-xs uppercase tracking-[0.35em] text-rose-200">
                <tr>
                  <th className="px-6 py-3 text-center">Acciones</th>
                  <th className="px-6 py-3 text-left">Código</th>
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3 text-left">TipoDoc</th>
                  <th className="px-6 py-3 text-left">NroDoc</th>
                  <th className="px-6 py-3 text-left">Género</th>
                  <th className="px-6 py-3 text-left">Supervisor</th>
                  <th className="px-6 py-3 text-left">Activo</th>
>>>>>>> 715e733c7bc882ffe5aa05a8fdcf35469537c5e0
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-900/50">
                {empleadosFiltrados.map((emp) => (
                  <tr key={emp.Codigo} className="transition-colors duration-200 hover:bg-rose-900/30">
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3 text-lg">
                        <button
                          onClick={() => handleCargarParaEditar(emp)}
                          className="text-amber-200 transition hover:text-amber-100"
                          title="Editar Empleado"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(emp.Codigo)}
                          className="text-rose-300 transition hover:text-rose-100"
                          title="Eliminar Empleado"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-rose-100/90">{emp.Codigo}</td>
                    <td className="px-6 py-4 text-rose-50/90">{emp.Nombre}</td>
                    <td className="px-6 py-4 text-rose-100/80">{emp.TipoDoc?.Nombre}</td>
                    <td className="px-6 py-4 text-rose-100/80">{emp.NroDoc}</td>
                    <td className="px-6 py-4 text-rose-100/80">{emp.Genero?.Nombre}</td>
                    <td className="px-6 py-4 text-rose-100/80">{emp.Supervisor?.Nombre}</td>
                    <td className="px-6 py-4 text-rose-100/80">{emp.Activo ? 'Sí' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}