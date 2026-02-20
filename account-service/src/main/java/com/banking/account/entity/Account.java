package com.banking.account.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "app_accounts")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "account_number", unique = true, length = 10)
    private String accountNumber;

    @Column(precision = 15, scale = 2)
    private BigDecimal balance = new BigDecimal("1000.00");

    @Column(name = "account_type", length = 20)
    private String accountType = "SAVINGS";

    public Account() {}

    public Account(Long userId, String accountNumber, BigDecimal balance, String accountType) {
        this.userId = userId;
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.accountType = accountType;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public BigDecimal getBalance() { return balance; }
    public void setBalance(BigDecimal balance) { this.balance = balance; }
    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }
}
