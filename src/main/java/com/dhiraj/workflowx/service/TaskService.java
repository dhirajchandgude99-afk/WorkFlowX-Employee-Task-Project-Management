package com.dhiraj.workflowx.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dhiraj.workflowx.dto.TaskResponseDTO;
import com.dhiraj.workflowx.entity.Task;
import com.dhiraj.workflowx.exception.ResourceNotFoundException;
import com.dhiraj.workflowx.mapper.TaskMapper;
import com.dhiraj.workflowx.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<TaskResponseDTO> getAllTasks() {

        return taskRepository.findAll()
                .stream()
                .map(TaskMapper::toDTO)
                .toList();
    }

    public TaskResponseDTO getTaskById(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task with ID " + id + " not found"
                        )
                );

        return TaskMapper.toDTO(task);
    }

    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    public void deleteTask(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task with ID " + id + " not found"
                        )
                );

        taskRepository.delete(task);
    }
}