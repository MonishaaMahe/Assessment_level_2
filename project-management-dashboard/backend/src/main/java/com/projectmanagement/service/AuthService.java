package com.projectmanagement.service;

import com.projectmanagement.dto.AuthResponse;
import com.projectmanagement.dto.LoginRequest;
import com.projectmanagement.entity.User;
import com.projectmanagement.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    

    
    public AuthResponse login(LoginRequest loginRequest) {
        System.out.println("Login attempt - Username: '" + loginRequest.getUsername() + "', Password: '" + loginRequest.getPassword() + "'");
        
        // Check database first
        try {
            System.out.println("Searching for user: " + loginRequest.getUsername());
            User user = userRepository.findByUsername(loginRequest.getUsername()).orElse(null);
            if (user != null) {
                System.out.println("Found user in database: " + user.getUsername() + ", stored password: '" + user.getPassword() + "'");
                System.out.println("Input password length: " + loginRequest.getPassword().length() + ", DB password length: " + user.getPassword().length());
                System.out.println("Passwords equal? " + loginRequest.getPassword().equals(user.getPassword()));
                
                // Try trimmed comparison
                if (loginRequest.getPassword().trim().equals(user.getPassword().trim())) {
                    System.out.println("Database login successful with trim");
                    String token = "dummy-token-" + user.getUsername();
                    AuthResponse response = new AuthResponse(token, user.getUsername(), user.getFullName());
                    response.setRole(user.getRole());
                    return response;
                } else {
                    System.out.println("Password mismatch even after trim");
                }
            } else {
                System.out.println("User not found in database");
                // List all users for debugging
                userRepository.findAll().forEach(u -> System.out.println("Existing user: " + u.getUsername()));
            }
        } catch (Exception e) {
            System.out.println("Database error: " + e.getMessage());
            e.printStackTrace();
        }
        
        // Fallback to hardcoded users
        if ("admin".equals(loginRequest.getUsername()) && "password123".equals(loginRequest.getPassword())) {
            System.out.println("Admin login successful");
            String token = "dummy-token-admin";
            return new AuthResponse(token, "admin", "Admin User");
        }
        
        if ("john.doe".equals(loginRequest.getUsername()) && "password123".equals(loginRequest.getPassword())) {
            System.out.println("John login successful");
            String token = "dummy-token-john";
            return new AuthResponse(token, "john.doe", "John Doe");
        }
        
        System.out.println("Login failed - no match found");
        throw new RuntimeException("Invalid credentials");
    }
    
    public User register(User user) {
        System.out.println("Registration attempt: " + user.getUsername());
        
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        // Store password as plain text for now
        User savedUser = userRepository.save(user);
        System.out.println("User registered successfully: " + savedUser.getUsername());
        return savedUser;
    }
}