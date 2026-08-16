package com.dhiraj.workflowx.service;

import org.springframework.stereotype.Service;

import com.dhiraj.workflowx.repository.EmployeeRepository;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
}
