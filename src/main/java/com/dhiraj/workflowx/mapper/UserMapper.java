package com.dhiraj.workflowx.mapper;

import com.dhiraj.workflowx.dto.UserRequestDTO;
import com.dhiraj.workflowx.dto.UserResponseDTO;
import com.dhiraj.workflowx.entity.User;

public class UserMapper {

    public static UserResponseDTO toDTO(User user) {

        return new UserResponseDTO(
                user.getId(),
                user.getUsername(),
                user.getRole()
        );
    }

    public static User toEntity(UserRequestDTO request) {

        User user = new User();

        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        return user;
    }
}