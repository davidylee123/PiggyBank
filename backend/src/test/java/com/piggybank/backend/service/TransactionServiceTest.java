package com.piggybank.backend.service;

import com.piggybank.backend.model.Transaction;
import com.piggybank.backend.repository.TransactionRepository;
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
    public void testUpdateTransaction_NotFound() {
        String id = "missing";
        Transaction tx = new Transaction();
        when(transactionRepository.findById(id)).thenReturn(Optional.empty());

        Transaction result = transactionService.updateTransaction(id, tx);
        assertNull(result);
    }

    @Test
    public void testDeleteTransaction() {
        String id = "tx123";
        doNothing().when(transactionRepository).deleteById(id);
        transactionService.deleteTransaction(id);
        verify(transactionRepository).deleteById(id);
    }

    @Test
    public void testFilterByAmount_Correct() {
        when(transactionRepository.findByAmount(10.0, 100.0)).thenReturn(List.of(new Transaction()));
        List<Transaction> result = transactionService.filterByAmount(10.0, 100.0);
        assertEquals(1, result.size());
    }

    @Test
    public void testFilterByTransactionDateRange_Correct() {
        Instant start = Instant.now().minusSeconds(3600);
        Instant end = Instant.now();
        when(transactionRepository.findByTransactionDateBetween(start, end)).thenReturn(List.of(new Transaction()));
        List<Transaction> result = transactionService.filterByTransactionDateRange(start, end);
        assertEquals(1, result.size());
    }

    @Test
    public void testGetAllTransactions() {
        when(transactionRepository.findAll()).thenReturn(List.of(new Transaction()));
        List<Transaction> result = transactionService.getAllTransactions();
        assertEquals(1, result.size());
    }

    @Test
    public void testCreateTransaction() {
        Transaction tx = new Transaction();
        when(transactionRepository.save(tx)).thenReturn(tx);
        Transaction result = transactionService.createTransaction(tx);
        assertEquals(tx, result);
    }

    @Test
    public void testFilterByTransactionType() {
        when(transactionRepository.findByType("income")).thenReturn(List.of(new Transaction()));
        List<Transaction> result = transactionService.filterByTransactionType("income");
        assertEquals(1, result.size());
    }

    @Test
    public void testFilterByTransactionCategory() {
        when(transactionRepository.findByCategory("groceries")).thenReturn(List.of(new Transaction()));
        List<Transaction> result = transactionService.filterByTransactionCategory("groceries");
        assertEquals(1, result.size());
    }
}
