import React, { createContext, useState, useContext } from 'react';
import { projectsAPI } from '../services/api';

interface Project {
  id: string;
  userId: string;
  title: string;
  introText: string;
  theme: string | null;
  mainImage: string | null;
  slides: any[];
  photos: any[];
  music: any[];
  effects: {
    transition: string | null;
    filter: string | null;
    background: string | null;
    border: string | null;
  };
  status: 'draft' | 'processing' | 'completed' | 'error';
  videoUrl: string | null;
  previewUrl: string | null;
  shareableLink: string | null;
  enableFullAccess: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProjectContextType {
  currentProject: Project | null;
  projects: Project[];
  isLoading: boolean;
  createProject: (title: string, introText?: string) => Promise<Project>;
  loadProject: (id: string) => Promise<void>;
  updateProject: (updateData: Partial<Project>) => Promise<void>;
  saveProject: () => Promise<void>;
  loadUserProjects: () => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createProject = async (title: string, introText = 'In Loving Memory of'): Promise<Project> => {
    try {
      setIsLoading(true);
      const response = await projectsAPI.createProject({ title, introText });
      const newProject = response.project;
      setCurrentProject(newProject);
      setProjects(prev => [...prev, newProject]);
      return newProject;
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loadProject = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await projectsAPI.getProject(id);
      setCurrentProject(response.project);
    } catch (error) {
      console.error('Failed to load project:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProject = async (updateData: Partial<Project>): Promise<void> => {
    if (!currentProject) {
      throw new Error('No current project to update');
    }

    try {
      const response = await projectsAPI.updateProject(currentProject.id, updateData);
      const updatedProject = response.project;
      setCurrentProject(updatedProject);
      
      // Update in projects list
      setProjects(prev => 
        prev.map(p => p.id === updatedProject.id ? updatedProject : p)
      );
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  };

  const saveProject = async (): Promise<void> => {
    if (!currentProject) {
      throw new Error('No current project to save');
    }

    // This method can be used to explicitly save current state
    // For now, it's the same as updateProject with current data
    await updateProject({});
  };

  const loadUserProjects = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await projectsAPI.getProjects();
      setProjects(response.projects);
    } catch (error) {
      console.error('Failed to load projects:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      await projectsAPI.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      
      // Clear current project if it was deleted
      if (currentProject?.id === id) {
        setCurrentProject(null);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  };

  return (
    <ProjectContext.Provider value={{
      currentProject,
      projects,
      isLoading,
      createProject,
      loadProject,
      updateProject,
      saveProject,
      loadUserProjects,
      deleteProject
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};