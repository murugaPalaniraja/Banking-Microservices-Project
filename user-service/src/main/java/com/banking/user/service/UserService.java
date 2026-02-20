package com.banking.user.service;

import com.banking.user.dto.LoginRequest;
import com.banking.user.dto.LoginResponse;
import com.banking.user.dto.RegisterRequest;
import com.banking.user.entity.User;
import com.banking.user.repository.UserRepository;
import com.banking.user.util.JwtUtil;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.math.BigDecimal;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;

    public UserService(UserRepository userRepository, JwtUtil jwtUtil, RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.restTemplate = restTemplate;
    }

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User(
                request.getEmail(),
                request.getPassword(), // In production, hash with BCrypt
                request.getFullName(),
                request.getPhone()
        );
        User savedUser = userRepository.save(user);

        // Automatically create a savings account for the new user
        try {
            restTemplate.postForObject(
                    "http://account-service/api/accounts",
                    Map.of(
                            "userId", savedUser.getId(),
                            "accountType", "SAVINGS",
                            "initialBalance", new BigDecimal("1000.00")
                    ),
                    Object.class
            );
        } catch (Exception e) {
            // Log error but don't fail registration? 
            // Or maybe fail it? Usually, we want atomicity, but these are separate services.
            // For now, let's just log or ignore if account creation fails but user is saved.
            System.err.println("Failed to create account for user: " + savedUser.getId() + ". Error: " + e.getMessage());
        }

        return savedUser;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return new LoginResponse(token, user.getId(), user.getFullName(), user.getEmail());
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
