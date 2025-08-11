# Project Management Dashboard

A minimal, efficient web-based project management dashboard for modern development teams.

## Features

### ✅ Core Functionality
- **Project Creation & Management**: Create projects with descriptions, dates, and milestones
- **Task Management**: Create, assign, and prioritize tasks with Kanban board view
- **Progress Tracking**: Visual dashboard with statistics and progress indicators
- **Time Tracking**: Log hours against tasks with simple time logging
- **Team Collaboration**: Task assignments and status updates

### 📊 Dashboard Views
- **Dashboard**: Overview with project statistics and completion rates
- **Projects**: Project creation and management interface
- **Tasks**: Kanban-style task board with drag-and-drop functionality

## Quick Start

1. **Install Dependencies**
   ```bash
   cd project-management-dashboard
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

## Usage

### Creating Projects
1. Go to the "Projects" tab
2. Click "New Project"
3. Fill in project details including name, description, dates, and milestones
4. Click "Create Project"

### Managing Tasks
1. Go to the "Tasks" tab
2. Click "New Task" to create tasks
3. Assign tasks to team members and set priorities
4. Click on tasks to update status and log time
5. Tasks are organized in three columns: To Do, In Progress, Completed

### Tracking Progress
1. Visit the "Dashboard" tab for overview
2. View project statistics and completion rates
3. Monitor project health status
4. Track time logged across all tasks

## Data Storage
- All data is stored locally in browser localStorage
- No backend server required for basic functionality
- Data persists between browser sessions

## Architecture
- **Frontend**: React 18 with functional components and hooks
- **Styling**: Pure CSS with responsive design
- **State Management**: React useState and localStorage
- **Build Tool**: Create React App

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+