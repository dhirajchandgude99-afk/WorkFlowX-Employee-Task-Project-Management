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

import com.dhiraj.workflowx.dto.TaskRequestDTO;
import com.dhiraj.workflowx.dto.TaskResponseDTO;
import com.dhiraj.workflowx.service.TaskService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
@Tag(
    name = "Task APIs",
    description = "APIs for managing WorkflowX tasks"
)
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @Operation(
        summary = "Get all tasks",
        description = "Returns a list of all tasks"
    )
    @GetMapping
    public List<TaskResponseDTO> getAllTasks() {
        return taskService.getAllTasks();
    }

    @Operation(
        summary = "Get task by ID",
        description = "Returns a task using the specified task ID"
    )
    @GetMapping("/{id}")
    public TaskResponseDTO getTaskById(
            @PathVariable Long id) {

        return taskService.getTaskById(id);
    }

    @Operation(
        summary = "Create a new task",
        description = "Creates a new WorkflowX task"
    )
    @PostMapping
    public TaskResponseDTO createTask(
            @Valid @RequestBody TaskRequestDTO request) {

        return taskService.createTask(request);
    }

    @Operation(
        summary = "Update a task",
        description = "Updates an existing task using the specified task ID"
    )
    @PutMapping("/{id}")
    public TaskResponseDTO updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequestDTO request) {

        return taskService.updateTask(id, request);
    }

    @Operation(
        summary = "Delete a task",
        description = "Deletes an existing task using the specified task ID"
    )
    @DeleteMapping("/{id}")
    public String deleteTask(
            @PathVariable Long id) {

        taskService.deleteTask(id);

        return "Task deleted successfully";
    }
}