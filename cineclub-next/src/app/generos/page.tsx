'use client';

import { useState, useEffect, useMemo } from 'react';
import Toast from '@/components/Toast';

type Genero = {
  Codigo: number;
  Nombre: string | null;
};

export default function GenerosPage() {
  const [listaGeneros, setListaGeneros] = useState<Genero[]>([]);
  const [nombre, setNombre] = useState('');
  const [codigoActual, setCodigoActual] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    cargarGeneros();
  }, []);

  const cargarGeneros = async () => {
    fetch('/api/generos').then((res) => res.json()).then(setListaGeneros);
  };

  const limpiarFormulario = () => {
    setNombre('');
    setCodigoActual(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) {
      setToast({ message: 'El nombre es requerido.', type: 'error' });
      return;
    }

    try {
      const url = codigoActual ? '/api/generos' : '/api/generos';
      const method = codigoActual ? 'PUT' : 'POST';
      const body = JSON.stringify(codigoActual ? { Codigo: codigoActual, Nombre: nombre } : { Nombre: nombre });

      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body });
      if (!res.ok) throw new Error(codigoActual ? 'Error al modificar' : 'Error al agregar');

      limpiarFormulario();
      cargarGeneros();
      setToast({ message: `Género ${codigoActual ? 'modificado' : 'agregado'} con éxito!`, type: 'success' });
    } catch (error) {
      setToast({ message: 'Hubo un error.', type: 'error' });
    }
  };

  const handleCargarParaEditar = (genero: Genero) => {
    setNombre(genero.Nombre || '');
    setCodigoActual(genero.Codigo);
  };

  const handleDelete = async (codigo: number) => {
    if (!window.confirm(`¿Seguro que deseas eliminar el género ${codigo}?`)) return;
    try {
      const res = await fetch(`/api/generos?id=${codigo}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error al eliminar');
      cargarGeneros();
      setToast({ message: 'Género eliminado con éxito!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Hubo un error al eliminar.', type: 'error' });
    }
  };

  const generosFiltrados = useMemo(() => {
    return listaGeneros.filter((gen) => gen.Nombre?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [listaGeneros, searchQuery]);

  const inputClass =
    'block w-full rounded-xl border border-rose-700/40 bg-[#1a0010]/80 px-3 py-2 text-sm text-rose-100 placeholder-rose-200/50 shadow-sm transition focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-500/40';

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0d0003] via-[#180007] to-[#050002] px-4 py-10 text-rose-50">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <header className="relative overflow-hidden rounded-3xl border border-rose-900/60 bg-gradient-to-br from-[#200008]/90 via-[#31010c]/85 to-[#120005]/95 p-10 shadow-cinema">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,120,150,0.12),transparent_65%)]" />
          <div className="relative flex flex-col gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-rose-400/50 bg-rose-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-rose-100/80">
              Catálogo cromático
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-rose-50 md:text-5xl">Gestión de Géneros</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-rose-100/80">
              Define las etiquetas que pintan cada película con el mismo espíritu vibrante del hub principal. Agrega, modifica y organiza géneros desde un tablero oscuro y elegante.
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6 rounded-3xl border border-rose-900/60 bg-black/30 p-8 shadow-cinema backdrop-blur">
            <div className="flex flex-col gap-2 text-sm text-rose-200">
              <h2 className="text-2xl font-semibold text-rose-50">
                {codigoActual ? 'Modificar género' : 'Agregar género'}
              </h2>
              <p className="text-xs uppercase tracking-[0.35em] text-rose-300/70">
                Completa el nombre para sumarlo a la colección
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="txtNombre" className="font-medium uppercase tracking-[0.3em] text-rose-300/80">
                  Nombre
                </label>
                <input
                  type="text"
                  id="txtNombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={`mt-2 ${inputClass}`}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className={`rounded-full px-8 py-2 text-xs font-semibold uppercase tracking-[0.35em] transition-all duration-300 hover:-translate-y-0.5 ${
                    codigoActual
                      ? 'border border-amber-400/60 bg-amber-400/15 text-amber-100 hover:bg-amber-400/25'
                      : 'border border-rose-500/60 bg-rose-500/20 text-rose-100 hover:bg-rose-500/35'
                  }`}
                >
                  {codigoActual ? 'Modificar' : 'Agregar'}
                </button>
                {codigoActual && (
                  <button
                    type="button"
                    onClick={limpiarFormulario}
                    className="rounded-full border border-rose-300/50 bg-transparent px-8 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-rose-300 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-500/10 hover:text-rose-100"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="space-y-6 rounded-3xl border border-rose-900/60 bg-black/30 p-8 shadow-cinema backdrop-blur lg:col-span-2">
            <div className="flex flex-col gap-4 text-sm text-rose-200 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-rose-50">Lista de géneros</h2>
                <p className="text-xs uppercase tracking-[0.35em] text-rose-300/70">Busca por nombre para editar o eliminar</p>
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputClass} mt-0 w-full text-sm md:w-72`}
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-rose-900/60 bg-black/40">
              <table className="min-w-full text-sm text-rose-100">
                <thead className="bg-rose-900/50 text-xs uppercase tracking-[0.35em] text-rose-200">
                  <tr>
                    <th className="px-6 py-3 text-left">Código</th>
                    <th className="px-6 py-3 text-left">Nombre</th>
                    <th className="px-6 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-900/50">
                  {generosFiltrados.map((gen) => (
                    <tr key={gen.Codigo} className="transition-colors duration-200 hover:bg-rose-900/30">
                      <td className="px-6 py-4 text-rose-100/90">{gen.Codigo}</td>
                      <td className="px-6 py-4 text-rose-50/90">{gen.Nombre}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-3 text-lg">
                          <button
                            onClick={() => handleCargarParaEditar(gen)}
                            className="text-amber-200 transition hover:text-amber-100"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDelete(gen.Codigo)}
                            className="text-rose-300 transition hover:text-rose-100"
                            title="Eliminar"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
