package com.piggybank.backend.repository;

import com.piggybank.backend.model.User;
import com.piggybank.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataMongoTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository repository;

    @Test
    public void testSaveAndFind() {
        User user = new User();
        user.setId("testId");
        user.setUsername("testUser");
        user.setPassword("testPass");
        user.setEmail("test@example.com");
        user.setRole("USER");

        repository.save(user);

        Optional<User> found = repository.findById("testId");
        assertThat(found).isPresent();
        assertThat(found.get().getUsername()).isEqualTo("testUser");
    }
}
