package com.banking.account.dto;

import java.math.BigDecimal;

public class UpdateBalanceRequest {
    private String accountNumber;
    private BigDecimal amount;
    private String type; // DEBIT or CREDIT

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
