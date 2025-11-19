use anchor_lang::prelude::*;

declare_id!("HpRwVwXXWhmdUh2FGddxdgX6ebLWAWLp1Bbae2aoQruU");

#[program]
pub mod counter_dapp {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
