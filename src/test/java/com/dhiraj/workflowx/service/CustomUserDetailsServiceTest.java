package com.dhiraj.workflowx.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.dhiraj.workflowx.entity.User;
import com.dhiraj.workflowx.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    private User user;

    @BeforeEach
    void setUp() {

        user = new User();
        user.setId(1L);
        user.setUsername("dhiraj");
        user.setPassword("encodedPassword");
        user.setRole("USER");
    }

    @Test
    void loadUserByUsername_shouldReturnUserDetails() {

        when(userRepository.findByUsername("dhiraj"))
                .thenReturn(Optional.of(user));

        UserDetails result =
                customUserDetailsService
                        .loadUserByUsername("dhiraj");

        assertNotNull(result);
        assertEquals("dhiraj", result.getUsername());
        assertEquals(
                "encodedPassword",
                result.getPassword()
        );

        assertTrue(
                result.getAuthorities()
                        .stream()
                        .anyMatch(
                                authority ->
                                        authority.getAuthority()
                                                .equals("ROLE_USER")
                        )
        );

        verify(userRepository, times(1))
                .findByUsername("dhiraj");
    }

    @Test
    void loadUserByUsername_shouldThrowExceptionWhenNotFound() {

        when(userRepository.findByUsername("unknown"))
                .thenReturn(Optional.empty());

        UsernameNotFoundException exception =
                assertThrows(
                        UsernameNotFoundException.class,
                        () ->
                                customUserDetailsService
                                        .loadUserByUsername("unknown")
                );

        assertEquals(
                "User with username unknown not found",
                exception.getMessage()
        );

        verify(userRepository, times(1))
                .findByUsername("unknown");
    }
}
