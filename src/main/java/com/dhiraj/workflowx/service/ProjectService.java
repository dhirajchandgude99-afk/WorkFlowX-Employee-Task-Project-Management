package com.dhiraj.workflowx.service;

import org.springframework.stereotype.Service;

import com.dhiraj.workflowx.repository.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }
}
