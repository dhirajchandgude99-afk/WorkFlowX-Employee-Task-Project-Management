package com.dhiraj.workflowx.mapper;

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
}