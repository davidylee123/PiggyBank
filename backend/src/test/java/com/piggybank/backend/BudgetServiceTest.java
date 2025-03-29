package com.piggybank.backend;

import com.piggybank.backend.model.Budget;
import com.piggybank.backend.repository.BudgetRepository;
import com.piggybank.backend.service.BudgetService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @InjectMocks
    private BudgetService budgetService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetBudgetById() {
        String id = "bud123";
        Budget budget = new Budget();
        when(budgetRepository.findById(id)).thenReturn(Optional.of(budget));

        Optional<Budget> result = budgetService.getBudgetById(id);
        assertTrue(result.isPresent());
    }

    @Test
    public void testUpdateBudget() {
        String id = "bud123";
        Budget budget = new Budget();
        when(budgetRepository.findById(id)).thenReturn(Optional.of(budget));
        when(budgetRepository.save(any())).thenReturn(budget);

        Budget updated = budgetService.updateBudget(id, budget);
        assertNotNull(updated);
    }

    @Test
    public void testDeleteBudget() {
        String id = "bud123";
        doNothing().when(budgetRepository).deleteById(id);
        budgetService.deleteBudget(id);
        verify(budgetRepository).deleteById(id);
    }
}
