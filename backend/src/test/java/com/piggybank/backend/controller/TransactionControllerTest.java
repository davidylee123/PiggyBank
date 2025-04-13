package com.piggybank.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
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

import java.time.Instant;
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
    void testGetTransactionById_NotFound() throws Exception {
        Mockito.when(transactionService.getTransactionById("txn404"))
               .thenReturn(Optional.empty());

        mockMvc.perform(get("/api/transactions/txn404"))
               .andExpect(status().isNotFound());
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
    void testUpdateTransaction_NotFound() throws Exception {
        Transaction tx = new Transaction();
        tx.setAmount(100.0);

        Mockito.when(transactionService.updateTransaction(Mockito.eq("txn404"), Mockito.any(Transaction.class)))
               .thenReturn(null);

        mockMvc.perform(put("/api/transactions/txn404")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(tx)))
               .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteTransaction() throws Exception {
        Mockito.doNothing().when(transactionService).deleteTransaction("txn123");

        mockMvc.perform(delete("/api/transactions/txn123"))
               .andExpect(status().isNoContent());
    }

    @Test
    void testFilterTransactionByType() throws Exception {
        Mockito.when(transactionService.filterByTransactionType("expense"))
               .thenReturn(List.of());

        mockMvc.perform(get("/api/transactions/filter/expense"))
               .andExpect(status().isOk());
    }

    @Test
    void testFilterTransactionByCategory() throws Exception {
        Mockito.when(transactionService.filterByTransactionCategory("groceries"))
               .thenReturn(List.of());

        mockMvc.perform(get("/api/transactions/filterbycategory?category=groceries"))
               .andExpect(status().isOk());
    }

    @Test
    void testFilterTransactionByAmount() throws Exception {
        Mockito.when(transactionService.filterByAmount(50.0, 200.0))
               .thenReturn(List.of());

        mockMvc.perform(get("/api/transactions/filterbyamount?min=50.0&max=200.0"))
               .andExpect(status().isOk());
    }

    @Test
    void testFilterTransactionByDateRange() throws Exception {
        String startDate = "2024-01-01T00:00:00Z";
        String endDate = "2024-12-31T23:59:59Z";

        Mockito.when(transactionService.filterByTransactionDateRange(
                Instant.parse(startDate), Instant.parse(endDate)))
               .thenReturn(List.of());

        mockMvc.perform(get("/api/transactions/filterbydaterange")
                .param("startDate", startDate)
                .param("endDate", endDate))
               .andExpect(status().isOk());
    }
}