package com.dhiraj.workflowx.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "WorkflowX API",
                version = "1.0.0",
                description = """
                        REST API for WorkflowX — an Employee Task & Project Management System.

                        The API provides authentication and CRUD operations for users,
                        employees, projects and tasks.

                        Protected endpoints require a valid JWT Bearer token.
                        """,
                contact = @Contact(
                        name = "WorkflowX Development Team"
                ),
                license = @License(
                        name = "MIT License"
                )
        ),
        security = {
                @SecurityRequirement(name = "bearerAuth")
        }
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer"
)
public class OpenApiConfig {

}