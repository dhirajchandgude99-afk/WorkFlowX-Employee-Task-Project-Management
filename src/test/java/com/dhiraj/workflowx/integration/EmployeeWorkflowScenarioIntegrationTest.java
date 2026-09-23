package com.dhiraj.workflowx.integration;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

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

import com.jayway.jsonpath.JsonPath;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class EmployeeWorkflowScenarioIntegrationTest {

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

        user.setUsername("scenarioUser");
        user.setPassword("password123");
        user.setRole("USER");

        User savedUser = userRepository.save(user);

        userId = savedUser.getId();

        assertNotNull(userId);
    }

    @Test
    void createEmployee_shouldCreateEmployeeWithValidUser()
            throws Exception {

        String request = """
                {
                    "name": "Scenario Employee",
                    "email": "scenario@example.com",
                    "phone": "9876543210",
                    "department": "IT",
                    "designation": "Developer",
                    "userId": %d
                }
                """.formatted(userId);

        mockMvc.perform(
                post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request)
        )
        .andExpect(status().isOk())
        .andExpect(
                jsonPath("$.name")
                        .value("Scenario Employee")
        )
        .andExpect(
                jsonPath("$.email")
                        .value("scenario@example.com")
        )
        .andExpect(
                jsonPath("$.department")
                        .value("IT")
        )
        .andExpect(
                jsonPath("$.designation")
                        .value("Developer")
        );
    }

    @Test
    void createEmployee_shouldReturn400_whenRequiredFieldsAreMissing()
            throws Exception {

        String request = """
                {
                    "name": "",
                    "email": "invalid-email",
                    "phone": "9876543210",
                    "department": "",
                    "designation": "",
                    "userId": null
                }
                """;

        mockMvc.perform(
                post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request)
        )
        .andExpect(status().isBadRequest())
        .andExpect(
                jsonPath("$.status")
                        .value(400)
        );
    }

    @Test
    void updateEmployee_shouldUpdateEmployeeSuccessfully()
            throws Exception {

        String createRequest = """
                {
                    "name": "Original Employee",
                    "email": "original@example.com",
                    "phone": "9876543210",
                    "department": "IT",
                    "designation": "Developer",
                    "userId": %d
                }
                """.formatted(userId);

        String response =
                mockMvc.perform(
                        post("/api/employees")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(createRequest)
                )
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long employeeId =
                JsonPath.parse(response)
                        .read("$.id", Long.class);

        String updateRequest = """
                {
                    "name": "Updated Scenario Employee",
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
                        .value("Updated Scenario Employee")
        )
        .andExpect(
                jsonPath("$.email")
                        .value("updated@example.com")
        )
        .andExpect(
                jsonPath("$.department")
                        .value("Engineering")
        )
        .andExpect(
                jsonPath("$.designation")
                        .value("Senior Developer")
        );
    }

    @Test
    void multipleEmployees_shouldExistIndependently()
        throws Exception {

      // Create second user because Employee -> User is OneToOne
      User secondUser = new User();

      secondUser.setUsername("scenarioUserTwo");
      secondUser.setPassword("password456");
      secondUser.setRole("USER");

        User savedSecondUser = userRepository.save(secondUser);

        Long secondUserId = savedSecondUser.getId();

        String employeeOne = """
            {
                "name": "Employee One",
                "email": "employee1@example.com",
                "phone": "9876543210",
                "department": "IT",
                "designation": "Developer",
                "userId": %d
            }
            """.formatted(userId);

      String employeeTwo = """
            {
                "name": "Employee Two",
                "email": "employee2@example.com",
                "phone": "9999999999",
                "department": "HR",
                "designation": "Manager",
                "userId": %d
            }
            """.formatted(secondUserId);

      mockMvc.perform(
            post("/api/employees")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(employeeOne)
      )
      .andExpect(status().isOk());

      mockMvc.perform(
            post("/api/employees")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(employeeTwo)
       )
       .andExpect(status().isOk());

      mockMvc.perform(
            get("/api/employees")
      )
      .andExpect(status().isOk())
      .andExpect(
            jsonPath("$.length()")
                    .value(2)
      );
   }

    @Test
    void deleteEmployee_shouldRemoveEmployeeFromDatabase()
            throws Exception {

        String request = """
                {
                    "name": "Employee To Delete",
                    "email": "delete@example.com",
                    "phone": "9876543210",
                    "department": "IT",
                    "designation": "Developer",
                    "userId": %d
                }
                """.formatted(userId);

        String response =
                mockMvc.perform(
                        post("/api/employees")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(request)
                )
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long employeeId =
                JsonPath.parse(response)
                        .read("$.id", Long.class);

        mockMvc.perform(
                delete("/api/employees/{id}", employeeId)
        )
        .andExpect(status().isOk());

        assertFalse(
                employeeRepository.existsById(employeeId)
        );
    }

    @Test
    void deletedEmployee_shouldReturn404()
            throws Exception {

        String request = """
                {
                    "name": "Temporary Employee",
                    "email": "temporary@example.com",
                    "phone": "9876543210",
                    "department": "IT",
                    "designation": "Developer",
                    "userId": %d
                }
                """.formatted(userId);

        String response =
                mockMvc.perform(
                        post("/api/employees")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(request)
                )
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long employeeId =
                JsonPath.parse(response)
                        .read("$.id", Long.class);

        mockMvc.perform(
                delete("/api/employees/{id}", employeeId)
        )
        .andExpect(status().isOk());

        mockMvc.perform(
                get("/api/employees/{id}", employeeId)
        )
        .andExpect(status().isNotFound())
        .andExpect(
                jsonPath("$.status")
                        .value(404)
        );
    }

    @Test
    void completeEmployeeLifecycle_shouldWorkSuccessfully()
            throws Exception {

        // CREATE
        String createRequest = """
                {
                    "name": "Lifecycle Employee",
                    "email": "lifecycle@example.com",
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
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long employeeId =
                JsonPath.parse(createResponse)
                        .read("$.id", Long.class);

        // READ
        mockMvc.perform(
                get("/api/employees/{id}", employeeId)
        )
        .andExpect(status().isOk())
        .andExpect(
                jsonPath("$.name")
                        .value("Lifecycle Employee")
        );

        // UPDATE
        String updateRequest = """
                {
                    "name": "Lifecycle Employee Updated",
                    "email": "lifecycle.updated@example.com",
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
                        .value("Lifecycle Employee Updated")
        );

        // VERIFY UPDATE
        mockMvc.perform(
                get("/api/employees/{id}", employeeId)
        )
        .andExpect(status().isOk())
        .andExpect(
                jsonPath("$.email")
                        .value("lifecycle.updated@example.com")
        );

        // DELETE
        mockMvc.perform(
                delete("/api/employees/{id}", employeeId)
        )
        .andExpect(status().isOk());

        // VERIFY DELETE
        mockMvc.perform(
                get("/api/employees/{id}", employeeId)
        )
        .andExpect(status().isNotFound());
    }
}