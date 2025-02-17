package com.piggybank.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "budget")
public class Budget {

    @Id
    private String id;
    private String userId;
    private double monthlyLimit;
    private double spentAmount;
}
