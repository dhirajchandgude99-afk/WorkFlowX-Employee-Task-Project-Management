package com.dhiraj.workflowx.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dhiraj.workflowx.dto.LoginRequestDTO;
import com.dhiraj.workflowx.dto.LoginResponseDTO;
import com.dhiraj.workflowx.dto.SignupRequestDTO;
import com.dhiraj.workflowx.security.JwtService;
import com.dhiraj.workflowx.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Tag(
    name = "Authentication",
    description = "APIs for user authentication and registration"
)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AuthService authService;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            AuthService authService) {

        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.authService = authService;
    }

    @Operation(
        summary = "Authenticate user",
        description = "Authenticates a user using username and password and returns a JWT token."
    )
    @PostMapping("/login")
    public LoginResponseDTO login(
            @Valid @RequestBody LoginRequestDTO request) {

        Authentication authentication =
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                    )
                );

        String token = jwtService.generateToken(
            (org.springframework.security.core.userdetails.UserDetails)
                authentication.getPrincipal()
        );

        return new LoginResponseDTO(
            "Login successful",
            authentication.getName(),
            token
        );
    }

    @Operation(
        summary = "Create new account",
        description = "Creates a new USER account together with its employee profile."
    )
    @PostMapping("/signup")
    public ResponseEntity<String> signup(
            @Valid @RequestBody SignupRequestDTO request) {

        authService.signup(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body("Account created successfully");
    }
}