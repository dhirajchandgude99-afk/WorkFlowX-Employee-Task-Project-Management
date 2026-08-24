package com.dhiraj.workflowx.mapper;

import com.dhiraj.workflowx.dto.TaskResponseDTO;
import com.dhiraj.workflowx.entity.Task;

public class TaskMapper {

    public static TaskResponseDTO toDTO(Task task) {

        return new TaskResponseDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getPriority(),
                task.getStatus(),
                task.getDueDate(),
                task.getProject().getId(),
                task.getEmployee().getId()
        );
    }
}
