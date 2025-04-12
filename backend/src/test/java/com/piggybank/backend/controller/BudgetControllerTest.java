package com.piggybank.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.piggybank.backend.config.TestSecurityConfig;
import com.piggybank.backend.controller.BudgetController;
import com.piggybank.backend.model.Budget;
import com.piggybank.backend.service.BudgetService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BudgetController.class)
@Import(TestSecurityConfig.class)
public class BudgetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BudgetService budgetService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetAllBudgets() throws Exception {
        when(budgetService.getAllBudgets()).thenReturn(Arrays.asList(new Budget()));
        mockMvc.perform(get("/api/budget"))
               .andExpect(status().isOk());
    }

    @Test
    public void testGetBudgetById() throws Exception {
        String id = "1";
        when(budgetService.getBudgetById(id)).thenReturn(Optional.of(new Budget()));
        mockMvc.perform(get("/api/budget/{id}", id))
               .andExpect(status().isOk());
    }

    @Test
    public void testCreateBudget() throws Exception {
        Budget budget = new Budget();
        //budget.setName("Test Budget");

        when(budgetService.createBudget(budget)).thenReturn(budget);

        mockMvc.perform(post("/api/budget")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(budget)))
               .andExpect(status().isOk());
    }

    @Test
    public void testUpdateBudget() throws Exception {
        String id = "1";
        Budget updatedBudget = new Budget();
        updatedBudget.setId(id);
        //updatedBudget.setName("Updated Budget");

        when(budgetService.updateBudget(id, updatedBudget)).thenReturn(updatedBudget);

        mockMvc.perform(put("/api/budget/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedBudget)))
               .andExpect(status().isOk());
    }

    @Test
    public void testDeleteBudget() throws Exception {
        String id = "1";
        doNothing().when(budgetService).deleteBudget(id);

        mockMvc.perform(delete("/api/budget/{id}", id))
               .andExpect(status().isNoContent());
    }
    
    @Test
    public void testGetBudgetById_NotFound() throws Exception {
        String id = "404";
        when(budgetService.getBudgetById(id)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/budget/{id}", id))
            .andExpect(status().isNotFound());
    }

    @Test
    public void testUpdateBudget_NotFound() throws Exception {
        String id = "404";
        Budget budget = new Budget();
        budget.setId(id);

        when(budgetService.updateBudget(id, budget)).thenReturn(null);

        mockMvc.perform(put("/api/budget/{id}", id)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(budget)))
            .andExpect(status().isNotFound());
    }
}
