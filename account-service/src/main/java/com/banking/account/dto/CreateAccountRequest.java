package com.banking.account.dto;

import java.math.BigDecimal;

public class CreateAccountRequest {
    private Long userId;
    private String accountType;
    private BigDecimal initialBalance;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }
    public BigDecimal getInitialBalance() { return initialBalance; }
    public void setInitialBalance(BigDecimal initialBalance) { this.initialBalance = initialBalance; }
}
