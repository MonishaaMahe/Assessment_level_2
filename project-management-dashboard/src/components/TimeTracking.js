import React, { useState, useEffect } from 'react';

function TimeTracking({ entityType, entityId, entityName, currentUser = 'demo-user' }) {
  const [timeEntries, setTimeEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [summary, setSummary] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    hoursSpent: '',
    description: ''
  });

  useEffect(() => {
    if (entityType && entityId) {
      fetchTimeEntries();
      fetchTimeSummary();
    }
  }, [entityType, entityId]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchTimeEntries = async () => {
    try {
      const param = entityType === 'PROJECT' ? 'projectId' : 'taskId';
      const response = await fetch(`http://localhost:8080/api/time-entries?${param}=${entityId}`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setTimeEntries(data);
      }
    } catch (error) {
      console.error('Error fetching time entries:', error);
    }
  };

  const fetchTimeSummary = async () => {
    try {
      const endpoint = entityType === 'PROJECT' ? 'projects' : 'tasks';
      const response = await fetch(`http://localhost:8080/api/${endpoint}/${entityId}/time-summary`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      }
    } catch (error) {
      console.error('Error fetching time summary:', error);
    }
  };

  const addTimeEntry = async () => {
    if (!formData.hoursSpent || formData.hoursSpent <= 0) return;
    
    try {
      const timeEntry = {
        userId: currentUser,
        [entityType === 'PROJECT' ? 'projectId' : 'taskId']: entityId,
        date: formData.date,
        hoursSpent: parseFloat(formData.hoursSpent),
        description: formData.description
      };

      const response = await fetch('http://localhost:8080/api/time-entries', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(timeEntry)
      });
      
      if (response.ok) {
        setFormData({ date: new Date().toISOString().split('T')[0], hoursSpent: '', description: '' });
        setShowForm(false);
        fetchTimeEntries();
        fetchTimeSummary();
      }
    } catch (error) {
      console.error('Error adding time entry:', error);
    }
  };

  return (
    <div style={{ marginTop: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h4>Time Tracking</h4>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? 'Cancel' : 'Log Time'}
        </button>
      </div>

      {summary && (
        <div style={{ 
          padding: '0.75rem', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px', 
          marginBottom: '1rem',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <span><strong>Total Hours:</strong> {summary.totalHours.toFixed(1)}h</span>
          <span><strong>Entries:</strong> {summary.entryCount}</span>
        </div>
      )}

      {showForm && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#f9f9f9', 
          borderRadius: '4px', 
          marginBottom: '1rem' 
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Hours</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={formData.hoursSpent}
                onChange={(e) => setFormData({...formData, hoursSpent: e.target.value})}
                placeholder="e.g. 2.5"
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="What did you work on?"
              style={{ width: '100%', minHeight: '60px', padding: '0.5rem' }}
            />
          </div>
          <button onClick={addTimeEntry} className="btn btn-success">Log Time</button>
        </div>
      )}

      <div>
        {timeEntries.map(entry => (
          <div key={entry.id} style={{ 
            padding: '0.75rem', 
            marginBottom: '0.5rem', 
            backgroundColor: '#f9f9f9', 
            borderRadius: '4px',
            borderLeft: '4px solid #007bff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontWeight: 'bold' }}>{entry.hoursSpent}h</span>
              <span style={{ fontSize: '0.8rem', color: '#666' }}>
                {entry.userId} • {new Date(entry.date).toLocaleDateString()}
              </span>
            </div>
            {entry.description && (
              <div style={{ fontSize: '0.9rem', color: '#555' }}>{entry.description}</div>
            )}
          </div>
        ))}
        {timeEntries.length === 0 && (
          <div style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '1rem' }}>
            No time entries yet
          </div>
        )}
      </div>
    </div>
  );
}

export default TimeTracking;