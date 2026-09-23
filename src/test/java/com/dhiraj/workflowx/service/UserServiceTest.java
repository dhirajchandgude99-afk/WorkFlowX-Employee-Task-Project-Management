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
import org.springframework.security.crypto.password.PasswordEncoder;

import com.dhiraj.workflowx.dto.UserRequestDTO;
import com.dhiraj.workflowx.dto.UserResponseDTO;
import com.dhiraj.workflowx.dto.UserUpdateRequestDTO;
import com.dhiraj.workflowx.entity.User;
import com.dhiraj.workflowx.exception.ResourceNotFoundException;
import com.dhiraj.workflowx.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User user;
    private UserRequestDTO createRequest;
    private UserUpdateRequestDTO updateRequest;

    @BeforeEach
    void setUp() {

        user = new User();
        user.setId(1L);
        user.setUsername("dhiraj");
        user.setPassword("encodedPassword");
        user.setRole("USER");

        createRequest = new UserRequestDTO();
        createRequest.setUsername("dhiraj");
        createRequest.setPassword("password123");
        createRequest.setRole("USER");

        updateRequest = new UserUpdateRequestDTO();
        updateRequest.setUsername("dhirajUpdated");
        updateRequest.setPassword("newPassword123");
        updateRequest.setRole("ADMIN");
    }

    @Test
    void getAllUsers_shouldReturnUsers() {

        when(userRepository.findAll())
                .thenReturn(List.of(user));

        List<UserResponseDTO> result =
                userService.getAllUsers();

        assertNotNull(result);
        assertEquals(1, result.size());

        verify(userRepository, times(1))
                .findAll();
    }

    @Test
    void getUserById_shouldReturnUser() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        UserResponseDTO result =
                userService.getUserById(1L);

        assertNotNull(result);
        assertEquals("dhiraj", result.getUsername());

        verify(userRepository, times(1))
                .findById(1L);
    }

    @Test
    void getUserById_shouldThrowExceptionWhenNotFound() {

        when(userRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> userService.getUserById(999L)
                );

        assertEquals(
                "User with ID 999 not found",
                exception.getMessage()
        );
    }

    @Test
    void createUser_shouldCreateUserWithEncodedPassword() {

        when(passwordEncoder.encode("password123"))
                .thenReturn("encodedPassword");

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        UserResponseDTO result =
                userService.createUser(createRequest);

        assertNotNull(result);
        assertEquals("dhiraj", result.getUsername());

        verify(passwordEncoder, times(1))
                .encode("password123");

        verify(userRepository, times(1))
                .save(any(User.class));
    }

    @Test
    void updateUser_shouldUpdateAndEncodeNewPassword() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.encode("newPassword123"))
                .thenReturn("newEncodedPassword");

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        UserResponseDTO result =
                userService.updateUser(1L, updateRequest);

        assertNotNull(result);

        assertEquals(
                "dhirajUpdated",
                user.getUsername()
        );

        assertEquals(
                "newEncodedPassword",
                user.getPassword()
        );

        assertEquals(
                "ADMIN",
                user.getRole()
        );

        verify(passwordEncoder, times(1))
                .encode("newPassword123");

        verify(userRepository, times(1))
                .save(user);
    }

    @Test
    void updateUser_shouldKeepExistingPasswordWhenPasswordIsBlank() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        updateRequest.setPassword("   ");

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        String originalPassword = user.getPassword();

        userService.updateUser(1L, updateRequest);

        assertEquals(
                originalPassword,
                user.getPassword()
        );

        verify(passwordEncoder, never())
                .encode(anyString());

        verify(userRepository, times(1))
                .save(user);
    }

    @Test
    void updateUser_shouldKeepExistingPasswordWhenPasswordIsNull() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        updateRequest.setPassword(null);

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        String originalPassword = user.getPassword();

        userService.updateUser(1L, updateRequest);

        assertEquals(
                originalPassword,
                user.getPassword()
        );

        verify(passwordEncoder, never())
                .encode(anyString());
    }

    @Test
    void updateUser_shouldThrowExceptionWhenNotFound() {

        when(userRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> userService.updateUser(
                                999L,
                                updateRequest
                        )
                );

        assertEquals(
                "User with ID 999 not found",
                exception.getMessage()
        );

        verify(userRepository, never())
                .save(any(User.class));
    }

    @Test
    void deleteUser_shouldDeleteUser() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        userService.deleteUser(1L);

        verify(userRepository, times(1))
                .findById(1L);

        verify(userRepository, times(1))
                .delete(user);
    }

    @Test
    void deleteUser_shouldThrowExceptionWhenNotFound() {

        when(userRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> userService.deleteUser(999L)
                );

        assertEquals(
                "User with ID 999 not found",
                exception.getMessage()
        );

        verify(userRepository, never())
                .delete(any(User.class));
    }
}
