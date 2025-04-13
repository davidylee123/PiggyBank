package com.piggybank.backend.service;

import com.piggybank.backend.model.User;
import com.piggybank.backend.repository.UserRepository;
import com.piggybank.backend.service.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetUserById() {
        String id = "123";
        User user = new User();
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserById(id);
        assertTrue(result.isPresent());
        verify(userRepository, times(1)).findById(id);
    }

    @Test
    public void testLoginUser() {
    String username = "testuser";
    String password = "pass123";
    User user = new User();
    when(userRepository.findByUsernameAndPassword(username, password)).thenReturn(List.of(user));

    List<User> result = userService.loginUser(username, password);
    assertEquals(1, result.size());
    verify(userRepository).findByUsernameAndPassword(username, password);
}

    @Test
    public void testDeleteUser() {
        String id = "123";
        doNothing().when(userRepository).deleteById(id);
        userService.deleteUser(id);
        verify(userRepository).deleteById(id);
    }

    @Test
    public void testGetAllUsers() {
        when(userRepository.findAll()).thenReturn(List.of(new User()));

        List<User> result = userService.getAllUsers();
        assertEquals(1, result.size());
        verify(userRepository).findAll();
    }

    @Test
    public void testCreateUser() {
        User user = new User();
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.createUser(user);
        assertEquals(user, result);
        verify(userRepository).save(user);
    }
}
