const path = require('path');
const fs = require('fs');

class VideoService {
  constructor() {
    this.outputDir = path.join(__dirname, '../uploads/videos');
    this.ensureOutputDir();
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generatePreview(project) {
    try {
      console.log(`Generating preview for project: ${project.id}`);
      
      // Simulate video processing time
      await this.delay(2000);

      // In a real implementation, you would:
      // 1. Use ffmpeg to create a low-res slideshow
      // 2. Combine images with transitions
      // 3. Add text overlays
      // 4. Add background music (shortened)
      
      const previewFilename = `preview-${project.id}-${Date.now()}.mp4`;
      const previewPath = path.join(this.outputDir, previewFilename);
      
      // Create a placeholder file for now
      fs.writeFileSync(previewPath, 'Preview video placeholder');
      
      return {
        success: true,
        url: `/uploads/videos/${previewFilename}`,
        filename: previewFilename
      };

    } catch (error) {
      console.error('Preview generation error:', error);
      return { success: false, error: error.message };
    }
  }

  async generateFinalVideo(project) {
    try {
      console.log(`Generating final video for project: ${project.id}`);
      
      // Simulate longer processing time for final video
      await this.delay(5000);

      // In a real implementation, you would:
      // 1. Use ffmpeg to create a high-res video
      // 2. Apply all selected effects and transitions
      // 3. Combine all slides with proper timing
      // 4. Add full-quality audio
      // 5. Apply filters, borders, backgrounds
      
      const videoFilename = `final-${project.id}-${Date.now()}.mp4`;
      const videoPath = path.join(this.outputDir, videoFilename);
      
      // Create a placeholder file for now
      fs.writeFileSync(videoPath, 'Final video placeholder');
      
      return {
        success: true,
        url: `/uploads/videos/${videoFilename}`,
        filename: videoFilename
      };

    } catch (error) {
      console.error('Final video generation error:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper method to simulate processing time
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Method to get video processing status
  getProcessingStatus(projectId) {
    // In a real implementation, this would check the actual processing queue
    return {
      projectId,
      status: 'completed',
      progress: 100,
      estimatedTimeRemaining: 0
    };
  }

  // Method to validate project data before processing
  validateProjectData(project) {
    const errors = [];

    if (!project.title) {
      errors.push('Project title is required');
    }

    if (!project.slides || project.slides.length === 0) {
      errors.push('At least one slide is required');
    }

    if (project.slides) {
      project.slides.forEach((slide, index) => {
        if (!slide.backgroundImage) {
          errors.push(`Slide ${index + 1} is missing a background image`);
        }
        if (!slide.customText) {
          errors.push(`Slide ${index + 1} is missing text content`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = new VideoService();