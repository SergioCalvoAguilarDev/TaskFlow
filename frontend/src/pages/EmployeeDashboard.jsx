import { useEffect, useState } from 'react';
import api from '../api/client';
import Header from '../components/Header';

const statusLabels = {
  PENDING: 'Pendiente',
  IN_PROGRESS: 'En progreso',
  DONE: 'Completada',
};

const statusBadgeClass = {
  PENDING: 'badge-pending',
  IN_PROGRESS: 'badge-progress',
  DONE: 'badge-done',
};

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    const res = await api.get('/tasks');
    setTasks(res.data);
  }

  async function updateStatus(taskId, status) {
    await api.patch(`/tasks/${taskId}/status`, { status });
    loadTasks();
  }

  return (
    <div>
      <Header title="Mis tareas" />

      <div className="page-content">
        <section className="section">
          <h2>Mis tareas</h2>
          <div className="card">
            {tasks.length === 0 ? (
              <p className="empty-state">No tienes tareas asignadas todavía.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td>{task.description || '—'}</td>
                      <td>
                        <div className="status-cell">
                          <span className={`badge ${statusBadgeClass[task.status]}`}>
                            {statusLabels[task.status]}
                          </span>
                          <select
                            value={task.status}
                            onChange={(e) => updateStatus(task.id, e.target.value)}
                          >
                            <option value="PENDING">Pendiente</option>
                            <option value="IN_PROGRESS">En progreso</option>
                            <option value="DONE">Completada</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}