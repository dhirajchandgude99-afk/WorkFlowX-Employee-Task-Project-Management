package com.dhiraj.workflowx.mapper;

import com.dhiraj.workflowx.dto.EmployeeRequestDTO;
import com.dhiraj.workflowx.dto.EmployeeResponseDTO;
import com.dhiraj.workflowx.entity.Employee;
import com.dhiraj.workflowx.entity.User;

public class EmployeeMapper {

    public static EmployeeResponseDTO toDTO(Employee employee) {

        return new EmployeeResponseDTO(
                employee.getId(),
                employee.getName(),
                employee.getEmail(),
                employee.getPhone(),
                employee.getDepartment(),
                employee.getDesignation(),
                employee.getUser().getId()
        );
    }

    public static Employee toEntity(
            EmployeeRequestDTO request,
            User user) {

        Employee employee = new Employee();

        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setPhone(request.getPhone());
        employee.setDepartment(request.getDepartment());
        employee.setDesignation(request.getDesignation());
        employee.setUser(user);

        return employee;
    }
}