import React, { useState } from 'react';
import Comments from './Comments';
import TimeTracking from './TimeTracking';

function MilestoneBoard({ selectedProject, onAddMilestone, onUpdateMilestone, allProjects = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  const [viewAllMilestones, setViewAllMilestones] = useState(false);
  
  const projectMilestones = selectedProject?.milestones || [];
  const allMilestones = allProjects.reduce((acc, project) => {
    return acc.concat((project.milestones || []).map(milestone => ({
      ...milestone,
      projectName: project.name
    })));
  }, []);
  
  const milestones = viewAllMilestones ? allMilestones : projectMilestones;
  const pendingMilestones = milestones.filter(m => !m.completed);
  const completedMilestones = milestones.filter(m => m.completed);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData, 'Selected project:', selectedProject);
    if (formData.title.trim() && selectedProject) {
      onAddMilestone(selectedProject.id, formData);
      setFormData({ title: '', description: '', dueDate: '' });
      setShowForm(false);
    } else {
      alert('Please select a project first and enter a milestone title');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMilestone = (milestone) => {
    onUpdateMilestone(milestone.id, { 
      ...milestone, 
      completed: !milestone.completed 
    });
  };

  const handleDragStart = (e, milestone) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(milestone));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetCompleted) => {
    e.preventDefault();
    const milestone = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (milestone.completed !== targetCompleted) {
      toggleMilestone(milestone);
    }
  };

  const MilestoneItem = ({ milestone }) => (
    <div 
      className="task-item"
      draggable
      onDragStart={(e) => handleDragStart(e, milestone)}
      style={{ cursor: 'grab' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 onClick={() => {
          setEditingMilestone(milestone);
          setEditFormData({
            title: milestone.title,
            description: milestone.description,
            dueDate: milestone.dueDate || ''
          });
        }} style={{ cursor: 'pointer', flex: 1 }}>{milestone.title}</h4>
        <input
          type="checkbox"
          checked={milestone.completed}
          onChange={(e) => {
            e.stopPropagation();
            toggleMilestone(milestone);
          }}
          style={{ marginLeft: '1rem' }}
        />
      </div>
      {viewAllMilestones && milestone.projectName && (
        <div style={{ fontSize: '0.8rem', color: '#007bff', marginBottom: '0.5rem' }}>
          Project: {milestone.projectName}
        </div>
      )}
      <p style={{ fontSize: '0.9rem', color: '#666', margin: '0.5rem 0' }}>
        {milestone.description}
      </p>
      {milestone.dueDate && (
        <div style={{ fontSize: '0.8rem', color: '#666' }}>
          Due: {new Date(milestone.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>
            Milestones {!viewAllMilestones && selectedProject ? `- ${selectedProject.name}` : (viewAllMilestones ? '- All Projects' : '')}
          </h2>
          <div style={{ marginTop: '0.5rem' }}>
            <button 
              onClick={() => setViewAllMilestones(!viewAllMilestones)}
              style={{ background: 'none', border: 'none', color: '#2d3748', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
            >
              {viewAllMilestones ? (selectedProject ? 'Show Project Milestones' : 'Show No Milestones') : 'Show All Milestones'}
            </button>
            {!viewAllMilestones && selectedProject && (
              <span style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#666' }}>
                (Showing milestones from selected project)
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {selectedProject && (
            <button 
              className="btn btn-primary" 
              onClick={() => setSelectedMilestone({ id: 'project-time', title: 'Project Time Tracking', completed: false })}
            >
              ⏱ Log Project Time
            </button>
          )}
          <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Milestone'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card">
          <h3>Create New Milestone</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Milestone Title</label>
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
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-success">Create Milestone</button>
          </form>
        </div>
      )}

      <div className="grid grid-2">
        <div 
          className="task-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, false)}
          style={{ minHeight: '200px', border: '2px dashed transparent' }}
          onDragEnter={(e) => e.currentTarget.style.border = '2px dashed #007bff'}
          onDragLeave={(e) => e.currentTarget.style.border = '2px dashed transparent'}
        >
          <h3>Pending ({pendingMilestones.length})</h3>
          {pendingMilestones.map(milestone => (
            <MilestoneItem key={milestone.id} milestone={milestone} />
          ))}
        </div>

        <div 
          className="task-column"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, true)}
          style={{ minHeight: '200px', border: '2px dashed transparent' }}
          onDragEnter={(e) => e.currentTarget.style.border = '2px dashed #28a745'}
          onDragLeave={(e) => e.currentTarget.style.border = '2px dashed transparent'}
        >
          <h3>Completed ({completedMilestones.length})</h3>
          {completedMilestones.map(milestone => (
            <MilestoneItem key={milestone.id} milestone={milestone} />
          ))}
        </div>
      </div>

      {editingMilestone && (
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
              <h3>Edit Milestone</h3>
              <button onClick={() => setEditingMilestone(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateMilestone(editingMilestone.id, { ...editingMilestone, ...editFormData });
              setEditingMilestone(null);
            }}>
              <div className="form-group">
                <label>Milestone Title</label>
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
              
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={editFormData.dueDate}
                  onChange={(e) => setEditFormData({...editFormData, dueDate: e.target.value})}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-success">
                  Update Milestone
                </button>
                <button 
                  type="button"
                  className={`btn ${editingMilestone.completed ? 'btn-warning' : 'btn-success'}`}
                  onClick={() => {
                    toggleMilestone(editingMilestone);
                    setEditingMilestone(null);
                  }}
                >
                  Mark as {editingMilestone.completed ? 'Pending' : 'Completed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MilestoneBoard;