-- 5 sample transactions
INSERT INTO app_transactions (from_account_id, to_account_id, from_account_number, to_account_number, amount, transaction_type, created_at) VALUES (1, 3, '1000000001', '1000000003', 500.00, 'TRANSFER', '2024-01-15 10:30:00');
INSERT INTO app_transactions (from_account_id, to_account_id, from_account_number, to_account_number, amount, transaction_type, created_at) VALUES (3, 1, '1000000003', '1000000001', 200.00, 'TRANSFER', '2024-01-16 14:45:00');
INSERT INTO app_transactions (from_account_id, to_account_id, from_account_number, to_account_number, amount, transaction_type, created_at) VALUES (1, 2, '1000000001', '1000000002', 1000.00, 'TRANSFER', '2024-01-17 09:15:00');
INSERT INTO app_transactions (from_account_id, to_account_id, from_account_number, to_account_number, amount, transaction_type, created_at) VALUES (2, 3, '1000000002', '1000000003', 750.00, 'TRANSFER', '2024-01-18 16:20:00');
INSERT INTO app_transactions (from_account_id, to_account_id, from_account_number, to_account_number, amount, transaction_type, created_at) VALUES (3, 2, '1000000003', '1000000002', 300.00, 'TRANSFER', '2024-01-19 11:00:00');
