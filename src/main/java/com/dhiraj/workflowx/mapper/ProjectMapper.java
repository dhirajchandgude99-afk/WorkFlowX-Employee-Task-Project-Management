package com.dhiraj.workflowx.mapper;

import com.dhiraj.workflowx.dto.ProjectRequestDTO;
import com.dhiraj.workflowx.dto.ProjectResponseDTO;
import com.dhiraj.workflowx.entity.Employee;
import com.dhiraj.workflowx.entity.Project;

public class ProjectMapper {

    public static ProjectResponseDTO toDTO(Project project) {

        return new ProjectResponseDTO(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getStartDate(),
                project.getEndDate(),
                project.getStatus(),
                project.getManager().getId()
        );
    }

    public static Project toEntity(
            ProjectRequestDTO request,
            Employee manager) {

        Project project = new Project();

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setStartDate(request.getStartDate());
        project.setEndDate(request.getEndDate());
        project.setStatus(request.getStatus());
        project.setManager(manager);

        return project;
    }
}