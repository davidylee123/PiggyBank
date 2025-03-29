package com.piggybank.backend;

import com.piggybank.backend.model.Budget;
import com.piggybank.backend.repository.BudgetRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
public class BudgetRepositoryTest {

    @Autowired
    private BudgetRepository repository;

    @Test
    public void testSaveAndFind() {
        Budget budget = new Budget();
        budget.setUserId("testUser");
        budget.setMonthlyLimit(1000.0);
        budget.setSpentAmount(100.0);

        Budget saved = repository.save(budget);
        Optional<Budget> found = repository.findById(saved.getId());

        assertThat(found).isPresent();
        assertThat(found.get().getUserId()).isEqualTo("testUser");
    }
}

