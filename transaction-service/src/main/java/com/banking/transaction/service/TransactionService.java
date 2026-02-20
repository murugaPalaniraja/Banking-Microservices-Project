package com.banking.transaction.service;

import com.banking.transaction.dto.AccountDto;
import com.banking.transaction.dto.TransferRequest;
import com.banking.transaction.entity.Transaction;
import com.banking.transaction.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final RestTemplate restTemplate;

    private static final String ACCOUNT_SERVICE_URL = "http://account-service/api/accounts";

    public TransactionService(TransactionRepository transactionRepository, RestTemplate restTemplate) {
        this.transactionRepository = transactionRepository;
        this.restTemplate = restTemplate;
    }

    public Transaction transfer(TransferRequest request) {
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Transfer amount must be positive");
        }

        if (request.getFromAccountNumber().equals(request.getToAccountNumber())) {
            throw new RuntimeException("Cannot transfer to the same account");
        }

        // Get source account from Account Service
        AccountDto fromAccount = restTemplate.getForObject(
                ACCOUNT_SERVICE_URL + "/" + request.getFromAccountNumber(),
                AccountDto.class
        );

        if (fromAccount == null) {
            throw new RuntimeException("Source account not found");
        }

        // Check balance
        if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient balance. Available: ₹" + fromAccount.getBalance());
        }

        // Get destination account
        AccountDto toAccount = restTemplate.getForObject(
                ACCOUNT_SERVICE_URL + "/" + request.getToAccountNumber(),
                AccountDto.class
        );

        if (toAccount == null) {
            throw new RuntimeException("Destination account not found");
        }

        // Debit from source account
        restTemplate.put(ACCOUNT_SERVICE_URL + "/update-balance",
                Map.of("accountNumber", request.getFromAccountNumber(),
                        "amount", request.getAmount(),
                        "type", "DEBIT"));

        // Credit to destination account
        restTemplate.put(ACCOUNT_SERVICE_URL + "/update-balance",
                Map.of("accountNumber", request.getToAccountNumber(),
                        "amount", request.getAmount(),
                        "type", "CREDIT"));

        // Save transaction record
        Transaction transaction = new Transaction();
        transaction.setFromAccountId(fromAccount.getId());
        transaction.setToAccountId(toAccount.getId());
        transaction.setFromAccountNumber(request.getFromAccountNumber());
        transaction.setToAccountNumber(request.getToAccountNumber());
        transaction.setAmount(request.getAmount());
        transaction.setTransactionType("TRANSFER");
        transaction.setCreatedAt(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByAccountNumber(String accountNumber) {
        return transactionRepository.findTop20ByAccountNumber(accountNumber);
    }

    public List<Transaction> getTransactionsByAccountId(Long accountId) {
        return transactionRepository.findTop20ByAccountId(accountId);
    }
}
