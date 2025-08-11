import React, { useState } from 'react';
import Comments from './Comments';
import TimeTracking from './TimeTracking';

function TaskBoard({ selectedProject, onAddTask, onUpdateTask, onDeleteTask, allTasks = [], teamMembers = [], projects = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [viewAllTasks, setViewAllTasks] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedToUserId: '',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: '',
    projectId: selectedProject?.id || ''
  });

  const tasks = viewAllTasks ? allTasks : (selectedProject?.tasks || []);
  const showingProjectTasks = !viewAllTasks && selectedProject;
  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectId = viewAllTasks ? formData.projectId : selectedProject?.id;
    
    if (formData.title.trim() && projectId) {
      onAddTask(projectId, formData);
      setFormData({ title: '', description: '', assignedToUserId: '', priority: 'MEDIUM', status: 'TODO', dueDate: '', projectId: selectedProject?.id || '' });
      setShowForm(false);
    } else {
      alert('Please fill in task title and select a project');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateTaskStatus = (task, newStatus) => {
    onUpdateTask(task.id, { ...task, status: newStatus });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return '#ff4757';
      case 'MEDIUM': return '#ffa502';
      case 'LOW': return '#2ed573';
      default: return '#747d8c';
    }
  };

  const handleDragStart = (e, task) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(task));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    const task = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (task.status !== newStatus) {
      updateTaskStatus(task, newStatus);
    }
  };

  const TaskItem = ({ task }) => (
    <div 
      className="task-item" 
      draggable
      onDragStart={(e) => handleDragStart(e, task)}
      onClick={() => {
        setEditingTask(task);
        setEditFormData({
          title: task.title,
          description: task.description,
          assignedToUserId: task.assignedToUserId || '',
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate || ''
        });
      }}
      style={{ cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 style={{ flex: 1 }}>{task.title}</h4>
        <span style={{ 
          backgroundColor: getPriorityColor(task.priority), 
          color: 'white', 
          padding: '2px 6px', 
          borderRadius: '3px', 
          fontSize: '0.7rem' 
        }}>
          {task.priority}
        </span>
      </div>
      <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0' }}>
        {task.description}
      </p>
      {task.assignedToUserId && (
        <div style={{ fontSize: '0.8rem', color: '#666' }}>
          Assigned to: {teamMembers.find(m => m.userId === task.assignedToUserId)?.name || task.assignedToUserId}
        </div>
      )}
      {task.dueDate && (
        <div style={{ fontSize: '0.8rem', color: '#666' }}>
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
        <button 
          onClick={(e) => { e.stopPropagation(); setSelectedTask(task); }}
          style={{ 
            fontSize: '0.7rem', 
            padding: '2px 6px', 
            background: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          ⏱ Log Time
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Tasks {showingProjectTasks ? `- ${selectedProject.name}` : (viewAllTasks ? '- All Projects' : '')}</h2>
          <div style={{ marginTop: '0.5rem' }}>
            <button 
              onClick={() => setViewAllTasks(!viewAllTasks)}
              style={{ background: 'none', border: 'none', color: '#2d3748', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
            >
              {viewAllTasks ? (selectedProject ? 'Show Project Tasks' : 'Show No Tasks') : 'Show All Tasks'}
            </button>
            {showingProjectTasks && (
              <span style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#666' }}>
                (Showing tasks from last selected project)
              </span>
            )}
          </div>
        </div>
        <button 
          className="btn btn-success" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Create New Task</h3>
          <form onSubmit={handleSubmit}>
            {viewAllTasks && (
              <div className="form-group">
                <label>Select Project</label>
                <select
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a project...</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-group">
              <label>Task Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Assign To</label>
                <select
                  name="assignedToUserId"
                  value={formData.assignedToUserId}
                  onChange={handleChange}
                >
                  <option value="">Unassigned</option>
                  {teamMembers.map(member => (
                    <option key={member.userId} value={member.userId}>
                      {member.name} (@{member.userId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-success">Create Task</button>
          </form>
        </div>
      )}

      <div className="grid grid-3">
        <div 
          className="task-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'TODO')}
        >
          <h3>To Do ({todoTasks.length})</h3>
          {todoTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>

        <div 
          className="task-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'IN_PROGRESS')}
        >
          <h3>In Progress ({inProgressTasks.length})</h3>
          {inProgressTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>

        <div 
          className="task-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'DONE')}
        >
          <h3>Done ({doneTasks.length})</h3>
          {doneTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </div>

      {editingTask && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', maxHeight: '80vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Edit Task</h3>
              <button onClick={() => setEditingTask(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateTask(editingTask.id, editFormData);
              setEditingTask(null);
            }}>
              <div className="form-group">
                <label>Task Title</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Assigned To</label>
                  <select
                    value={editFormData.assignedToUserId}
                    onChange={(e) => setEditFormData({...editFormData, assignedToUserId: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map(member => (
                      <option key={member.userId} value={member.userId}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={editFormData.priority}
                    onChange={(e) => setEditFormData({...editFormData, priority: e.target.value})}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={editFormData.dueDate}
                    onChange={(e) => setEditFormData({...editFormData, dueDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-success">
                  Update Task
                </button>
                <button 
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    onDeleteTask(editingTask.id);
                    setEditingTask(null);
                  }}
                >
                  Delete Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskBoard;