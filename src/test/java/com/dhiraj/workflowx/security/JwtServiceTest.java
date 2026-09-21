package com.dhiraj.workflowx.security;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    @Test
    void generateToken_shouldCreateValidToken() {

        UserDetails userDetails =
                User.withUsername("admin")
                        .password("password")
                        .roles("ADMIN")
                        .build();

        String token =
                jwtService.generateToken(userDetails);

        assertNotNull(token);
        assertFalse(token.isBlank());
    }
    @Test
     void extractUsername_shouldReturnCorrectUsername() {

      UserDetails userDetails =
            User.withUsername("admin")
                    .password("password")
                    .roles("ADMIN")
                    .build();

      String token =
            jwtService.generateToken(userDetails);

      String username =
            jwtService.extractUsername(token);

     assertEquals("admin", username);
    }
    @Test
      void isTokenValid_shouldReturnTrueForValidToken() {

    UserDetails userDetails =
            User.withUsername("admin")
                    .password("password")
                    .roles("ADMIN")
                    .build();

    String token =
            jwtService.generateToken(userDetails);

    boolean valid =
            jwtService.isTokenValid(token, userDetails);

    assertTrue(valid);
   }
   @Test
     void isTokenValid_shouldReturnFalseForDifferentUsername() {

     UserDetails admin =
            User.withUsername("admin")
                    .password("password")
                    .roles("ADMIN")
                    .build();

    UserDetails anotherUser =
            User.withUsername("testuser")
                    .password("password")
                    .roles("USER")
                    .build();

    String token =
            jwtService.generateToken(admin);

    boolean valid =
            jwtService.isTokenValid(token, anotherUser);

    assertFalse(valid);
    }
}