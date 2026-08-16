package com.dhiraj.workflowx.service;

import org.springframework.stereotype.Service;

import com.dhiraj.workflowx.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }
}