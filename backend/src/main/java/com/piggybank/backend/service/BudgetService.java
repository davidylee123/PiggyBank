package com.piggybank.backend.service;

import com.piggybank.backend.model.Budget;
import com.piggybank.backend.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {
    private final BudgetRepository budgetRepository;

    @Autowired
    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }

    public Optional<Budget> getBudgetById(String id) {
        return budgetRepository.findById(id);
    }

    public Budget createBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    public Budget updateBudget(String id, Budget budget) {
        Optional<Budget> existingBudget = budgetRepository.findById(id);
        if(existingBudget.isPresent()) {
            Budget b = existingBudget.get();
            b.setUserId(budget.getUserId());
            b.setMonthlyLimit(budget.getMonthlyLimit());
            b.setSpentAmount(budget.getSpentAmount());
            return budgetRepository.save(b);
        }
        return null;
    }

    public void deleteBudget(String id) {
        budgetRepository.deleteById(id);
    }
}
