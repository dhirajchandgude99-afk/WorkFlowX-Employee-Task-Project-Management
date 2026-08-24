package com.dhiraj.workflowx.mapper;

import com.dhiraj.workflowx.dto.EmployeeResponseDTO;
import com.dhiraj.workflowx.entity.Employee;

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
}
