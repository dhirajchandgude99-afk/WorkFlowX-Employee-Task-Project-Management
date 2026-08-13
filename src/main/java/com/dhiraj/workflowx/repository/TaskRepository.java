package com.dhiraj.workflowx.repository;

import com.dhiraj.workflowx.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {

}