package com.piggybank.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
    public void testMainMethodRuns() {
        BackendApplication.main(new String[] {});
    }

}
