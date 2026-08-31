package com.dhiraj.workflowx.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.dhiraj.workflowx.dto.UserRequestDTO;
import com.dhiraj.workflowx.dto.UserResponseDTO;
import com.dhiraj.workflowx.entity.User;
import com.dhiraj.workflowx.exception.ResourceNotFoundException;
import com.dhiraj.workflowx.mapper.UserMapper;
import com.dhiraj.workflowx.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UserResponseDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(UserMapper::toDTO)
                .toList();
    }

    public UserResponseDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User with ID " + id + " not found"
                        )
                );

        return UserMapper.toDTO(user);
    }

    public UserResponseDTO createUser(UserRequestDTO request) {

        User user = UserMapper.toEntity(request);

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        User savedUser = userRepository.save(user);

        return UserMapper.toDTO(savedUser);
    }

    public UserResponseDTO updateUser(
            Long id,
            UserRequestDTO request) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User with ID " + id + " not found"
                        )
                );

        user.setUsername(request.getUsername());

        // Encode password before storing it
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole(request.getRole());

        User updatedUser = userRepository.save(user);

        return UserMapper.toDTO(updatedUser);
    }

    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User with ID " + id + " not found"
                        )
                );

        userRepository.delete(user);
    }
}