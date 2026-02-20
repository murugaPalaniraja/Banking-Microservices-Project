package com.banking.transaction.controller;

import com.banking.transaction.dto.TransferRequest;
import com.banking.transaction.entity.Transaction;
import com.banking.transaction.service.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody TransferRequest request) {
        try {
            Transaction transaction = transactionService.transfer(request);
            return ResponseEntity.ok(Map.of(
                    "message", "Transfer successful",
                    "transactionId", transaction.getId(),
                    "amount", transaction.getAmount()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<List<Transaction>> getTransactions(@PathVariable String accountNumber) {
        try {
            // Try as account number first
            List<Transaction> transactions = transactionService.getTransactionsByAccountNumber(accountNumber);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            // Fall back to account ID
            try {
                Long accountId = Long.parseLong(accountNumber);
                List<Transaction> transactions = transactionService.getTransactionsByAccountId(accountId);
                return ResponseEntity.ok(transactions);
            } catch (NumberFormatException nfe) {
                return ResponseEntity.ok(List.of());
            }
        }
    }
}
