package com.dhiraj.workflowx.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.dhiraj.workflowx.dto.TaskRequestDTO;
import com.dhiraj.workflowx.dto.TaskResponseDTO;
import com.dhiraj.workflowx.entity.Employee;
import com.dhiraj.workflowx.entity.Project;
import com.dhiraj.workflowx.entity.Task;
import com.dhiraj.workflowx.exception.ResourceNotFoundException;
import com.dhiraj.workflowx.repository.EmployeeRepository;
import com.dhiraj.workflowx.repository.ProjectRepository;
import com.dhiraj.workflowx.repository.TaskRepository;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private TaskService taskService;

    private Task task;
    private Project project;
    private Employee employee;
    private TaskRequestDTO request;

    @BeforeEach
    void setUp() {

        project = new Project();
        project.setId(1L);
        project.setName("WorkflowX Project");

        employee = new Employee();
        employee.setId(1L);
        employee.setName("Dhiraj");

        task = new Task();
        task.setId(1L);
        task.setTitle("Implement API");
        task.setDescription("Create task APIs");
        task.setPriority("HIGH");
        task.setStatus("TODO");
        task.setDueDate(LocalDate.of(2026, 12, 31));
        task.setProject(project);
        task.setEmployee(employee);

        request = new TaskRequestDTO();
        request.setTitle("Implement API");
        request.setDescription("Create task APIs");
        request.setPriority("HIGH");
        request.setStatus("TODO");
        request.setDueDate(LocalDate.of(2026, 12, 31));
        request.setProjectId(1L);
        request.setEmployeeId(1L);
    }

    @Test
    void getAllTasks_shouldReturnTasks() {

        when(taskRepository.findAll())
                .thenReturn(List.of(task));

        List<TaskResponseDTO> result =
                taskService.getAllTasks();

        assertNotNull(result);
        assertEquals(1, result.size());

        verify(taskRepository, times(1))
                .findAll();
    }

    @Test
    void getTaskById_shouldReturnTask() {

        when(taskRepository.findById(1L))
                .thenReturn(Optional.of(task));

        TaskResponseDTO result =
                taskService.getTaskById(1L);

        assertNotNull(result);
        assertEquals("Implement API", result.getTitle());

        verify(taskRepository, times(1))
                .findById(1L);
    }

    @Test
    void getTaskById_shouldThrowExceptionWhenNotFound() {

        when(taskRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> taskService.getTaskById(999L)
                );

        assertEquals(
                "Task with ID 999 not found",
                exception.getMessage()
        );

        verify(taskRepository, times(1))
                .findById(999L);
    }

    @Test
    void createTask_shouldCreateTask() {

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        when(taskRepository.save(any(Task.class)))
                .thenReturn(task);

        TaskResponseDTO result =
                taskService.createTask(request);

        assertNotNull(result);
        assertEquals("Implement API", result.getTitle());

        verify(projectRepository, times(1))
                .findById(1L);

        verify(employeeRepository, times(1))
                .findById(1L);

        verify(taskRepository, times(1))
                .save(any(Task.class));
    }

    @Test
    void createTask_shouldThrowExceptionWhenProjectNotFound() {

        when(projectRepository.findById(999L))
                .thenReturn(Optional.empty());

        request.setProjectId(999L);

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> taskService.createTask(request)
                );

        assertEquals(
                "Project with ID 999 not found",
                exception.getMessage()
        );

        verify(projectRepository, times(1))
                .findById(999L);

        verify(employeeRepository, never())
                .findById(anyLong());

        verify(taskRepository, never())
                .save(any(Task.class));
    }

    @Test
    void createTask_shouldThrowExceptionWhenEmployeeNotFound() {

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        when(employeeRepository.findById(999L))
                .thenReturn(Optional.empty());

        request.setEmployeeId(999L);

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> taskService.createTask(request)
                );

        assertEquals(
                "Employee with ID 999 not found",
                exception.getMessage()
        );

        verify(projectRepository, times(1))
                .findById(1L);

        verify(employeeRepository, times(1))
                .findById(999L);

        verify(taskRepository, never())
                .save(any(Task.class));
    }

    @Test
    void updateTask_shouldUpdateTask() {

        when(taskRepository.findById(1L))
                .thenReturn(Optional.of(task));

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        when(taskRepository.save(any(Task.class)))
                .thenReturn(task);

        request.setTitle("Updated Task");
        request.setStatus("IN_PROGRESS");

        TaskResponseDTO result =
                taskService.updateTask(1L, request);

        assertNotNull(result);

        verify(taskRepository, times(1))
                .findById(1L);

        verify(projectRepository, times(1))
                .findById(1L);

        verify(employeeRepository, times(1))
                .findById(1L);

        verify(taskRepository, times(1))
                .save(task);
    }

    @Test
    void updateTask_shouldThrowExceptionWhenTaskNotFound() {

        when(taskRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> taskService.updateTask(999L, request)
                );

        assertEquals(
                "Task with ID 999 not found",
                exception.getMessage()
        );

        verify(taskRepository, times(1))
                .findById(999L);

        verify(projectRepository, never())
                .findById(anyLong());

        verify(employeeRepository, never())
                .findById(anyLong());

        verify(taskRepository, never())
                .save(any(Task.class));
    }

    @Test
    void updateTask_shouldThrowExceptionWhenProjectNotFound() {

        when(taskRepository.findById(1L))
                .thenReturn(Optional.of(task));

        when(projectRepository.findById(999L))
                .thenReturn(Optional.empty());

        request.setProjectId(999L);

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> taskService.updateTask(1L, request)
                );

        assertEquals(
                "Project with ID 999 not found",
                exception.getMessage()
        );

        verify(taskRepository, times(1))
                .findById(1L);

        verify(projectRepository, times(1))
                .findById(999L);

        verify(employeeRepository, never())
                .findById(anyLong());

        verify(taskRepository, never())
                .save(any(Task.class));
    }

    @Test
    void updateTask_shouldThrowExceptionWhenEmployeeNotFound() {

        when(taskRepository.findById(1L))
                .thenReturn(Optional.of(task));

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        when(employeeRepository.findById(999L))
                .thenReturn(Optional.empty());

        request.setEmployeeId(999L);

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> taskService.updateTask(1L, request)
                );

        assertEquals(
                "Employee with ID 999 not found",
                exception.getMessage()
        );

        verify(employeeRepository, times(1))
                .findById(999L);

        verify(taskRepository, never())
                .save(any(Task.class));
    }

    @Test
    void deleteTask_shouldDeleteTask() {

        when(taskRepository.findById(1L))
                .thenReturn(Optional.of(task));

        taskService.deleteTask(1L);

        verify(taskRepository, times(1))
                .findById(1L);

        verify(taskRepository, times(1))
                .delete(task);
    }

    @Test
    void deleteTask_shouldThrowExceptionWhenNotFound() {

        when(taskRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> taskService.deleteTask(999L)
                );

        assertEquals(
                "Task with ID 999 not found",
                exception.getMessage()
        );

        verify(taskRepository, times(1))
                .findById(999L);

        verify(taskRepository, never())
                .delete(any(Task.class));
    }
}