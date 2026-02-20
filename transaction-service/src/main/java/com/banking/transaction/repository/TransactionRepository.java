package com.banking.transaction.repository;

import com.banking.transaction.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    @Query("SELECT t FROM Transaction t WHERE t.fromAccountNumber = ?1 OR t.toAccountNumber = ?1 ORDER BY t.createdAt DESC LIMIT 20")
    List<Transaction> findTop20ByAccountNumber(String accountNumber);

    @Query("SELECT t FROM Transaction t WHERE t.fromAccountId = ?1 OR t.toAccountId = ?1 ORDER BY t.createdAt DESC LIMIT 20")
    List<Transaction> findTop20ByAccountId(Long accountId);
}
