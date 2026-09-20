package com.dhiraj.workflowx.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.dhiraj.workflowx.dto.EmployeeRequestDTO;
import com.dhiraj.workflowx.dto.EmployeeResponseDTO;
import com.dhiraj.workflowx.entity.Employee;
import com.dhiraj.workflowx.entity.User;
import com.dhiraj.workflowx.exception.ResourceNotFoundException;
import com.dhiraj.workflowx.repository.EmployeeRepository;
import com.dhiraj.workflowx.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee employee;
    private User user;
    private EmployeeRequestDTO request;

    @BeforeEach
    void setUp() {

        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setRole("USER");

        employee = new Employee();
        employee.setId(1L);
        employee.setName("Dhiraj");
        employee.setEmail("dhiraj@test.com");
        employee.setPhone("9876543210");
        employee.setDepartment("IT");
        employee.setDesignation("Developer");
        employee.setUser(user);

        request = new EmployeeRequestDTO();
        request.setName("Dhiraj");
        request.setEmail("dhiraj@test.com");
        request.setPhone("9876543210");
        request.setDepartment("IT");
        request.setDesignation("Developer");
        request.setUserId(1L);
    }

    @Test
    void getAllEmployees_shouldReturnEmployees() {

        when(employeeRepository.findAll())
                .thenReturn(List.of(employee));

        List<EmployeeResponseDTO> result =
                employeeService.getAllEmployees();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Dhiraj", result.get(0).getName());

        verify(employeeRepository, times(1)).findAll();
    }

    @Test
    void getEmployeeById_shouldReturnEmployee() {

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        EmployeeResponseDTO result =
                employeeService.getEmployeeById(1L);

        assertNotNull(result);
        assertEquals("Dhiraj", result.getName());
        assertEquals("dhiraj@test.com", result.getEmail());

        verify(employeeRepository, times(1))
                .findById(1L);
    }

    @Test
    void getEmployeeById_shouldThrowExceptionWhenNotFound() {

        when(employeeRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> employeeService.getEmployeeById(999L)
                );

        assertEquals(
                "Employee with ID 999 not found",
                exception.getMessage()
        );

        verify(employeeRepository, times(1))
                .findById(999L);
    }

    @Test
    void createEmployee_shouldCreateEmployee() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(employeeRepository.save(any(Employee.class)))
                .thenReturn(employee);

        EmployeeResponseDTO result =
                employeeService.createEmployee(request);

        assertNotNull(result);
        assertEquals("Dhiraj", result.getName());

        verify(userRepository, times(1))
                .findById(1L);

        verify(employeeRepository, times(1))
                .save(any(Employee.class));
    }

    @Test
    void createEmployee_shouldThrowExceptionWhenUserNotFound() {

        when(userRepository.findById(999L))
                .thenReturn(Optional.empty());

        request.setUserId(999L);

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> employeeService.createEmployee(request)
                );

        assertEquals(
                "User with ID 999 not found",
                exception.getMessage()
        );

        verify(userRepository, times(1))
                .findById(999L);

        verify(employeeRepository, never())
                .save(any(Employee.class));
    }

    @Test
    void updateEmployee_shouldUpdateEmployee() {

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(employeeRepository.save(any(Employee.class)))
                .thenReturn(employee);

        request.setName("Dhiraj Updated");
        request.setDesignation("Senior Developer");

        EmployeeResponseDTO result =
                employeeService.updateEmployee(1L, request);

        assertNotNull(result);

        verify(employeeRepository, times(1))
                .findById(1L);

        verify(userRepository, times(1))
                .findById(1L);

        verify(employeeRepository, times(1))
                .save(employee);
    }

    @Test
    void updateEmployee_shouldThrowExceptionWhenEmployeeNotFound() {

        when(employeeRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> employeeService.updateEmployee(999L, request)
                );

        assertEquals(
                "Employee with ID 999 not found",
                exception.getMessage()
        );

        verify(employeeRepository, times(1))
                .findById(999L);

        verify(userRepository, never())
                .findById(anyLong());

        verify(employeeRepository, never())
                .save(any(Employee.class));
    }

    @Test
    void deleteEmployee_shouldDeleteEmployee() {

        when(employeeRepository.findById(1L))
                .thenReturn(Optional.of(employee));

        employeeService.deleteEmployee(1L);

        verify(employeeRepository, times(1))
                .findById(1L);

        verify(employeeRepository, times(1))
                .delete(employee);
    }

    @Test
    void deleteEmployee_shouldThrowExceptionWhenEmployeeNotFound() {

        when(employeeRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> employeeService.deleteEmployee(999L)
                );

        assertEquals(
                "Employee with ID 999 not found",
                exception.getMessage()
        );

        verify(employeeRepository, times(1))
                .findById(999L);

        verify(employeeRepository, never())
                .delete(any(Employee.class));
    }
}