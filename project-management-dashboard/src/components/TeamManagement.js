import React, { useState } from 'react';

function TeamManagement({ teamMembers, onAddTeamMember, onDeleteTeamMember, selectedProject, onFetchTeamMembers }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    role: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.userId.trim() && formData.name.trim() && formData.email.trim()) {
      onAddTeamMember(formData);
      setFormData({ userId: '', name: '', email: '', role: '' });
      setShowForm(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [viewAllTeamMembers, setViewAllTeamMembers] = useState(false);
  
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Team Members {selectedProject && !viewAllTeamMembers ? `- ${selectedProject.name}` : (viewAllTeamMembers ? '- All Projects' : '')}</h2>
          <div style={{ marginTop: '0.5rem' }}>
            <button 
              onClick={() => {
                setViewAllTeamMembers(!viewAllTeamMembers);
                onFetchTeamMembers(viewAllTeamMembers ? selectedProject?.id : null);
              }}
              style={{ background: 'none', border: 'none', color: '#2d3748', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
            >
              {viewAllTeamMembers ? (selectedProject ? 'Show Project Team' : 'Show No Team') : 'Show All Team Members'}
            </button>
            {selectedProject && !viewAllTeamMembers && (
              <span style={{ marginLeft: '1rem', fontSize: '0.8rem', color: '#666' }}>
                (Showing team from selected project)
              </span>
            )}
          </div>
        </div>
        <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Team Member'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>Add New Team Member</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label>User ID</label>
                <input
                  type="text"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-2">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Developer, Designer, etc."
                />
              </div>
            </div>
            <button type="submit" className="btn btn-success">Add Team Member</button>
          </form>
        </div>
      )}

      <div className="grid grid-2">
        {teamMembers.map(member => (
          <div key={member.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3>{member.name}</h3>
                <p style={{ color: '#666', margin: '0.5rem 0' }}>@{member.userId}</p>
                <p style={{ color: '#666', margin: '0.5rem 0' }}>{member.email}</p>
                {member.role && (
                  <span className="status-badge status-in-progress">{member.role}</span>
                )}
              </div>
              <button 
                className="btn btn-danger"
                onClick={() => onDeleteTeamMember(member.id)}
                style={{ padding: '0.5rem' }}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamManagement;