import React, { useState } from 'react';

function ProjectList({ projects, onAddProject, onSelectProject, statusFilter, onClearFilter, teamMembers = [], user, onUpdateProject, allTeamMembers = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showProjectList, setShowProjectList] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    assignedDevelopers: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      await onAddProject(formData);
      setFormData({ name: '', description: '', startDate: '', endDate: '', assignedDevelopers: [] });
      setShowForm(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Projects</h2>
          {statusFilter && (
            <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              Showing: {statusFilter.replace('_', ' ')} projects
              <button onClick={onClearFilter} style={{ marginLeft: '1rem', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}>Show All</button>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Project'}
          </button>
          <div style={{ position: 'relative' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                if (projects.length > 0) {
                  setShowProjectDropdown(!showProjectDropdown);
                } else {
                  alert('No projects to edit');
                }
              }}
            >
              Edit Project
            </button>
            
            {showProjectDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '0.5rem',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                minWidth: '200px',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 1000
              }}>
                {projects.map(project => (
                  <div
                    key={project.id}
                    onClick={() => {
                      setEditingProject(project);
                      // Get assigned developers for this project
                      const projectDevelopers = (allTeamMembers.length > 0 ? allTeamMembers : teamMembers)
                        .filter(m => m.projectId === project.id && (m.role === 'Developer' || m.role === 'developer'))
                        .map(m => m.userId);
                      
                      setFormData({
                        name: project.name,
                        description: project.description,
                        startDate: project.startDate || '',
                        endDate: project.endDate || '',
                        assignedDevelopers: projectDevelopers
                      });
                      setShowProjectDropdown(false);
                    }}
                    style={{
                      padding: '0.75rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    <div style={{ fontWeight: '500' }}>{project.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>{project.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <button 
            onClick={() => setShowProjectList(!showProjectList)}
            style={{ background: 'none', border: 'none', color: '#000000', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
          >
            {showProjectList ? 'Hide Project List' : 'Show All Projects List'}
          </button>
        </div>
      </div>

      {(showForm || editingProject) && (
        <div className="card">
          <h3>{editingProject ? 'Edit Project' : 'Create New Project'}</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (editingProject) {
              onUpdateProject(editingProject.id, formData);
              setEditingProject(null);
            } else {
              handleSubmit(e);
            }
            setFormData({ name: '', description: '', startDate: '', endDate: '', assignedDevelopers: [] });
          }}>
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
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
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {(user?.role === 'Project Manager' || user?.role === 'Admin' || localStorage.getItem('userRole') === 'Project Manager' || localStorage.getItem('userRole') === 'Admin') && (
              <div className="form-group">
                <label>Assign Developers</label>
                {console.log('All team members:', allTeamMembers.length > 0 ? allTeamMembers : teamMembers)}
                {console.log('Developers only:', (allTeamMembers.length > 0 ? allTeamMembers : teamMembers).filter(m => m.role === 'Developer' || m.role === 'developer'))}
                <div style={{ border: '1px solid #ddd', padding: '0.5rem', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
                  {(allTeamMembers.length > 0 ? allTeamMembers : teamMembers).filter(m => m.role === 'Developer' || m.role === 'developer').map(member => (
                    <div key={member.userId} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <input
                        type="checkbox"
                        id={`dev-${member.userId}`}
                        checked={formData.assignedDevelopers.includes(member.userId)}
                        onChange={(e) => {
                          const developers = e.target.checked 
                            ? [...formData.assignedDevelopers, member.userId]
                            : formData.assignedDevelopers.filter(id => id !== member.userId);
                          setFormData({ ...formData, assignedDevelopers: developers });
                        }}
                      />
                      <label htmlFor={`dev-${member.userId}`} style={{ marginLeft: '0.5rem', cursor: 'pointer' }}>
                        {member.name}
                      </label>
                    </div>
                  ))}
                  {(allTeamMembers.length > 0 ? allTeamMembers : teamMembers).filter(m => m.role === 'Developer' || m.role === 'developer').length === 0 && (
                    <p style={{ color: '#666', fontStyle: 'italic', margin: 0 }}>No developers available</p>
                  )}
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-success">
              {editingProject ? 'Update Project' : 'Create Project'}
            </button>
            {editingProject && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setEditingProject(null);
                  setFormData({ name: '', description: '', startDate: '', endDate: '', assignedDevelopers: [] });
                }}
                style={{ marginLeft: '1rem' }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      )}

      {showProjectList && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3>All Projects</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {projects.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No projects available</p>
            ) : (
              projects.map(project => (
                <div key={project.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.75rem',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer'
                }} onClick={() => {
                  setEditingProject(project);
                  // Get assigned developers for this project
                  const projectDevelopers = (allTeamMembers.length > 0 ? allTeamMembers : teamMembers)
                    .filter(m => m.projectId === project.id && (m.role === 'Developer' || m.role === 'developer'))
                    .map(m => m.userId);
                  
                  setFormData({
                    name: project.name,
                    description: project.description,
                    startDate: project.startDate || '',
                    endDate: project.endDate || '',
                    assignedDevelopers: projectDevelopers
                  });
                }}>
                  <div>
                    <strong>{project.name}</strong>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>{project.description}</div>
                  </div>
                  <span className={`status-badge status-${project.status === 'NEW' ? 'todo' : project.status === 'IN_PROGRESS' ? 'in-progress' : 'completed'}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="grid grid-2">
        {projects.length === 0 ? (
          <div className="card">
            <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
              No projects yet. Create your first project to get started!
            </p>
          </div>
        ) : (
          projects.map(project => (
            <div key={project.id} className="card" style={{ cursor: 'pointer' }} onClick={() => onSelectProject(project)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3>{project.name}</h3>
                <span className={`status-badge status-${project.status === 'NEW' ? 'todo' : project.status === 'IN_PROGRESS' ? 'in-progress' : 'completed'}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
              <p style={{ color: '#666', marginBottom: '1rem' }}>{project.description}</p>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Milestones:</strong> {project.milestones?.length || 0}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
                <span>Start: {project.startDate || 'Not set'}</span>
                <span>End: {project.endDate || 'Not set'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProjectList;