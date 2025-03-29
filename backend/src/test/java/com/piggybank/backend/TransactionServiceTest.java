package com.piggybank.backend;

import com.piggybank.backend.model.Transaction;
import com.piggybank.backend.repository.TransactionRepository;
import com.piggybank.backend.service.TransactionService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionService transactionService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetTransactionById() {
        String id = "tx123";
        Transaction tx = new Transaction();
        when(transactionRepository.findById(id)).thenReturn(Optional.of(tx));

        Optional<Transaction> result = transactionService.getTransactionById(id);
        assertTrue(result.isPresent());
    }

    @Test
    public void testUpdateTransaction() {
        String id = "tx123";
        Transaction tx = new Transaction();
        when(transactionRepository.findById(id)).thenReturn(Optional.of(tx));
        when(transactionRepository.save(any())).thenReturn(tx);

        Transaction updated = transactionService.updateTransaction(id, tx);
        assertNotNull(updated);
    }

    @Test
    public void testDeleteTransaction() {
        String id = "tx123";
        doNothing().when(transactionRepository).deleteById(id);
        transactionService.deleteTransaction(id);
        verify(transactionRepository).deleteById(id);
    }

    @Test
    public void testFilterByAmount() {
        double min = 10.0, max = 100.0;
        when(transactionRepository.findAll()).thenReturn(List.of(new Transaction()));
        List<Transaction> result = transactionService.filterByAmount(min, max);
        assertNotNull(result);
    }

    @Test
    public void testFilterByTransactionDateRange() {
        Instant start = Instant.now().minusSeconds(3600);
        Instant end = Instant.now();
        when(transactionRepository.findAll()).thenReturn(List.of(new Transaction()));
        List<Transaction> result = transactionService.filterByTransactionDateRange(start, end);
        assertNotNull(result);
    }
}
