package com.piggybank.backend.service;

import com.piggybank.backend.model.Transaction;
import com.piggybank.backend.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {
    private final TransactionRepository transactionRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> getTransactionById(String id) {
        return transactionRepository.findById(id);
    }

    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public Transaction updateTransaction(String id, Transaction transaction) {
        Optional<Transaction> existingTransaction = transactionRepository.findById(id);
        if(existingTransaction.isPresent()) {
            Transaction t = existingTransaction.get();
            t.setUserId(transaction.getUserId());
            t.setAmount(transaction.getAmount());
            t.setDescription(transaction.getDescription());
            t.setCategory(transaction.getCategory());
            t.setTransactionDate(transaction.getTransactionDate());
            t.setType(transaction.getType());
            return transactionRepository.save(t);
        }
        return null;
    }

    public void deleteTransaction(String id) {
        transactionRepository.deleteById(id);
    }
}
