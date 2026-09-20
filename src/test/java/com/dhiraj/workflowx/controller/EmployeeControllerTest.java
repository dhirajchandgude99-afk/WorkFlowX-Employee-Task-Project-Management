package com.dhiraj.workflowx.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

import java.util.List;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.dhiraj.workflowx.security.JwtService;
import com.dhiraj.workflowx.dto.EmployeeRequestDTO;
import com.dhiraj.workflowx.dto.EmployeeResponseDTO;
import com.dhiraj.workflowx.exception.ResourceNotFoundException;
import com.dhiraj.workflowx.service.EmployeeService;
import org.springframework.security.core.userdetails.UserDetailsService;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private EmployeeService employeeService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;
    
    @Test
    void getAllEmployees_shouldReturn200() throws Exception {

        EmployeeResponseDTO employee =
                new EmployeeResponseDTO();

        employee.setName("Dhiraj");
        employee.setEmail("dhiraj@test.com");

        when(employeeService.getAllEmployees())
                .thenReturn(List.of(employee));

        mockMvc.perform(
                get("/api/employees")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].name")
                .value("Dhiraj"))
        .andExpect(jsonPath("$[0].email")
                .value("dhiraj@test.com"));

        verify(employeeService, times(1))
                .getAllEmployees();
    }


    @Test
    void getEmployeeById_shouldReturn200() throws Exception {

        EmployeeResponseDTO employee =
                new EmployeeResponseDTO();

        employee.setName("Dhiraj");
        employee.setEmail("dhiraj@test.com");

        when(employeeService.getEmployeeById(1L))
                .thenReturn(employee);

        mockMvc.perform(
                get("/api/employees/1")
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name")
                .value("Dhiraj"))
        .andExpect(jsonPath("$.email")
                .value("dhiraj@test.com"));

        verify(employeeService, times(1))
                .getEmployeeById(1L);
    }


    @Test
    void getEmployeeById_shouldReturn404WhenNotFound()
            throws Exception {

        when(employeeService.getEmployeeById(999L))
                .thenThrow(
                        new ResourceNotFoundException(
                                "Employee with ID 999 not found"
                        )
                );

        mockMvc.perform(
                get("/api/employees/999")
        )
        .andExpect(status().isNotFound());

        verify(employeeService, times(1))
                .getEmployeeById(999L);
    }


    @Test
    void createEmployee_shouldReturn200() throws Exception {

        EmployeeResponseDTO employee =
                new EmployeeResponseDTO();

        employee.setName("Dhiraj");
        employee.setEmail("dhiraj@test.com");

        when(employeeService.createEmployee(
                any(EmployeeRequestDTO.class)
        )).thenReturn(employee);

        String requestJson = """
                {
                    "name": "Dhiraj",
                    "email": "dhiraj@test.com",
                    "phone": "9876543210",
                    "department": "IT",
                    "designation": "Developer",
                    "userId": 1
                }
                """;

        mockMvc.perform(
                post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name")
                .value("Dhiraj"))
        .andExpect(jsonPath("$.email")
                .value("dhiraj@test.com"));

        verify(employeeService, times(1))
                .createEmployee(
                        any(EmployeeRequestDTO.class)
                );
    }


    @Test
    void createEmployee_shouldReturn400WhenValidationFails()
            throws Exception {

        String requestJson = """
                {
                    "name": "",
                    "email": "",
                    "phone": "9876543210",
                    "department": "",
                    "designation": "",
                    "userId": null
                }
                """;

        mockMvc.perform(
                post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson)
        )
        .andExpect(status().isBadRequest());

        verify(employeeService, never())
                .createEmployee(any(EmployeeRequestDTO.class));
    }


    @Test
    void updateEmployee_shouldReturn200() throws Exception {

        EmployeeResponseDTO employee =
                new EmployeeResponseDTO();

        employee.setName("Dhiraj Updated");
        employee.setEmail("updated@test.com");

        when(employeeService.updateEmployee(
                eq(1L),
                any(EmployeeRequestDTO.class)
        )).thenReturn(employee);

        String requestJson = """
                {
                    "name": "Dhiraj Updated",
                    "email": "updated@test.com",
                    "phone": "9876543210",
                    "department": "IT",
                    "designation": "Senior Developer",
                    "userId": 1
                }
                """;

        mockMvc.perform(
                put("/api/employees/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name")
                .value("Dhiraj Updated"));

        verify(employeeService, times(1))
                .updateEmployee(
                        eq(1L),
                        any(EmployeeRequestDTO.class)
                );
    }


    @Test
    void deleteEmployee_shouldReturn200() throws Exception {

        doNothing()
                .when(employeeService)
                .deleteEmployee(1L);

        mockMvc.perform(
                delete("/api/employees/1")
        )
        .andExpect(status().isOk());

        verify(employeeService, times(1))
                .deleteEmployee(1L);
    }
}