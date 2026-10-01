package com.dhiraj.workflowx.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.Test;
import com.dhiraj.workflowx.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.doNothing;
import com.dhiraj.workflowx.security.JwtService;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthenticationManager authenticationManager;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserDetailsService userDetailsService;

    @MockitoBean
    private AuthService authService;

    @Test
    void login_shouldReturn200AndJwtToken() throws Exception {

        UserDetails userDetails =
                User.withUsername("admin")
                        .password("password")
                        .roles("ADMIN")
                        .build();

        Authentication authentication =
                new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

        when(authenticationManager.authenticate(any(
                UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        when(jwtService.generateToken(userDetails))
                .thenReturn("test-jwt-token");


        mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "username": "admin",
                                    "password": "password"
                                }
                                """)
        )
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.message")
                .value("Login successful"))
        .andExpect(jsonPath("$.username")
                .value("admin"))
        .andExpect(jsonPath("$.token")
                .value("test-jwt-token"));
    }


    @Test
    void login_shouldReturn400WhenValidationFails() throws Exception {

        mockMvc.perform(
                post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                    "username": "",
                                    "password": ""
                                }
                                """)
        )
        .andExpect(status().isBadRequest());
    }
    @Test
void signup_shouldReturn201WhenRequestIsValid() throws Exception {

    doNothing().when(authService).signup(any());

    mockMvc.perform(
            post("/api/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                            {
                                "name": "Dhiraj Chandgude",
                                "email": "dhiraj@example.com",
                                "phone": "9876543210",
                                "department": "IT",
                                "designation": "Software Developer",
                                "username": "dhiraj",
                                "password": "password123"
                            }
                            """)
    )
    .andExpect(status().isCreated())
    .andExpect(content()
            .string("Account created successfully"));
}
@Test
void signup_shouldReturn400WhenValidationFails() throws Exception {

    mockMvc.perform(
            post("/api/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                            {
                                "name": "",
                                "email": "invalid-email",
                                "phone": "",
                                "department": "",
                                "designation": "",
                                "username": "",
                                "password": ""
                            }
                            """)
    )
    .andExpect(status().isBadRequest());
}
}