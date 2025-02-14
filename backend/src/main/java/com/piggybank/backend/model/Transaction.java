package com.piggybank.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;
    private String userId;
    private double amount;
    private String description;
    private String category;
    private Instant transactionDate;
    private String type;

    public Transaction() {}

    public Transaction(String id, String userId, double amount, String description, String category, Instant transactionDate, String type) {
        this.id = id;
        this.userId = userId;
        this.amount = amount;
        this.description = description;
        this.category = category;
        this.transactionDate = transactionDate;
        this.type = type;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Instant getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(Instant transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}