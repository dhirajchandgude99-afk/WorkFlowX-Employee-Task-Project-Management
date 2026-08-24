package com.dhiraj.workflowx.mapper;

import com.dhiraj.workflowx.dto.ProjectResponseDTO;
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
}