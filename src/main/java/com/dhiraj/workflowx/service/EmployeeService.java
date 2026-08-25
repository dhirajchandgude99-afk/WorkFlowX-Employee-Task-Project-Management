package com.dhiraj.workflowx.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.dhiraj.workflowx.dto.EmployeeRequestDTO;
import com.dhiraj.workflowx.dto.EmployeeResponseDTO;
import com.dhiraj.workflowx.entity.Employee;
import com.dhiraj.workflowx.entity.User;
import com.dhiraj.workflowx.exception.ResourceNotFoundException;
import com.dhiraj.workflowx.mapper.EmployeeMapper;
import com.dhiraj.workflowx.repository.EmployeeRepository;
import com.dhiraj.workflowx.repository.UserRepository;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public EmployeeService(
            EmployeeRepository employeeRepository,
            UserRepository userRepository) {

        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
    }

    public List<EmployeeResponseDTO> getAllEmployees() {

        return employeeRepository.findAll()
                .stream()
                .map(EmployeeMapper::toDTO)
                .toList();
    }

    public EmployeeResponseDTO getEmployeeById(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee with ID " + id + " not found"
                        )
                );

        return EmployeeMapper.toDTO(employee);
    }

    public EmployeeResponseDTO createEmployee(
            EmployeeRequestDTO request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User with ID " +
                                request.getUserId() +
                                " not found"
                        )
                );

        Employee employee = EmployeeMapper.toEntity(request, user);

        Employee savedEmployee = employeeRepository.save(employee);

        return EmployeeMapper.toDTO(savedEmployee);
    }

    public EmployeeResponseDTO updateEmployee(
            Long id,
            EmployeeRequestDTO request) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee with ID " + id + " not found"
                        )
                );

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User with ID " +
                                request.getUserId() +
                                " not found"
                        )
                );

        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        employee.setUser(user);

        Employee updatedEmployee = employeeRepository.save(employee);

        return EmployeeMapper.toDTO(updatedEmployee);
    }

    public void deleteEmployee(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee with ID " + id + " not found"
                        )
                );

        employeeRepository.delete(employee);
    }
}