-- Insert sample projects
INSERT INTO projects (name, description, start_date, end_date, status, progress_percent, created_at, updated_at) VALUES
('E-commerce Platform', 'Build a modern e-commerce platform with React and Spring Boot', '2024-01-01', '2024-06-30', 'IN_PROGRESS', 25, NOW(), NOW());

-- Insert sample milestones
INSERT INTO milestones (title, description, due_date, completed, project_id) VALUES
('Database Design', 'Complete database schema design and setup', '2024-02-15', true, 1);

-- Insert sample tasks
INSERT INTO tasks (title, description, project_id, assigned_to_user_id, priority, status, due_date, created_at, updated_at) VALUES
('Setup Authentication', 'Implement user authentication system', 1, 'john.doe', 'HIGH', 'DONE', '2024-02-01', NOW(), NOW()),
('Create Product Catalog', 'Build product listing and search functionality', 1, 'jane.smith', 'MEDIUM', 'IN_PROGRESS', '2024-02-15', NOW(), NOW()),
('Payment Integration', 'Integrate payment gateway', 1, 'bob.wilson', 'HIGH', 'TODO', '2024-03-01', NOW(), NOW()),
('Order Management', 'Build order processing system', 1, 'alice.brown', 'MEDIUM', 'TODO', '2024-03-15', NOW(), NOW());

-- Insert sample team members
INSERT INTO team_members (user_id, name, email, role) VALUES
('john.doe', 'John Doe', 'john.doe@company.com', 'Developer'),
('jane.smith', 'Jane Smith', 'jane.smith@company.com', 'Frontend Developer'),
('bob.wilson', 'Bob Wilson', 'bob.wilson@company.com', 'Backend Developer'),
('alice.brown', 'Alice Brown', 'alice.brown@company.com', 'UI/UX Designer'),
('demo-user', 'Demo User', 'demo@company.com', 'Project Manager');

-- Insert sample comments
INSERT INTO comments (entity_type, entity_id, author_id, content, created_at) VALUES
('TASK', 1, 'jane.smith', 'Great work on the authentication! The JWT implementation looks solid.', NOW()),
('TASK', 2, 'john.doe', 'Need help with the search functionality? I can review the Elasticsearch integration.', NOW()),
('PROJECT', 1, 'bob.wilson', 'Project is progressing well. Let me know if you need any resources.', NOW());

-- Insert sample notifications
INSERT INTO notifications (recipient_id, message, type, is_read, created_at) VALUES
('john.doe', 'jane.smith commented on Task #1', 'COMMENT', false, NOW()),
('jane.smith', 'You have been assigned to Task #2: Create Product Catalog', 'ASSIGNMENT', false, NOW()),
('demo-user', 'Task #1 status changed to DONE', 'STATUS_UPDATE', true, NOW());

-- Insert sample users (password is 'password123' for all)
INSERT INTO users (username, password, email, full_name, created_at) VALUES
('admin', 'password123', 'admin@company.com', 'Admin User', NOW()),
('john.doe', 'password123', 'john.doe@company.com', 'John Doe', NOW()),
('jane.smith', 'password123', 'jane.smith@company.com', 'Jane Smith', NOW());

-- Insert sample time entries
INSERT INTO time_entries (user_id, project_id, task_id, date, hours_spent, description, created_at) VALUES
('john.doe', 1, 1, '2024-01-15', 4.5, 'Implemented JWT authentication and user login', NOW()),
('jane.smith', 1, 2, '2024-01-16', 6.0, 'Built product catalog UI components', NOW()),
('bob.wilson', 1, 3, '2024-01-17', 3.5, 'Research payment gateway integration options', NOW()),
('john.doe', 1, 1, '2024-01-18', 2.0, 'Fixed authentication bugs and added tests', NOW()),
('alice.brown', 1, 4, '2024-01-19', 5.0, 'Created wireframes for order management system', NOW());