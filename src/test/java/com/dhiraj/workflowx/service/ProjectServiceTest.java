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

import com.dhiraj.workflowx.dto.ProjectRequestDTO;
import com.dhiraj.workflowx.dto.ProjectResponseDTO;
import com.dhiraj.workflowx.entity.Employee;
import com.dhiraj.workflowx.entity.Project;
import com.dhiraj.workflowx.exception.ResourceNotFoundException;
import com.dhiraj.workflowx.repository.EmployeeRepository;
import com.dhiraj.workflowx.repository.ProjectRepository;

@ExtendWith(MockitoExtension.class)
class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private ProjectService projectService;

    private Project project;
    private Employee employee;
    private ProjectRequestDTO request;

    @BeforeEach
    void setUp() {

        employee = new Employee();
        employee.setId(1L);
        employee.setName("Dhiraj");

        project = new Project();
        project.setId(1L);
        project.setName("WorkflowX");
        project.setDescription("Employee management project");
        project.setStartDate(LocalDate.of(2026, 1, 1));
        project.setEndDate(LocalDate.of(2026, 12, 31));
        project.setStatus("ACTIVE");
        project.setManager(employee);

        request = new ProjectRequestDTO();
        request.setName("WorkflowX");
        request.setDescription("Employee management project");
        request.setStartDate(LocalDate.of(2026, 1, 1));
        request.setEndDate(LocalDate.of(2026, 12, 31));
        request.setStatus("ACTIVE");
        request.setManagerId(1L);
    }

    @Test
    void getAllProjects_shouldReturnProjects() {

        when(projectRepository.findAll())
                .thenReturn(List.of(project));

        List<ProjectResponseDTO> result =
                projectService.getAllProjects();

        assertNotNull(result);
        assertEquals(1, result.size());

        verify(projectRepository, times(1))
                .findAll();
    }

    @Test
    void getProjectById_shouldReturnProject() {

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        ProjectResponseDTO result =
                projectService.getProjectById(1L);

        assertNotNull(result);
        assertEquals("WorkflowX", result.getName());

        verify(projectRepository, times(1))
                .findById(1L);
    }

    @Test
    void getProjectById_shouldThrowExceptionWhenNotFound() {

        when(projectRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> projectService.getProjectById(999L)
                );

        assertEquals(
                "Project with ID 999 not found",
                exception.getMessage()
        );
    }

    @Test
    void createProject_shouldCreateProject() {

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        when(projectRepository.save(any(Project.class)))
                .thenReturn(project);

        ProjectResponseDTO result =
                projectService.createProject(request);

        assertNotNull(result);
        assertEquals("WorkflowX", result.getName());

        verify(employeeRepository, times(1))
                .findById(1L);

        verify(projectRepository, times(1))
                .save(any(Project.class));
    }

    @Test
    void createProject_shouldThrowExceptionWhenManagerNotFound() {

        when(employeeRepository.findById(999L))
                .thenReturn(Optional.empty());

        request.setManagerId(999L);

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> projectService.createProject(request)
                );

        assertEquals(
                "Employee with ID 999 not found",
                exception.getMessage()
        );

        verify(projectRepository, never())
                .save(any(Project.class));
    }

    @Test
    void updateProject_shouldUpdateProject() {

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        when(projectRepository.save(any(Project.class)))
                .thenReturn(project);

        request.setName("Updated WorkflowX");
        request.setStatus("COMPLETED");

        ProjectResponseDTO result =
                projectService.updateProject(1L, request);

        assertNotNull(result);

        verify(projectRepository, times(1))
                .findById(1L);

        verify(employeeRepository, times(1))
                .findById(1L);

        verify(projectRepository, times(1))
                .save(project);
    }

    @Test
    void updateProject_shouldThrowExceptionWhenProjectNotFound() {

        when(projectRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> projectService.updateProject(999L, request)
                );

        assertEquals(
                "Project with ID 999 not found",
                exception.getMessage()
        );

        verify(employeeRepository, never())
                .findById(anyLong());
    }

    @Test
    void updateProject_shouldThrowExceptionWhenManagerNotFound() {

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        when(employeeRepository.findById(999L))
                .thenReturn(Optional.empty());

        request.setManagerId(999L);

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> projectService.updateProject(1L, request)
                );

        assertEquals(
                "Employee with ID 999 not found",
                exception.getMessage()
        );

        verify(projectRepository, never())
                .save(any(Project.class));
    }

    @Test
    void deleteProject_shouldDeleteProject() {

        when(projectRepository.findById(1L))
                .thenReturn(Optional.of(project));

        projectService.deleteProject(1L);

        verify(projectRepository, times(1))
                .findById(1L);

        verify(projectRepository, times(1))
                .delete(project);
    }

    @Test
    void deleteProject_shouldThrowExceptionWhenNotFound() {

        when(projectRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> projectService.deleteProject(999L)
                );

        assertEquals(
                "Project with ID 999 not found",
                exception.getMessage()
        );

        verify(projectRepository, never())
                .delete(any(Project.class));
    }
}
