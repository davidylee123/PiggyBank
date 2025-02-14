package com.piggybank.backend.repository;

import com.piggybank.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    List<User> findByUsernameAndPassword(String username, String password);
}

