const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.dbPath = path.join(__dirname, '../data');
    this.usersFile = path.join(this.dbPath, 'users.json');
    this.projectsFile = path.join(this.dbPath, 'projects.json');
    this.init();
  }

  init() {
    // Create data directory if it doesn't exist
    if (!fs.existsSync(this.dbPath)) {
      fs.mkdirSync(this.dbPath, { recursive: true });
    }

    // Initialize users file
    if (!fs.existsSync(this.usersFile)) {
      fs.writeFileSync(this.usersFile, JSON.stringify([], null, 2));
    }

    // Initialize projects file
    if (!fs.existsSync(this.projectsFile)) {
      fs.writeFileSync(this.projectsFile, JSON.stringify([], null, 2));
    }
  }

  // User operations
  getUsers() {
    try {
      const data = fs.readFileSync(this.usersFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading users:', error);
      return [];
    }
  }

  saveUsers(users) {
    try {
      fs.writeFileSync(this.usersFile, JSON.stringify(users, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving users:', error);
      return false;
    }
  }

  findUserByEmail(email) {
    const users = this.getUsers();
    return users.find(user => user.email === email);
  }

  findUserById(id) {
    const users = this.getUsers();
    return users.find(user => user.id === id);
  }

  createUser(userData) {
    const users = this.getUsers();
    users.push(userData);
    return this.saveUsers(users);
  }

  // Project operations
  getProjects() {
    try {
      const data = fs.readFileSync(this.projectsFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading projects:', error);
      return [];
    }
  }

  saveProjects(projects) {
    try {
      fs.writeFileSync(this.projectsFile, JSON.stringify(projects, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving projects:', error);
      return false;
    }
  }

  findProjectById(id) {
    const projects = this.getProjects();
    return projects.find(project => project.id === id);
  }

  findProjectsByUserId(userId) {
    const projects = this.getProjects();
    return projects.filter(project => project.userId === userId);
  }

  createProject(projectData) {
    const projects = this.getProjects();
    projects.push(projectData);
    return this.saveProjects(projects);
  }

  updateProject(id, updateData) {
    const projects = this.getProjects();
    const index = projects.findIndex(project => project.id === id);
    
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updateData, updatedAt: new Date().toISOString() };
      return this.saveProjects(projects) ? projects[index] : null;
    }
    return null;
  }

  deleteProject(id) {
    const projects = this.getProjects();
    const filteredProjects = projects.filter(project => project.id !== id);
    return this.saveProjects(filteredProjects);
  }
}

module.exports = new Database();