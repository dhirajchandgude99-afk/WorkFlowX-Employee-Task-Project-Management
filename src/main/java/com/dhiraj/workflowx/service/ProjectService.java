package com.dhiraj.workflowx.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dhiraj.workflowx.entity.Project;
import com.dhiraj.workflowx.exception.ResourceNotFoundException;
import com.dhiraj.workflowx.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {

        return projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project not found with id: " + id
                        )
                );
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {

    if (!projectRepository.existsById(id)) {
        throw new ResourceNotFoundException(
                "Project not found with id: " + id
        );
     }

     projectRepository.deleteById(id);
    }
}