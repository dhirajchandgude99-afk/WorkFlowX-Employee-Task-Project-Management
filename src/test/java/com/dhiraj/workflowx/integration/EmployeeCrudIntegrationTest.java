package com.dhiraj.workflowx.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;


import com.dhiraj.workflowx.entity.User;
import com.dhiraj.workflowx.repository.EmployeeRepository;
import com.dhiraj.workflowx.repository.UserRepository;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class EmployeeCrudIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private UserRepository userRepository;

    private Long userId;

    @BeforeEach
    void setUp() {

        employeeRepository.deleteAll();
        userRepository.deleteAll();

        User user = new User();

        user.setUsername("integrationuser");
        user.setPassword("password123");
        user.setRole("USER");

        User savedUser = userRepository.save(user);

        userId = savedUser.getId();
    }

    @Test
    void employeeCrudFlow_shouldWorkSuccessfully() throws Exception {

        // ------------------------------------------------
        // 1. CREATE EMPLOYEE
        // ------------------------------------------------

        String createRequest = """
                {
                    "name": "Integration Employee",
                    "email": "integration@example.com",
                    "phone": "9876543210",
                    "department": "IT",
                    "designation": "Developer",
                    "userId": %d
                }
                """.formatted(userId);

        String createResponse =
                mockMvc.perform(
                        post("/api/employees")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(createRequest)
                )
                .andExpect(status().isOk())
                .andExpect(
                        jsonPath("$.name")
                                .value("Integration Employee")
                )
                .andExpect(
                        jsonPath("$.email")
                                .value("integration@example.com")
                )
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long employeeId =
                com.jayway.jsonpath.JsonPath
                        .parse(createResponse)
                        .read("$.id", Long.class);

        // ------------------------------------------------
        // 2. GET EMPLOYEE BY ID
        // ------------------------------------------------

        mockMvc.perform(
                get("/api/employees/{id}", employeeId)
        )
        .andExpect(status().isOk())
        .andExpect(
                jsonPath("$.id")
                        .value(employeeId)
        )
        .andExpect(
                jsonPath("$.name")
                        .value("Integration Employee")
        );

        // ------------------------------------------------
        // 3. GET ALL EMPLOYEES
        // ------------------------------------------------

        mockMvc.perform(
                get("/api/employees")
        )
        .andExpect(status().isOk())
        .andExpect(
                jsonPath("$.length()")
                        .value(1)
        );

        // ------------------------------------------------
        // 4. UPDATE EMPLOYEE
        // ------------------------------------------------

        String updateRequest = """
                {
                    "name": "Updated Integration Employee",
                    "email": "updated@example.com",
                    "phone": "9999999999",
                    "department": "Engineering",
                    "designation": "Senior Developer",
                    "userId": %d
                }
                """.formatted(userId);

        mockMvc.perform(
                put("/api/employees/{id}", employeeId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateRequest)
        )
        .andExpect(status().isOk())
        .andExpect(
                jsonPath("$.name")
                        .value("Updated Integration Employee")
        )
        .andExpect(
                jsonPath("$.email")
                        .value("updated@example.com")
        )
        .andExpect(
                jsonPath("$.department")
                        .value("Engineering")
        );

        // ------------------------------------------------
        // 5. VERIFY UPDATED EMPLOYEE
        // ------------------------------------------------

        mockMvc.perform(
                get("/api/employees/{id}", employeeId)
        )
        .andExpect(status().isOk())
        .andExpect(
                jsonPath("$.name")
                        .value("Updated Integration Employee")
        )
        .andExpect(
                jsonPath("$.email")
                        .value("updated@example.com")
        );

        // ------------------------------------------------
        // 6. DELETE EMPLOYEE
        // ------------------------------------------------

        mockMvc.perform(
                delete("/api/employees/{id}", employeeId)
        )
        .andExpect(status().isOk());

        // ------------------------------------------------
        // 7. VERIFY DELETION
        // ------------------------------------------------

        mockMvc.perform(
                get("/api/employees/{id}", employeeId)
        )
        .andExpect(status().isNotFound());

        // ------------------------------------------------
        // 8. VERIFY DATABASE
        // ------------------------------------------------

        org.junit.jupiter.api.Assertions.assertFalse(
                employeeRepository.existsById(employeeId)
        );
    }

    @Test
    void getEmployeeById_shouldReturn404_whenEmployeeDoesNotExist()
            throws Exception {

        mockMvc.perform(
                get("/api/employees/{id}", 999999L)
        )
        .andExpect(status().isNotFound())
        .andExpect(
                jsonPath("$.status")
                        .value(404)
        );
    }

    @Test
    void updateEmployee_shouldReturn404_whenEmployeeDoesNotExist()
            throws Exception {

        String updateRequest = """
                {
                    "name": "Missing Employee",
                    "email": "missing@example.com",
                    "phone": "9876543210",
                    "department": "IT",
                    "designation": "Developer",
                    "userId": %d
                }
                """.formatted(userId);

        mockMvc.perform(
                put("/api/employees/{id}", 999999L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateRequest)
        )
        .andExpect(status().isNotFound())
        .andExpect(
                jsonPath("$.status")
                        .value(404)
        );
    }

    @Test
    void deleteEmployee_shouldReturn404_whenEmployeeDoesNotExist()
            throws Exception {

        mockMvc.perform(
                delete("/api/employees/{id}", 999999L)
        )
        .andExpect(status().isNotFound())
        .andExpect(
                jsonPath("$.status")
                        .value(404)
        );
    }
}