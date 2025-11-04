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
    <main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <h1 className="form-title">
        Gestión de Géneros
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Columna del Formulario */}
        <div className="md:col-span-1">
          <div className="form-container">
            <h2 className="table-title mb-4">
              {codigoActual ? 'Modificar Género' : 'Agregar Género'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="txtNombre" className="form-label">Nombre:</label>
                <input
                  type="text"
                  id="txtNombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-button-container">
                <button
                  type="submit"
                  className={`form-button ${codigoActual ? 'form-button-edit' : 'form-button-add'}`}
                >
                  {codigoActual ? 'Modificar' : 'Agregar'}
                </button>
                {codigoActual && (
                  <button
                    type="button"
                    onClick={limpiarFormulario}
                    className="form-button form-button-cancel"
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
          <div className="table-section-container">
            <div className="table-header-container">
              <h2 className="table-title">Lista de Géneros</h2>
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="table-search-input"
              />
            </div>
            
            <div className="table-wrapper">
              <table className="table-element">
                <thead className="table-head">
                  <tr>
                    <th className="table-head-cell text-left">Código</th>
                    <th className="table-head-cell text-left">Nombre</th>
                    <th className="table-head-cell text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {generosFiltrados.map((gen) => (
                    <tr key={gen.Codigo} className="table-body-row">
                      <td className="table-body-cell">{gen.Codigo}</td>
                      <td className="table-body-cell">{gen.Nombre}</td>
                      <td className="table-body-cell">
                        <div className="flex justify-center gap-4">
                          <button onClick={() => handleCargarParaEditar(gen)} className="table-action-button table-action-edit" title="Editar">
                            ✏️
                          </button>
                          <button onClick={() => handleDelete(gen.Codigo)} className="table-action-button table-action-delete" title="Eliminar">
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