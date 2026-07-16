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

export default function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedToId: '' });
  const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'EMPLOYEE' });

  useEffect(() => {
    loadTasks();
    loadUsers();
  }, []);

  async function loadTasks() {
    const res = await api.get('/tasks');
    setTasks(res.data);
  }

  async function loadUsers() {
    const res = await api.get('/users');
    setUsers(res.data);
  }

  async function handleCreateTask(e) {
    e.preventDefault();
    await api.post('/tasks', {
      ...taskForm,
      assignedToId: Number(taskForm.assignedToId),
    });
    setTaskForm({ title: '', description: '', assignedToId: '' });
    loadTasks();
  }

  async function handleCreateUser(e) {
    e.preventDefault();
    await api.post('/users', userForm);
    setUserForm({ name: '', email: '', password: '', role: 'EMPLOYEE' });
    loadUsers();
  }

  async function handleDeleteUser(id) {
    if (!confirm('¿Seguro que quieres eliminar este usuario? También se borrarán sus tareas.')) return;
    await api.delete(`/users/${id}`);
    loadUsers();
    loadTasks();
  }

  async function handleDeleteTask(id) {
    if (!confirm('¿Seguro que quieres eliminar esta tarea?')) return;
    await api.delete(`/tasks/${id}`);
    loadTasks();
  }

  return (
    <div>
      <Header title="Panel de administración" />

      <div className="page-content">
        <section className="section">
          <h2>Crear usuario</h2>
          <div className="card">
            <form className="form-row" onSubmit={handleCreateUser}>
              <input
                placeholder="Nombre"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={userForm.password}
                onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                required
              />
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
              >
                <option value="EMPLOYEE">Empleado</option>
                <option value="ADMIN">Administrador</option>
              </select>
              <button className="btn-primary" type="submit">Crear usuario</button>
            </form>
          </div>
        </section>

        <section className="section">
          <h2>Usuarios</h2>
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <button className="btn-danger" onClick={() => handleDeleteUser(u.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section">
          <h2>Crear tarea</h2>
          <div className="card">
            <form className="form-row" onSubmit={handleCreateTask}>
              <input
                placeholder="Título"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                required
              />
              <input
                placeholder="Descripción"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              />
              <select
                value={taskForm.assignedToId}
                onChange={(e) => setTaskForm({ ...taskForm, assignedToId: e.target.value })}
                required
              >
                <option value="">Asignar a...</option>
                {users
                  .filter((u) => u.role === 'EMPLOYEE')
                  .map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
              </select>
              <button className="btn-primary" type="submit">Crear tarea</button>
            </form>
          </div>
        </section>

        <section className="section">
          <h2>Todas las tareas</h2>
          <div className="card">
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Asignada a</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.assignedTo.name}</td>
                    <td>
                      <span className={`badge ${statusBadgeClass[task.status]}`}>
                        {statusLabels[task.status]}
                      </span>
                    </td>
                    <td>
                      <button className="btn-danger" onClick={() => handleDeleteTask(task.id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}