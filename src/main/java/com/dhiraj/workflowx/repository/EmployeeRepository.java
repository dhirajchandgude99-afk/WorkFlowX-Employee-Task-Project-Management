package com.dhiraj.workflowx.repository;

import com.dhiraj.workflowx.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

}