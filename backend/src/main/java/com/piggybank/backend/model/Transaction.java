package com.piggybank.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;
    private String userId;
    private double amount;
    private String description;
    private String category;
    private Date transactionDate;
    private String type;

    public Transaction() {}

}