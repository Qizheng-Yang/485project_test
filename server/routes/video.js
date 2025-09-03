const express = require('express');
const { v4: uuidv4 } = require('uuid');
const database = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const videoService = require('../services/videoService');

const router = express.Router();

// All video routes require authentication
router.use(authenticateToken);

// Generate preview video
router.post('/preview/:projectId', async (req, res) => {
  try {
    const project = database.findProjectById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update project status
    database.updateProject(project.id, { status: 'processing' });

    // Generate preview (low resolution, fast)
    const previewResult = await videoService.generatePreview(project);
    
    if (previewResult.success) {
      // Update project with preview URL
      const updatedProject = database.updateProject(project.id, {
        previewUrl: previewResult.url,
        status: 'preview_ready'
      });

      res.json({
        message: 'Preview generated successfully',
        previewUrl: previewResult.url,
        project: updatedProject
      });
    } else {
      database.updateProject(project.id, { status: 'error' });
      res.status(500).json({ error: 'Failed to generate preview' });
    }

  } catch (error) {
    console.error('Preview generation error:', error);
    database.updateProject(req.params.projectId, { status: 'error' });
    res.status(500).json({ error: 'Failed to generate preview' });
  }
});

// Generate final video
router.post('/final/:projectId', async (req, res) => {
  try {
    const project = database.findProjectById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update project status
    database.updateProject(project.id, { status: 'processing' });

    // Generate final video (high resolution)
    const videoResult = await videoService.generateFinalVideo(project);
    
    if (videoResult.success) {
      // Generate shareable link
      const shareableLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/share/${uuidv4()}`;
      
      // Update project with video URL and shareable link
      const updatedProject = database.updateProject(project.id, {
        videoUrl: videoResult.url,
        shareableLink,
        status: 'completed'
      });

      res.json({
        message: 'Final video generated successfully',
        videoUrl: videoResult.url,
        shareableLink,
        project: updatedProject
      });
    } else {
      database.updateProject(project.id, { status: 'error' });
      res.status(500).json({ error: 'Failed to generate final video' });
    }

  } catch (error) {
    console.error('Final video generation error:', error);
    database.updateProject(req.params.projectId, { status: 'error' });
    res.status(500).json({ error: 'Failed to generate final video' });
  }
});

// Get video status
router.get('/status/:projectId', (req, res) => {
  try {
    const project = database.findProjectById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      status: project.status,
      previewUrl: project.previewUrl,
      videoUrl: project.videoUrl,
      shareableLink: project.shareableLink
    });

  } catch (error) {
    console.error('Get video status error:', error);
    res.status(500).json({ error: 'Failed to get video status' });
  }
});

module.exports = router;