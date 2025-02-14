package com.piggybank.backend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "budget")
public class Budget {

    @Id
    private String id;
    private String userId;
    private double monthlyLimit;
    private double spentAmount;

    public Budget() {}

    public Budget(String id, String userId, double monthlyLimit, double spentAmount) {
        this.id = id;
        this.userId = userId;
        this.monthlyLimit = monthlyLimit;
        this.spentAmount = spentAmount;
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

    public double getMonthlyLimit() {
        return monthlyLimit;
    }

    public void setMonthlyLimit(double monthlyLimit) {
        this.monthlyLimit = monthlyLimit;
    }

    public double getSpentAmount() {
        return spentAmount;
    }

    public void setSpentAmount(double spentAmount) {
        this.spentAmount = spentAmount;
    }
}
