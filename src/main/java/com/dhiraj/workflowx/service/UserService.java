package com.dhiraj.workflowx.service;

import org.springframework.stereotype.Service;

import com.dhiraj.workflowx.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
