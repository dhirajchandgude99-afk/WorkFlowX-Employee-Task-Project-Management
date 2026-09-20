package com.dhiraj.workflowx.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import com.dhiraj.workflowx.entity.Employee;
import com.dhiraj.workflowx.entity.User;

@DataJpaTest
@ActiveProfiles("test")
class EmployeeRepositoryTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    private User user;
    private Employee employee;

    @BeforeEach
    void setUp() {

        user = new User();
        user.setUsername("repositoryuser");
        user.setPassword("password");
        user.setRole("USER");

        user = userRepository.save(user);

        employee = new Employee();
        employee.setName("Dhiraj");
        employee.setEmail("repository@test.com");
        employee.setPhone("9876543210");
        employee.setDepartment("IT");
        employee.setDesignation("Developer");
        employee.setUser(user);
    }

    @Test
    void saveEmployee_shouldSaveEmployee() {

        Employee savedEmployee =
                employeeRepository.save(employee);

        assertNotNull(savedEmployee.getId());
        assertEquals("Dhiraj", savedEmployee.getName());
        assertEquals(
                "repository@test.com",
                savedEmployee.getEmail()
        );
    }

    @Test
    void findById_shouldReturnEmployee() {

        Employee savedEmployee =
                employeeRepository.save(employee);

        Optional<Employee> result =
                employeeRepository.findById(
                        savedEmployee.getId()
                );

        assertTrue(result.isPresent());
        assertEquals(
                "Dhiraj",
                result.get().getName()
        );
    }

    @Test
    void findById_shouldReturnEmptyWhenEmployeeDoesNotExist() {

        Optional<Employee> result =
                employeeRepository.findById(99999L);

        assertTrue(result.isEmpty());
    }

    @Test
    void findAll_shouldReturnEmployees() {

        employeeRepository.save(employee);

        List<Employee> employees =
                employeeRepository.findAll();

        assertEquals(1, employees.size());
        assertEquals(
                "Dhiraj",
                employees.get(0).getName()
        );
    }

    @Test
    void delete_shouldRemoveEmployee() {

        Employee savedEmployee =
                employeeRepository.save(employee);

        Long employeeId =
                savedEmployee.getId();

        employeeRepository.delete(savedEmployee);

        Optional<Employee> result =
                employeeRepository.findById(employeeId);

        assertTrue(result.isEmpty());
    }
}
