package com.piggybank.backend.repository;

import com.piggybank.backend.model.Transaction;
import com.piggybank.backend.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
public class TransactionRepositoryTest {

    @Autowired
    private TransactionRepository repository;

    @Test
    public void testSaveAndFind() {
        Transaction txn = new Transaction();
        txn.setId("txn123");
        txn.setUserId("user123");
        txn.setAmount(50.0);
        txn.setCategory("Food");

        repository.save(txn);

        Optional<Transaction> found = repository.findById("txn123");
        assertThat(found).isPresent();
        assertThat(found.get().getAmount()).isEqualTo(50.0);
    }
}

