'use client'; 

import { useState, useEffect, useMemo } from 'react';
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
  
  const [codigoActual, setCodigoActual] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
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

  // Lógica de filtrado
  const directoresFiltrados = useMemo(() => {
    return listaDirectores.filter(dir =>
      dir.Nombre?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [listaDirectores, searchQuery]);

  const inputClass =
    'block w-full rounded-xl border border-rose-700/40 bg-[#1a0010]/80 px-3 py-2 text-sm text-rose-100 placeholder-rose-200/50 shadow-sm transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40';

  return (
<<<<<<< HEAD
    <main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* --- FORMULARIO --- */}
      <div className="form-container">
        <h1 className="form-title">
          Gestión de Directores
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label htmlFor="txtNombre" className="form-label">Nombre:</label>
            <input type="text" id="txtNombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="form-input" />
          </div>
          <div>
            <label htmlFor="cboPais" className="form-label">País:</label>
            <select id="cboPais" value={paisId} onChange={(e) => setPaisId(e.target.value)} className="form-select">
              <option value="">-- Seleccione --</option>
              {paises.map((pais) => (<option key={pais.Codigo} value={pais.Codigo}>{pais.Nombre}</option>))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div>
            <label htmlFor="cboEmpleado" className="form-label">Empleado (Registró):</label>
            <select id="cboEmpleado" value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)} className="form-select">
              <option value="">-- Seleccione --</option>
              {empleados.map((emp) => (<option key={emp.Codigo} value={emp.Codigo}>{emp.Nombre}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="cboGenero" className="form-label">Género:</label>
            <select id="cboGenero" value={generoId} onChange={(e) => setGeneroId(e.target.value)} className="form-select">
              <option value="">-- Seleccione --</option>
              {generos.map((gen) => (<option key={gen.Codigo} value={gen.Codigo}>{gen.Nombre}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="cboTipoDoc" className="form-label">Tipo Documento:</label>
            <select id="cboTipoDoc" value={tipoDocId} onChange={(e) => setTipoDocId(e.target.value)} className="form-select">
              <option value="">-- Seleccione --</option>
              {tiposDoc.map((doc) => (<option key={doc.Codigo} value={doc.Codigo}>{doc.Nombre}</option>))}
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
          <h2 className="table-title">Lista de Directores</h2>
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
                <th className="table-head-cell text-left">País</th>
                <th className="table-head-cell text-left">Empleado</th>
                <th className="table-head-cell text-left">Género</th>
                <th className="table-head-cell text-left">Tipo Doc</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {directoresFiltrados.map((director) => (
                <tr key={director.Codigo} className="table-body-row">
                  <td className="table-body-cell">
                    <div className="flex justify-center gap-4">
                      <button onClick={() => handleCargarParaEditar(director)} className="table-action-button table-action-edit" title="Editar">✏️</button>
                      <button onClick={() => handleDelete(director.Codigo)} className="table-action-button table-action-delete" title="Eliminar">🗑️</button>
                    </div>
                  </td>
                  <td className="table-body-cell">{director.Codigo}</td>
                  <td className="table-body-cell">{director.Nombre}</td>
                  <td className="table-body-cell">{director.Pais?.Nombre}</td>
                  <td className="table-body-cell">{director.Empleado?.Nombre}</td>
                  <td className="table-body-cell">{director.Genero?.Nombre}</td>
                  <td className="table-body-cell">{director.TipoDoc?.Nombre}</td>
=======
    <main className="min-h-screen bg-gradient-to-br from-[#0d0003] via-[#180007] to-[#050002] px-4 py-10 text-rose-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="relative overflow-hidden rounded-3xl border border-rose-900/60 bg-gradient-to-br from-[#200008]/90 via-[#31010c]/85 to-[#120005]/95 p-10 shadow-cinema">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(255,120,150,0.12),transparent_60%)]" />
          <div className="relative flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-400/50 bg-rose-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-rose-100/80">
              Voces del celuloide
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-rose-50 md:text-5xl">Gestión de Directores</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-rose-100/80">
              Curá las mentes detrás de cada obra y mantén sincronizados sus datos clave con un ambiente visual inspirado en la sala principal de CineClub.
            </p>
          </div>
        </header>

        <section className="space-y-10 rounded-3xl border border-rose-900/60 bg-black/30 p-8 shadow-cinema backdrop-blur">
          <div className="grid grid-cols-1 gap-6 text-sm text-rose-200 md:grid-cols-2">
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
              <label htmlFor="cboPais" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">País</label>
              <select
                id="cboPais"
                value={paisId}
                onChange={(e) => setPaisId(e.target.value)}
                className={`mt-2 ${inputClass}`}
              >
                <option value="">-- Seleccione --</option>
                {paises.map((pais) => (
                  <option key={pais.Codigo} value={pais.Codigo}>
                    {pais.Nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 text-sm text-rose-200 md:grid-cols-3">
            <div>
              <label htmlFor="cboEmpleado" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">Empleado (registró)</label>
              <select
                id="cboEmpleado"
                value={empleadoId}
                onChange={(e) => setEmpleadoId(e.target.value)}
                className={`mt-2 ${inputClass}`}
              >
                <option value="">-- Seleccione --</option>
                {empleados.map((emp) => (
                  <option key={emp.Codigo} value={emp.Codigo}>
                    {emp.Nombre}
                  </option>
                ))}
              </select>
            </div>
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
              <label htmlFor="cboTipoDoc" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">Tipo documento</label>
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
              <h2 className="text-2xl font-semibold text-rose-50">Lista de directores</h2>
              <p className="text-xs uppercase tracking-[0.35em] text-rose-300/70">Busca por nombre para editar o eliminar</p>
            </div>
            <input
              type="text"
              placeholder="Buscar por Nombre..."
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
                  <th className="px-6 py-3 text-left">País</th>
                  <th className="px-6 py-3 text-left">Empleado</th>
                  <th className="px-6 py-3 text-left">Género</th>
                  <th className="px-6 py-3 text-left">Tipo Doc</th>
>>>>>>> 715e733c7bc882ffe5aa05a8fdcf35469537c5e0
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-900/50">
                {directoresFiltrados.map((director) => (
                  <tr key={director.Codigo} className="transition-colors duration-200 hover:bg-rose-900/30">
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3 text-lg">
                        <button
                          onClick={() => handleCargarParaEditar(director)}
                          className="text-amber-200 transition hover:text-amber-100"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(director.Codigo)}
                          className="text-rose-300 transition hover:text-rose-100"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-rose-100/90">{director.Codigo}</td>
                    <td className="px-6 py-4 text-rose-50/90">{director.Nombre}</td>
                    <td className="px-6 py-4 text-rose-100/80">{director.Pais?.Nombre}</td>
                    <td className="px-6 py-4 text-rose-100/80">{director.Empleado?.Nombre}</td>
                    <td className="px-6 py-4 text-rose-100/80">{director.Genero?.Nombre}</td>
                    <td className="px-6 py-4 text-rose-100/80">{director.TipoDoc?.Nombre}</td>
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