package com.piggybank.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
    void testGetUserById_NotFound() throws Exception {
        Mockito.when(userService.getUserById("999")).thenReturn(Optional.empty());
        mockMvc.perform(get("/api/users/999"))
               .andExpect(status().isNotFound());
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
    void testLoginUser_Unauthorized() throws Exception {
        Mockito.when(userService.loginUser("badUser", "badPass")).thenReturn(List.of());

        mockMvc.perform(post("/api/users/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"badUser\",\"password\":\"badPass\"}"))
               .andExpect(status().isUnauthorized());
    }
    @Test
    void testLoginUser_EmptyList_Unauthorized() throws Exception {
        Mockito.when(userService.loginUser("badUser", "badPass")).thenReturn(List.of());

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"badUser\",\"password\":\"badPass\"}"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void testLoginUser_NullList_Unauthorized() throws Exception {
        Mockito.when(userService.loginUser("nullUser", "nullPass")).thenReturn(null);

        mockMvc.perform(post("/api/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"username\":\"nullUser\",\"password\":\"nullPass\"}"))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void testDeleteUser() throws Exception {
        Mockito.doNothing().when(userService).deleteUser("123");

        mockMvc.perform(delete("/api/users/123"))
               .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteUser_Exception() throws Exception {
        Mockito.doThrow(new RuntimeException("deletion failed")).when(userService).deleteUser("123");

        mockMvc.perform(delete("/api/users/123"))
               .andExpect(status().isInternalServerError());
    }

    @Test
    void testUpdateUser_Success() throws Exception {
        User existingUser = new User();
        existingUser.setId("123");
        existingUser.setUsername("oldUser");
        existingUser.setEmail("old@email.com");

        User updatedUser = new User();
        updatedUser.setUsername("newUser");
        updatedUser.setEmail("new@email.com");

        Mockito.when(userService.getUserById("123")).thenReturn(Optional.of(existingUser));
        Mockito.when(userService.createUser(Mockito.any(User.class))).thenReturn(updatedUser);

        mockMvc.perform(put("/api/users/123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedUser)))
               .andExpect(status().isOk());
    }

    @Test
    void testUpdateUser_NotFound() throws Exception {
        User updatedUser = new User();
        updatedUser.setUsername("newUser");
        updatedUser.setEmail("new@email.com");

        Mockito.when(userService.getUserById("999")).thenReturn(Optional.empty());

        mockMvc.perform(put("/api/users/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedUser)))
               .andExpect(status().isNotFound());
    }
}
