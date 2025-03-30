package com.piggybank.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.piggybank.backend.controller.TransactionController;
import com.piggybank.backend.model.Transaction;
import com.piggybank.backend.service.TransactionService;

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

@WebMvcTest(TransactionController.class)
@Import(com.piggybank.backend.config.TestSecurityConfig.class)
public class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransactionService transactionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllTransactions() throws Exception {
        Mockito.when(transactionService.getAllTransactions()).thenReturn(List.of());
        mockMvc.perform(get("/api/transactions"))
               .andExpect(status().isOk());
    }

    @Test
    void testGetTransactionById() throws Exception {
        Transaction tx = new Transaction();
        tx.setId("txn123");
        Mockito.when(transactionService.getTransactionById("txn123")).thenReturn(Optional.of(tx));
        mockMvc.perform(get("/api/transactions/txn123"))
               .andExpect(status().isOk());
    }

    @Test
    void testCreateTransaction() throws Exception {
        Transaction tx = new Transaction();
        tx.setAmount(100.0);

        Mockito.when(transactionService.createTransaction(Mockito.any(Transaction.class))).thenReturn(tx);

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tx)))
               .andExpect(status().isOk());
    }

    @Test
    void testUpdateTransaction() throws Exception {
        Transaction tx = new Transaction();
        tx.setId("txn123");
        tx.setAmount(150.0);

        Mockito.when(transactionService.updateTransaction(Mockito.eq("txn123"), Mockito.any(Transaction.class))).thenReturn(tx);

        mockMvc.perform(put("/api/transactions/txn123")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tx)))
               .andExpect(status().isOk());
    }

    @Test
    void testDeleteTransaction() throws Exception {
        Mockito.doNothing().when(transactionService).deleteTransaction("txn123");

        mockMvc.perform(delete("/api/transactions/txn123"))
               .andExpect(status().isNoContent());
    }
}
