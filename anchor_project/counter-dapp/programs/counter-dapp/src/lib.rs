use anchor_lang::prelude::*;

declare_id!("GXsxdre1jBvjT1R4fEZxPumaHzf5TnrMRpFx1MVGz4QV");

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.owner = ctx.accounts.user.key();
        counter.count = 0;
        counter.total_increments = 0;
        counter.created_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn increment(ctx: Context<ModifyCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        counter.total_increments += 1;
        Ok(())
    }

    pub fn reset(ctx: Context<ModifyCounter>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 8 + 8 + 8,
        seeds = [b"counter", user.key().as_ref()],
        bump
    )]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ModifyCounter<'info> {
    #[account(
        mut,
        seeds = [b"counter", user.key().as_ref()],
        bump,
        constraint = counter.owner == user.key() @ CounterError::Unauthorized
    )]
    pub counter: Account<'info, Counter>,
    pub user: Signer<'info>,
}

#[account]
pub struct Counter {
    pub owner: Pubkey,
    pub count: u64,
    pub total_increments: u64,
    pub created_at: i64,
}

#[error_code]
pub enum CounterError {
    #[msg("Only the owner can modify this counter")]
    Unauthorized,
}
