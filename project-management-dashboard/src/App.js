import React, { useState, useEffect } from 'react';
import ProjectList from './components/ProjectList';
import MilestoneBoard from './components/MilestoneBoard';
import TaskBoard from './components/TaskBoard';
import TeamManagement from './components/TeamManagement';
import Dashboard from './components/Dashboard';
import Notifications from './components/Notifications';
import Login from './components/Login';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [allTasks, setAllTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [allTeamMembers, setAllTeamMembers] = useState([]);
  
  const fetchAllTeamMembers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/team-members', {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setAllTeamMembers(data);
      }
    } catch (error) {
      console.error('Error fetching all team members:', error);
    }
  };
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const fullName = localStorage.getItem('fullName');
    
    if (token && username) {
      setUser({ token, username, fullName });
      fetchProjects();
      fetchAllTasks();
      fetchTeamMembers();
    }
    setLoading(false);
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchProjects = async () => {
    try {
      const userRole = localStorage.getItem('userRole') || 'Admin';
      const username = localStorage.getItem('username');
      console.log('Fetching projects for:', username, 'with role:', userRole);
      const url = `http://localhost:8080/api/projects?userId=${username}&role=${userRole}`;
      
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched projects:', data.length);
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchAllTasks = async () => {
    try {
      const userRole = localStorage.getItem('userRole') || 'Admin';
      const username = localStorage.getItem('username');
      const url = `http://localhost:8080/api/tasks?userId=${username}&role=${userRole}`;
      
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setAllTasks(data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchTeamMembers = async (projectId = null) => {
    try {
      let url = 'http://localhost:8080/api/team-members';
      if (projectId) {
        url += `?projectId=${projectId}`;
      }
      
      console.log('Fetching team members from:', url);
      const response = await fetch(url, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Team members fetched:', data);
        setTeamMembers(data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const addTeamMember = async (member) => {
    try {
      // Check if member already exists for this project
      const existingMember = teamMembers.find(m => 
        m.userId === member.userId && m.projectId === member.projectId
      );
      
      if (!existingMember) {
        const response = await fetch('http://localhost:8080/api/team-members', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(member),
        });
        if (response.ok) {
          fetchTeamMembers();
        }
      }
    } catch (error) {
      console.error('Error creating team member:', error);
    }
  };

  const deleteTeamMember = async (memberId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/team-members/${memberId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };



  const updateProject = async (projectId, projectData) => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
      });
      
      if (response.ok) {
        fetchProjects();
      } else {
        console.error('Failed to update project:', response.status);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const addProject = async (project) => {
    try {
      console.log('Creating project:', project);
      const username = localStorage.getItem('username');
      const response = await fetch('http://localhost:8080/api/projects', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: project.name,
          description: project.description,
          startDate: project.startDate || '',
          endDate: project.endDate || '',
          createdBy: username,
          assignedDevelopers: project.assignedDevelopers || []
        }),
      });
      
      if (response.ok) {
        const newProject = await response.json();
        console.log('Project created:', newProject);
        fetchProjects(); // Refetch to ensure consistency
        fetchAllTeamMembers(); // Refresh team members
      } else {
        const errorText = await response.text();
        console.error('Failed to create project:', response.status, errorText);
        alert('Failed to create project: ' + errorText);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const addMilestone = async (projectId, milestone) => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}/milestones`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: milestone.title,
          description: milestone.description,
          dueDate: milestone.dueDate,
          completed: false
        }),
      });
      if (response.ok) {
        await fetchProjects();
        // Find updated project from current projects state
        const updatedProject = projects.find(p => p.id === projectId);
        if (updatedProject) {
          // Refetch the specific project to get updated milestones
          const projectResponse = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
            headers: getAuthHeaders()
          });
          if (projectResponse.ok) {
            const refreshedProject = await projectResponse.json();
            setSelectedProject(refreshedProject);
          }
        }
      }
    } catch (error) {
      console.error('Error creating milestone:', error);
    }
  };

  const updateMilestone = async (milestoneId, updates) => {
    try {
      const response = await fetch(`http://localhost:8080/api/milestones/${milestoneId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        await fetchProjects();
        const updatedProjects = await fetch('http://localhost:8080/api/projects').then(r => r.json());
        const updatedProject = updatedProjects.find(p => p.id === selectedProject?.id);
        
        // Check if all milestones are completed and update project status
        if (updatedProject?.milestones?.length > 0) {
          const allCompleted = updatedProject.milestones.every(m => m.completed);
          if (allCompleted && updatedProject.status !== 'COMPLETED') {
            await fetch(`http://localhost:8080/api/projects/${updatedProject.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...updatedProject, status: 'COMPLETED' })
            });
            await fetchProjects();
            const finalProjects = await fetch('http://localhost:8080/api/projects').then(r => r.json());
            setSelectedProject(finalProjects.find(p => p.id === selectedProject?.id));
          } else {
            setSelectedProject(updatedProject);
          }
        } else {
          setSelectedProject(updatedProject);
        }
      }
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  const addTask = async (projectId, task) => {
    try {
      const response = await fetch(`http://localhost:8080/api/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
      });
      if (response.ok) {
        // If task is assigned to someone, add them as project team member
        if (task.assignedToUserId) {
          const assignedMember = teamMembers.find(m => m.userId === task.assignedToUserId);
          if (assignedMember) {
            await addTeamMember({
              userId: assignedMember.userId,
              name: assignedMember.name,
              email: assignedMember.email,
              role: assignedMember.role,
              projectId: projectId
            });
          }
        }
        
        await fetchProjects();
        await fetchAllTasks();
        await fetchTeamMembers();
        const updatedProjects = await fetch('http://localhost:8080/api/projects').then(r => r.json());
        const updatedProject = updatedProjects.find(p => p.id === projectId);
        setSelectedProject(updatedProject);
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        // If task is assigned to someone, add them as project team member
        if (updates.assignedToUserId && selectedProject) {
          const assignedMember = teamMembers.find(m => m.userId === updates.assignedToUserId);
          if (assignedMember) {
            await addTeamMember({
              ...assignedMember,
              projectId: selectedProject.id
            });
          }
        }
        
        await fetchProjects();
        await fetchAllTasks();
        await fetchTeamMembers();
        const updatedProjects = await fetch('http://localhost:8080/api/projects').then(r => r.json());
        const updatedProject = updatedProjects.find(p => p.id === selectedProject?.id);
        setSelectedProject(updatedProject);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchProjects();
        await fetchAllTasks();
        const updatedProjects = await fetch('http://localhost:8080/api/projects').then(r => r.json());
        const updatedProject = updatedProjects.find(p => p.id === selectedProject?.id);
        setSelectedProject(updatedProject);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    fetchProjects();
    fetchAllTasks();
    fetchTeamMembers();
    fetchAllTeamMembers();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h1>Project Management Dashboard</h1>
        <div className="nav-buttons">
          <button 
            className={currentView === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentView('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={currentView === 'projects' ? 'active' : ''}
            onClick={() => setCurrentView('projects')}
          >
            Projects
          </button>
          <button 
            className={currentView === 'milestones' ? 'active' : ''}
            onClick={() => setCurrentView('milestones')}
          >
            Milestones
          </button>
          <button 
            className={currentView === 'tasks' ? 'active' : ''}
            onClick={() => setCurrentView('tasks')}
          >
            Tasks
          </button>
          <button 
            className={currentView === 'team' ? 'active' : ''}
            onClick={() => setCurrentView('team')}
          >
            Team
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>Welcome, {user?.fullName || user?.username} ({localStorage.getItem('userRole') || 'Admin'})</span>
          <button 
            onClick={() => {
              localStorage.clear();
              setUser(null);
            }}
            style={{ 
              background: '#e74c3c', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentView === 'dashboard' && (
          <Dashboard 
            projects={projects} 
            onNavigate={(view, filter) => {
              setCurrentView(view);
              setStatusFilter(filter);
            }}
            onSelectProject={setSelectedProject}
          />
        )}
        {currentView === 'projects' && (
          <ProjectList 
            projects={statusFilter ? projects.filter(p => p.status === statusFilter) : projects}
            onAddProject={addProject}
            onSelectProject={(project) => {
              setSelectedProject(project);
              setCurrentView('milestones');
            }}
            statusFilter={statusFilter}
            onClearFilter={() => setStatusFilter(null)}
            teamMembers={teamMembers}
            user={user}
            onUpdateProject={updateProject}
            allTeamMembers={allTeamMembers}
          />
        )}
        {currentView === 'milestones' && (
          <MilestoneBoard 
            selectedProject={selectedProject}
            allProjects={projects}
            onAddMilestone={addMilestone}
            onUpdateMilestone={updateMilestone}
          />
        )}
        {currentView === 'tasks' && (
          <TaskBoard 
            selectedProject={selectedProject}
            allTasks={allTasks}
            teamMembers={teamMembers}
            projects={projects}
            onAddTask={addTask}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
          />
        )}
        {currentView === 'team' && (
          <TeamManagement 
            teamMembers={teamMembers}
            selectedProject={selectedProject}
            onAddTeamMember={addTeamMember}
            onDeleteTeamMember={deleteTeamMember}
            onFetchTeamMembers={fetchTeamMembers}
          />
        )}
      </main>
    </div>
  );
}

export default App;