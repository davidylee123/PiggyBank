package com.piggybank.backend.repository;

import com.piggybank.backend.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByType(String type);

    List<Transaction> findByCategory(String category);

    @Query("{ 'amount': { '$gte': ?0, '$lt': ?1 } }")
    List<Transaction> findByAmount(double min, double max);

    @Query("{ 'transactionDate': { '$gte': ?0, '$lt': ?1 } }")
    List<Transaction> findByTransactionDateBetween(Instant startDate, Instant endDate);
}
