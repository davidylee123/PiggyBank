package com.piggybank.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.piggybank.backend.controller.UserController;
import com.piggybank.backend.model.User;
import com.piggybank.backend.service.UserService;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@Import(com.piggybank.backend.config.TestSecurityConfig.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllUsers() throws Exception {
        Mockito.when(userService.getAllUsers()).thenReturn(List.of());
        mockMvc.perform(get("/api/users"))
               .andExpect(status().isOk());
    }

    @Test
    void testGetUserById() throws Exception {
        User user = new User();
        user.setId("123");
        Mockito.when(userService.getUserById("123")).thenReturn(Optional.of(user));
        mockMvc.perform(get("/api/users/123"))
               .andExpect(status().isOk());
    }

    @Test
    void testCreateUser() throws Exception {
        User user = new User();
        user.setUsername("testUser");
        user.setPassword("testPass");

        Mockito.when(userService.createUser(Mockito.any(User.class))).thenReturn(user);


        mockMvc.perform(post("/api/users/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
               .andExpect(status().isOk());
    }

    @Test
    void testLoginUser() throws Exception {
        User user = new User();
        user.setUsername("testUser");
        user.setPassword("testPass");

        Mockito.when(userService.loginUser("testUser", "testPass")).thenReturn(List.of(user));

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"testUser\",\"password\":\"testPass\"}"))
               .andExpect(status().isOk());
    }

    @Test
    void testDeleteUser() throws Exception {
        Mockito.doNothing().when(userService).deleteUser("123");

        mockMvc.perform(delete("/api/users/123"))
               .andExpect(status().isNoContent());
    }
}
