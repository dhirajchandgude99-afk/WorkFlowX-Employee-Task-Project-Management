package com.dhiraj.workflowx.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dhiraj.workflowx.dto.UserResponseDTO;
import com.dhiraj.workflowx.entity.User;
import com.dhiraj.workflowx.exception.ResourceNotFoundException;
import com.dhiraj.workflowx.mapper.UserMapper;
import com.dhiraj.workflowx.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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

    public User saveUser(User user) {
        return userRepository.save(user);
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