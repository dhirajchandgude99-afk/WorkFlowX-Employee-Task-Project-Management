package com.dhiraj.workflowx.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dhiraj.workflowx.dto.ProjectRequestDTO;
import com.dhiraj.workflowx.dto.ProjectResponseDTO;
import com.dhiraj.workflowx.entity.Employee;
import com.dhiraj.workflowx.entity.Project;
import com.dhiraj.workflowx.exception.ResourceNotFoundException;
import com.dhiraj.workflowx.mapper.ProjectMapper;
import com.dhiraj.workflowx.repository.EmployeeRepository;
import com.dhiraj.workflowx.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;

    public ProjectService(
            ProjectRepository projectRepository,
            EmployeeRepository employeeRepository) {

        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
    }

    public List<ProjectResponseDTO> getAllProjects() {

        return projectRepository.findAll()
                .stream()
                .map(ProjectMapper::toDTO)
                .toList();
    }

    public ProjectResponseDTO getProjectById(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project with ID " + id + " not found"
                        )
                );

        return ProjectMapper.toDTO(project);
    }

    public ProjectResponseDTO createProject(
            ProjectRequestDTO request) {

        Employee manager = employeeRepository.findById(
                request.getManagerId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Employee with ID " +
                        request.getManagerId() +
                        " not found"
                )
        );

        Project project = ProjectMapper.toEntity(request, manager);

        Project savedProject = projectRepository.save(project);

        return ProjectMapper.toDTO(savedProject);
    }

    public ProjectResponseDTO updateProject(
            Long id,
            ProjectRequestDTO request) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project with ID " + id + " not found"
                        )
                );

        Employee manager = employeeRepository.findById(
                request.getManagerId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Employee with ID " +
                        request.getManagerId() +
                        " not found"
                )
        );

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setStatus(request.getStatus());
        project.setManager(manager);

        Project updatedProject = projectRepository.save(project);

        return ProjectMapper.toDTO(updatedProject);
    }

    public void deleteProject(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Project with ID " + id + " not found"
                        )
                );

        projectRepository.delete(project);
    }
}