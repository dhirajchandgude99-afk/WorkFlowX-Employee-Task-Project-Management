package com.dhiraj.workflowx.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dhiraj.workflowx.dto.ProjectResponseDTO;
import com.dhiraj.workflowx.entity.Project;
import com.dhiraj.workflowx.service.ProjectService;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<ProjectResponseDTO> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{id}")
    public ProjectResponseDTO getProjectById(
            @PathVariable Long id) {

        return projectService.getProjectById(id);
    }

    @PostMapping
    public Project createProject(
            @RequestBody Project project) {

        return projectService.saveProject(project);
    }

    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Long id,
            @RequestBody Project project) {

        project.setId(id);

        return projectService.saveProject(project);
    }

    @DeleteMapping("/{id}")
    public String deleteProject(
            @PathVariable Long id) {

        projectService.deleteProject(id);

        return "Project deleted successfully";
    }
}