# Anchor Counter Program

This Anchor project implements a simple counter program on the Solana blockchain.

## Program Overview

The program allows users to create a counter account, increment its value, and reset it to zero. Each counter is owned by the user who created it, and only the owner can modify it.

## Instructions

The program exposes the following instructions:

-   `initialize`: Creates a new counter account for the user. The counter is initialized with a count of 0.
-   `increment`: Increments the counter's value by 1.
-   `reset`: Resets the counter's value to 0.

## Account Structure

The program uses a single account to store the counter's state:

```rust
#[account]
pub struct Counter {
    pub owner: Pubkey,
    pub count: u64,
    pub total_increments: u64,
    pub created_at: i64,
}
```

## PDA (Program Derived Address)

The counter account is a PDA derived from the seeds `b"counter"` and the user's public key. This ensures that each user can have one unique counter account.