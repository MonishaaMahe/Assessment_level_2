import React from 'react';

function Dashboard({ projects, onNavigate, onSelectProject }) {
  const totalProjects = projects.length;
  const totalMilestones = projects.reduce((acc, project) => acc + (project.milestones?.length || 0), 0);
  const completedMilestones = projects.reduce((acc, project) => 
    acc + (project.milestones?.filter(m => m.completed).length || 0), 0);
  const inProgressProjects = projects.filter(p => p.status === 'IN_PROGRESS').length;
  
  const projectsByStatus = {
    'New': projects.filter(p => p.status === 'NEW').length,
    'In Progress': projects.filter(p => p.status === 'IN_PROGRESS').length,
    'Completed': projects.filter(p => p.status === 'COMPLETED').length
  };

  const completionRate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <div>
      <h2>Dashboard Overview</h2>
      
      <div className="stats-grid">
        <div className="stat-card" onClick={() => onNavigate('projects')} style={{ cursor: 'pointer' }}>
          <div className="stat-number">{totalProjects}</div>
          <div className="stat-label">Total Projects</div>
        </div>
        <div className="stat-card" onClick={() => onNavigate('milestones')} style={{ cursor: 'pointer' }}>
          <div className="stat-number">{totalMilestones}</div>
          <div className="stat-label">Total Milestones</div>
        </div>
        <div className="stat-card" onClick={() => onNavigate('milestones')} style={{ cursor: 'pointer' }}>
          <div className="stat-number">{completedMilestones}</div>
          <div className="stat-label">Completed Milestones</div>
        </div>
        <div className="stat-card" onClick={() => onNavigate('milestones')} style={{ cursor: 'pointer' }}>
          <div className="stat-number">{completionRate}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>Project Status</h3>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', cursor: 'pointer' }} onClick={() => onNavigate('projects', 'NEW')}>
              <span>New</span>
              <span className="status-badge status-todo">{projectsByStatus['New']}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', cursor: 'pointer' }} onClick={() => onNavigate('projects', 'IN_PROGRESS')}>
              <span>In Progress</span>
              <span className="status-badge status-in-progress">{projectsByStatus['In Progress']}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => onNavigate('projects', 'COMPLETED')}>
              <span>Completed</span>
              <span className="status-badge status-completed">{projectsByStatus['Completed']}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Milestone Progress</h3>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Overall Progress</span>
                <span>{completionRate}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
              <span>In Progress: {inProgressProjects}</span>
              <span>Completed: {completedMilestones}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Recent Projects</h3>
        {projects.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic' }}>No projects created yet</p>
        ) : (
          <div style={{ marginTop: '1rem' }}>
            {projects.slice(-3).map(project => (
              <div key={project.id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid #eee',
                cursor: 'pointer'
              }}
              onClick={() => {
                onSelectProject(project);
                onNavigate('milestones');
              }}>
                <div>
                  <strong>{project.name}</strong>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>{project.description}</div>
                </div>
                <span className={`status-badge status-${project.status === 'NEW' ? 'todo' : project.status === 'IN_PROGRESS' ? 'in-progress' : 'completed'}`}>
                  {project.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;