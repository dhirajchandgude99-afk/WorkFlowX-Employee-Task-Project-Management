package com.dhiraj.workflowx.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dhiraj.workflowx.dto.UserRequestDTO;
import com.dhiraj.workflowx.dto.UserResponseDTO;
import com.dhiraj.workflowx.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@Tag(
    name = "User APIs",
    description = "APIs for managing WorkflowX users"
)
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @Operation(
        summary = "Get all users",
        description = "Returns a list of all users"
    )
    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @Operation(
        summary = "Get user by ID",
        description = "Returns a user using the specified user ID"
    )
    @GetMapping("/{id}")
    public UserResponseDTO getUserById(
            @PathVariable Long id) {

        return userService.getUserById(id);
    }

    @Operation(
        summary = "Create a new user",
        description = "Creates a new WorkflowX user"
    )
    @PostMapping
    public UserResponseDTO createUser(
            @Valid @RequestBody UserRequestDTO request) {

        return userService.createUser(request);
    }

    @Operation(
        summary = "Update a user",
        description = "Updates an existing user using the specified user ID"
    )
    @PutMapping("/{id}")
    public UserResponseDTO updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequestDTO request) {

        return userService.updateUser(id, request);
    }

    @Operation(
        summary = "Delete a user",
        description = "Deletes an existing user using the specified user ID"
    )
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return "User with ID " + id + " has been deleted.";
    }
}