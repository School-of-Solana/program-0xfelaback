#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe");

#[program]
pub mod client {
    use super::*;

    pub fn close(_ctx: Context<CloseClient>) -> Result<()> {
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.client.count = ctx.accounts.client.count.checked_sub(1).unwrap();
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.client.count = ctx.accounts.client.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn initialize(_ctx: Context<InitializeClient>) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
        ctx.accounts.client.count = value.clone();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeClient<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  init,
  space = 8 + Client::INIT_SPACE,
  payer = payer
    )]
    pub client: Account<'info, Client>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseClient<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  mut,
  close = payer, // close account and return lamports to payer
    )]
    pub client: Account<'info, Client>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub client: Account<'info, Client>,
}

#[account]
#[derive(InitSpace)]
pub struct Client {
    count: u8,
}
