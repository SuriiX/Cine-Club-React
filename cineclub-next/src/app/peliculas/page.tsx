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

  const inputClass =
    'block w-full rounded-xl border border-rose-700/40 bg-[#1a0010]/80 px-3 py-2 text-sm text-rose-100 placeholder-rose-200/50 shadow-sm transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40';

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0d0003] via-[#180007] to-[#050002] px-4 py-10 text-rose-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="relative overflow-hidden rounded-3xl border border-rose-900/60 bg-gradient-to-br from-[#200008]/90 via-[#31010c]/85 to-[#120005]/95 p-10 shadow-cinema">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,120,150,0.14),transparent_60%)]" />
          <div className="relative flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-400/50 bg-rose-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-rose-100/80">
              Cartelera Viva
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-rose-50 md:text-5xl">Gestión de Películas</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-rose-100/80">
              Da forma a la programación de CineClub con una interfaz vibrante. Controla estrenos, productoras y talentos asociados con la misma estética envolvente del panel principal.
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
              <label htmlFor="txtFechaEstreno" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">Fecha de estreno</label>
              <input
                type="date"
                id="txtFechaEstreno"
                value={fechaEstreno}
                onChange={(e) => setFechaEstreno(e.target.value)}
                className={`mt-2 ${inputClass}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 text-sm text-rose-200 md:grid-cols-2">
            <div>
              <label htmlFor="cboProductora" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">Productora</label>
              <select
                id="cboProductora"
                value={productoraId}
                onChange={(e) => setProductoraId(e.target.value)}
                className={`mt-2 ${inputClass}`}
              >
                <option value="">-- Seleccione --</option>
                {productoras.map((prod) => (
                  <option key={prod.Codigo} value={prod.Codigo}>
                    {prod.Nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="cboPais" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">País (nacionalidad)</label>
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

          <div className="grid grid-cols-1 gap-6 text-sm text-rose-200 md:grid-cols-2">
            <div>
              <label htmlFor="cboDirector" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">Director</label>
              <select
                id="cboDirector"
                value={directorId}
                onChange={(e) => setDirectorId(e.target.value)}
                className={`mt-2 ${inputClass}`}
              >
                <option value="">-- Seleccione --</option>
                {directores.map((dir) => (
                  <option key={dir.Codigo} value={dir.Codigo}>
                    {dir.Nombre}
                  </option>
                ))}
              </select>
            </div>
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
              <h2 className="text-2xl font-semibold text-rose-50">Lista de películas</h2>
              <p className="text-xs uppercase tracking-[0.35em] text-rose-300/70">Encuentra títulos por nombre</p>
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
                  <th className="px-6 py-3 text-left">Fecha Estreno</th>
                  <th className="px-6 py-3 text-left">Productora</th>
                  <th className="px-6 py-3 text-left">País</th>
                  <th className="px-6 py-3 text-left">Director</th>
                  <th className="px-6 py-3 text-left">Empleado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rose-900/50">
                {peliculasFiltradas.map((pelicula) => (
                  <tr key={pelicula.Codigo} className="transition-colors duration-200 hover:bg-rose-900/30">
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-3 text-lg">
                        <button
                          onClick={() => handleCargarParaEditar(pelicula)}
                          className="text-amber-200 transition hover:text-amber-100"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(pelicula.Codigo)}
                          className="text-rose-300 transition hover:text-rose-100"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-rose-100/90">{pelicula.Codigo}</td>
                    <td className="px-6 py-4 text-rose-50/90">{pelicula.Nombre}</td>
                    <td className="px-6 py-4 text-rose-100/80">{pelicula.Fecha_Estreno ? new Date(pelicula.Fecha_Estreno).toLocaleDateString() : ''}</td>
                    <td className="px-6 py-4 text-rose-100/80">{pelicula.Productora?.Nombre}</td>
                    <td className="px-6 py-4 text-rose-100/80">{pelicula.Pais?.Nombre}</td>
                    <td className="px-6 py-4 text-rose-100/80">{pelicula.Director?.Nombre}</td>
                    <td className="px-6 py-4 text-rose-100/80">{pelicula.Empleado?.Nombre}</td>
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