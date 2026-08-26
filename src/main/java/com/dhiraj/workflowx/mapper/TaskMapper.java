package com.dhiraj.workflowx.mapper;

import com.dhiraj.workflowx.dto.TaskRequestDTO;
import com.dhiraj.workflowx.dto.TaskResponseDTO;
import com.dhiraj.workflowx.entity.Employee;
import com.dhiraj.workflowx.entity.Project;
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

    public static Task toEntity(
            TaskRequestDTO request,
            Project project,
            Employee employee) {

        Task task = new Task();

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());
        task.setProject(project);
        task.setEmployee(employee);

        return task;
    }
}