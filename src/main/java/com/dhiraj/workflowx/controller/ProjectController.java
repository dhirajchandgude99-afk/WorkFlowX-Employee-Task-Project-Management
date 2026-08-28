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

import com.dhiraj.workflowx.dto.ProjectRequestDTO;
import com.dhiraj.workflowx.dto.ProjectResponseDTO;
import com.dhiraj.workflowx.service.ProjectService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/projects")
@Tag(
    name = "Project APIs",
    description = "APIs for managing WorkflowX projects"
)
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @Operation(
        summary = "Get all projects",
        description = "Returns a list of all projects"
    )
    @GetMapping
    public List<ProjectResponseDTO> getAllProjects() {
        return projectService.getAllProjects();
    }

    @Operation(
        summary = "Get project by ID",
        description = "Returns a project using the specified project ID"
    )
    @GetMapping("/{id}")
    public ProjectResponseDTO getProjectById(
            @PathVariable Long id) {

        return projectService.getProjectById(id);
    }

    @Operation(
        summary = "Create a new project",
        description = "Creates a new WorkflowX project"
    )
    @PostMapping
    public ProjectResponseDTO createProject(
            @Valid @RequestBody ProjectRequestDTO request) {

        return projectService.createProject(request);
    }

    @Operation(
        summary = "Update a project",
        description = "Updates an existing project using the specified project ID"
    )
    @PutMapping("/{id}")
    public ProjectResponseDTO updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectRequestDTO request) {

        return projectService.updateProject(id, request);
    }

    @Operation(
        summary = "Delete a project",
        description = "Deletes an existing project using the specified project ID"
    )
    @DeleteMapping("/{id}")
    public String deleteProject(
            @PathVariable Long id) {

        projectService.deleteProject(id);

        return "Project deleted successfully";
    }
}