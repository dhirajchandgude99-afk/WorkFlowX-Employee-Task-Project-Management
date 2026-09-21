package com.dhiraj.workflowx.security;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.context.ActiveProfiles;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@SpringBootTest
@ActiveProfiles("test")
class JwtServiceTest {

    @Autowired
    private JwtService jwtService;

    @Value("${jwt.secret}")
    private String secret;

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
    @Test
     void isTokenValid_shouldReturnFalseForExpiredToken() {

    UserDetails userDetails =
            User.withUsername("admin")
                    .password("password")
                    .roles("ADMIN")
                    .build();

    SecretKey key = Keys.hmacShaKeyFor(
            secret.getBytes(StandardCharsets.UTF_8)
    );

    String expiredToken =
            Jwts.builder()
                    .subject("admin")
                    .claim("role", "ADMIN")
                    .issuedAt(
                            new Date(System.currentTimeMillis() - 7200000)
                    )
                    .expiration(
                            new Date(System.currentTimeMillis() - 3600000)
                    )
                    .signWith(key)
                    .compact();

    boolean valid =
            jwtService.isTokenValid(
                    expiredToken,
                    userDetails
            );

    assertFalse(valid);
    }
}