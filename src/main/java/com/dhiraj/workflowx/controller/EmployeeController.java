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

import com.dhiraj.workflowx.dto.EmployeeRequestDTO;
import com.dhiraj.workflowx.dto.EmployeeResponseDTO;
import com.dhiraj.workflowx.service.EmployeeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employees")
@Tag(
    name = "Employee APIs",
    description = "APIs for managing WorkflowX employees"
)
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @Operation(
    summary = "Get all employees",
    description = "Retrieves all employees registered in WorkflowX."
    )
    @GetMapping
    public List<EmployeeResponseDTO> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @Operation(
    summary = "Get employee by ID",
    description = "Retrieves a specific employee using their unique employee ID."
    )
    @GetMapping("/{id}")
    public EmployeeResponseDTO getEmployeeById(
            @PathVariable Long id) {

        return employeeService.getEmployeeById(id);
    }

    @Operation(
    summary = "Create employee",
    description = "Creates a new employee and associates the employee with a WorkflowX user."
    )
    @PostMapping
    public EmployeeResponseDTO createEmployee(
            @Valid @RequestBody EmployeeRequestDTO request) {

        return employeeService.createEmployee(request);
    }

    @Operation(
    summary = "Update employee",
    description = "Updates the details of an existing employee."
    )
    @PutMapping("/{id}")
    public EmployeeResponseDTO updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeRequestDTO request) {

        return employeeService.updateEmployee(id, request);
    }

    @Operation(
    summary = "Delete employee",
    description = "Deletes an existing employee from WorkflowX."
    )
    @DeleteMapping("/{id}")
    public String deleteEmployee(
            @PathVariable Long id) {

        employeeService.deleteEmployee(id);

        return "Employee deleted successfully";
    }
}