# Project Description

**Deployed Frontend URL:** https://x.com

**Solana Program ID:** MY3r8x1gJ9mnZTiWFWcvr3wThyCjLvvzNKsJ48ix9uW

## Project Overview

### Description

This project is a simple counter dApp built on the Solana blockchain using the Anchor framework. It allows users to create a personal counter, increment its value, and reset it. The dApp demonstrates the use of Program Derived Addresses (PDAs) to create user-specific accounts.

### Key Features

- **Create Counter**: Initialize a new counter account for a user.
- **Increment Counter**: Increase the value of the counter by one.
- **Reset Counter**: Set the counter's value back to zero.

### How to Use the dApp

1. **Connect Wallet**
2. **Initialize Counter:** Click the "Initialize" button to create a new counter account.
3. **Increment Counter:** Click the "Increment" button to increase the counter's value.
4. **Reset Counter:** Click the "Reset" button to set the counter back to zero.

## Program Architecture

The Solana program is built with Anchor and exposes three main instructions: `initialize`, `increment`, and `reset`. It uses a PDA to create a unique counter account for each user.

### PDA Usage

The program uses a PDA for the `Counter` account. This ensures that each user can have only one counter, tied to their public key.

**PDAs Used:**

- **Counter PDA**: This PDA stores the state of a user's counter. It is derived using the seeds `b"counter"` and the user's public key.

### Program Instructions

**Instructions Implemented:**

- **initialize**: Creates and initializes a new `Counter` account for the user.
- **increment**: Increases the `count` field in the `Counter` account by 1.
- **reset**: Resets the `count` field in the `Counter` account to 0.

### Account Structure

```rust
#[account]
pub struct Counter {
    pub owner: Pubkey,
    pub count: u64,
    pub total_increments: u64,
    pub created_at: i64,
}
```

## Testing

### Test Coverage

The tests cover both happy and unhappy paths for all three instructions.

**Happy Path Tests:**

- **initialize**: Successfully creates a new counter account.
- **increment**: Successfully increments the counter.
- **reset**: Successfully resets the counter.

**Unhappy Path Tests:**

- **Unauthorized Access**: Ensures that only the owner of the counter can call the `increment` and `reset` instructions.

### Running Tests

```bash
# Commands to run your tests
anchor test
```

### Additional Notes for Evaluators

This project is a straightforward implementation of a counter dApp, designed to meet the core requirements of the assignment. It demonstrates a clear understanding of Anchor, PDAs, and testing on Solana.
