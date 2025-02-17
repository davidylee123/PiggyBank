package com.piggybank.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
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
}