package com.dhiraj.workflowx.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dhiraj.workflowx.dto.TaskRequestDTO;
import com.dhiraj.workflowx.dto.TaskResponseDTO;
import com.dhiraj.workflowx.entity.Employee;
import com.dhiraj.workflowx.entity.Project;
import com.dhiraj.workflowx.entity.Task;
import com.dhiraj.workflowx.exception.ResourceNotFoundException;
import com.dhiraj.workflowx.mapper.TaskMapper;
import com.dhiraj.workflowx.repository.EmployeeRepository;
import com.dhiraj.workflowx.repository.ProjectRepository;
import com.dhiraj.workflowx.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;

    public TaskService(
            TaskRepository taskRepository,
            ProjectRepository projectRepository,
            EmployeeRepository employeeRepository) {

        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
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

    public TaskResponseDTO createTask(
            TaskRequestDTO request) {

        Project project = projectRepository.findById(
                request.getProjectId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Project with ID " +
                        request.getProjectId() +
                        " not found"
                )
        );

        Employee employee = employeeRepository.findById(
                request.getEmployeeId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Employee with ID " +
                        request.getEmployeeId() +
                        " not found"
                )
        );

        Task task = TaskMapper.toEntity(
                request,
                project,
                employee
        );

        Task savedTask = taskRepository.save(task);

        return TaskMapper.toDTO(savedTask);
    }

    public TaskResponseDTO updateTask(
            Long id,
            TaskRequestDTO request) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Task with ID " + id + " not found"
                        )
                );

        Project project = projectRepository.findById(
                request.getProjectId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Project with ID " +
                        request.getProjectId() +
                        " not found"
                )
        );

        Employee employee = employeeRepository.findById(
                request.getEmployeeId()
        ).orElseThrow(() ->
                new ResourceNotFoundException(
                        "Employee with ID " +
                        request.getEmployeeId() +
                        " not found"
                )
        );

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());
        task.setProject(project);
        task.setEmployee(employee);

        Task updatedTask = taskRepository.save(task);

        return TaskMapper.toDTO(updatedTask);
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