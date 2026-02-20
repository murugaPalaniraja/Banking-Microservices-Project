package com.banking.account.service;

import com.banking.account.dto.CreateAccountRequest;
import com.banking.account.dto.UpdateBalanceRequest;
import com.banking.account.entity.Account;
import com.banking.account.repository.AccountRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;

@Service
public class AccountService {

    private final AccountRepository accountRepository;

    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    public Account createAccount(CreateAccountRequest request) {
        Account account = new Account();
        account.setUserId(request.getUserId());
        account.setAccountNumber(generateAccountNumber());
        account.setBalance(request.getInitialBalance() != null ? request.getInitialBalance() : new BigDecimal("1000.00"));
        account.setAccountType(request.getAccountType() != null ? request.getAccountType() : "SAVINGS");
        return accountRepository.save(account);
    }

    public List<Account> getAccountsByUserId(Long userId) {
        return accountRepository.findByUserId(userId);
    }

    public Account getAccountByNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Account not found: " + accountNumber));
    }

    public Account getAccountById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    @Transactional
    public Account updateBalance(UpdateBalanceRequest request) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber())
                .orElseThrow(() -> new RuntimeException("Account not found: " + request.getAccountNumber()));

        if ("DEBIT".equals(request.getType())) {
            if (account.getBalance().compareTo(request.getAmount()) < 0) {
                throw new RuntimeException("Insufficient balance");
            }
            account.setBalance(account.getBalance().subtract(request.getAmount()));
        } else if ("CREDIT".equals(request.getType())) {
            account.setBalance(account.getBalance().add(request.getAmount()));
        }

        return accountRepository.save(account);
    }

    private String generateAccountNumber() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            sb.append(random.nextInt(10));
        }
        String number = sb.toString();
        // Ensure uniqueness
        if (accountRepository.findByAccountNumber(number).isPresent()) {
            return generateAccountNumber();
        }
        return number;
    }
}
