package com.piggybank.backend.controller;

import com.piggybank.backend.model.Transaction;
import com.piggybank.backend.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    @Autowired
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable String id) {
        Optional<Transaction> transaction = transactionService.getTransactionById(id);
        return transaction.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
        Transaction createdTransaction = transactionService.createTransaction(transaction);
        return ResponseEntity.ok(createdTransaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(@PathVariable String id,
                                                         @RequestBody Transaction transaction) {
        Transaction updatedTransaction = transactionService.updateTransaction(id, transaction);
        if (updatedTransaction != null) {
            return ResponseEntity.ok(updatedTransaction);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable String id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filter/{type}")
    public ResponseEntity<List<Transaction>> filterTransaction(@PathVariable String type) {
        List<Transaction> transactions = transactionService.filterByTransactionType(type);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/filterbycategory")
    public ResponseEntity<List<Transaction>> filterTransactionCategory(@RequestParam String category) {
        List<Transaction> transactions = transactionService.filterByTransactionCategory(category);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/filterbyamount")
    public ResponseEntity<List<Transaction>> filterByTransactionAmount(@RequestParam double min, @RequestParam double max) {
        List<Transaction> transactions = transactionService.filterByAmount(min, max);
        return ResponseEntity.ok(transactions);
    }
}
