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
    fetch('/api/generos').then(res => res.json()).then(setListaGeneros);
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
    return listaGeneros.filter(gen =>
      gen.Nombre?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [listaGeneros, searchQuery]);

  return (
    <main className="container mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="text-4xl font-bold text-center text-emerald-800 mb-8">
        Gestión de Géneros
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna del Formulario */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {codigoActual ? 'Modificar Género' : 'Agregar Género'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="txtNombre" className="block text-sm font-medium text-gray-700">Nombre:</label>
                <input
                  type="text"
                  id="txtNombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="submit"
                  className={`px-6 py-2 text-white font-semibold rounded-lg shadow-md ${codigoActual ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                  {codigoActual ? 'Modificar' : 'Agregar'}
                </button>
                {codigoActual && (
                  <button
                    type="button"
                    onClick={limpiarFormulario}
                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Columna de la Tabla */}
        <div className="md:col-span-2">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Géneros</h2>
            
            {/* Campo de Búsqueda */}
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            
            {/* Tabla de Datos */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-stone-100 text-gray-700 uppercase text-sm">
                  <tr>
                    <th className="px-6 py-3 text-left font-medium">Código</th>
                    <th className="px-6 py-3 text-left font-medium">Nombre</th>
                    <th className="px-6 py-3 text-center font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {generosFiltrados.map((gen) => (
                    <tr key={gen.Codigo} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">{gen.Codigo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-800">{gen.Nombre}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleCargarParaEditar(gen)} className="text-yellow-600 hover:text-yellow-800" title="Editar">
                            ✏️
                          </button>
                          <button onClick={() => handleDelete(gen.Codigo)} className="text-red-600 hover:text-red-800" title="Eliminar">
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
        </div>
      </div>
    </main>
  );
}