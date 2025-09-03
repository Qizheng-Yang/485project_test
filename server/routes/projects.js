const express = require('express');
const { v4: uuidv4 } = require('uuid');
const database = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All project routes require authentication
router.use(authenticateToken);

// Get all projects for the authenticated user
router.get('/', (req, res) => {
  try {
    const projects = database.findProjectsByUserId(req.user.id);
    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
});

// Get a specific project
router.get('/:id', (req, res) => {
  try {
    const project = database.findProjectById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Ensure user owns this project
    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to retrieve project' });
  }
});

// Create a new project
router.post('/', (req, res) => {
  try {
    const { title, introText, theme } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    const newProject = {
      id: uuidv4(),
      userId: req.user.id,
      title,
      introText: introText || 'In Loving Memory of',
      theme: theme || null,
      mainImage: null,
      slides: [],
      photos: [],
      music: [],
      effects: {
        transition: null,
        filter: null,
        background: null,
        border: null
      },
      status: 'draft', // draft, processing, completed, error
      videoUrl: null,
      previewUrl: null,
      shareableLink: null,
      enableFullAccess: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const success = database.createProject(newProject);
    if (!success) {
      return res.status(500).json({ error: 'Failed to create project' });
    }

    res.status(201).json({
      message: 'Project created successfully',
      project: newProject
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update a project
router.put('/:id', (req, res) => {
  try {
    const project = database.findProjectById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Ensure user owns this project
    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const allowedUpdates = [
      'title', 'introText', 'theme', 'mainImage', 'slides', 
      'photos', 'music', 'effects', 'enableFullAccess'
    ];
    
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const updatedProject = database.updateProject(req.params.id, updateData);
    if (!updatedProject) {
      return res.status(500).json({ error: 'Failed to update project' });
    }

    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete a project
router.delete('/:id', (req, res) => {
  try {
    const project = database.findProjectById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Ensure user owns this project
    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const success = database.deleteProject(req.params.id);
    if (!success) {
      return res.status(500).json({ error: 'Failed to delete project' });
    }

    res.json({ message: 'Project deleted successfully' });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;