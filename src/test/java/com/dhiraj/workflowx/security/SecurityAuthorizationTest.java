package com.dhiraj.workflowx.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import com.dhiraj.workflowx.config.SecurityConfig;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(SecurityConfig.class)
class SecurityAuthorizationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void protectedApi_shouldReturn401WithoutJwt() throws Exception {

        mockMvc.perform(
                get("/api/employees")
        )
        .andExpect(status().isUnauthorized());
    }

    @Test
void protectedApi_shouldReturn401WithInvalidJwt() throws Exception {

    mockMvc.perform(
            get("/api/employees")
                    .header(
                            "Authorization",
                            "Bearer invalid-token"
                    )
    )
    .andExpect(status().isUnauthorized());
}
}