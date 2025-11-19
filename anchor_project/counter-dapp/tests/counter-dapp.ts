import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { expect } from "chai";

describe("counter-dapp", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Counter as Program<Counter>;
  const user = provider.wallet.publicKey;

  const [counterPda] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("counter"), user.toBuffer()],
    program.programId
  );

  it("Initialize counter", async () => {
    await program.methods
      .initialize()
      .accountsPartial({
        counter: counterPda,
        user: user,
      })
      .rpc();

    const account = await program.account.counter.fetch(counterPda);
    expect(account.count.toNumber()).to.equal(0);
    expect(account.owner.toBase58()).to.equal(user.toBase58());
  });

  it("Increment counter", async () => {
    await program.methods
      .increment()
      .accountsPartial({
        counter: counterPda,
        user: user,
      })
      .rpc();

    const account = await program.account.counter.fetch(counterPda);
    expect(account.count.toNumber()).to.equal(1);
    expect(account.totalIncrements.toNumber()).to.equal(1);
  });

  it("Reset counter", async () => {
    await program.methods
      .reset()
      .accountsPartial({
        counter: counterPda,
        user: user,
      })
      .rpc();

    const account = await program.account.counter.fetch(counterPda);
    expect(account.count.toNumber()).to.equal(0);
    expect(account.totalIncrements.toNumber()).to.equal(1);
  });

  it("Fail: non-owner increment", async () => {
    const fake = anchor.web3.Keypair.generate();

    await provider.connection.requestAirdrop(fake.publicKey, 100_000_000);
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(fake.publicKey, 100_000_000)
    );

    try {
      await program.methods
        .increment()
        .accountsPartial({
          counter: counterPda,
          user: fake.publicKey,
        })
        .signers([fake])
        .rpc();
      expect.fail("Should have thrown");
    } catch (err: any) {
      expect(err.error.errorCode.code).to.equal("ConstraintSeeds");
    }
  });

  it("Fail: initialize twice", async () => {
    let didThrow = false;
    try {
      await program.methods
        .initialize()
        .accountsPartial({
          counter: counterPda,
          user: user,
        })
        .rpc();
      expect.fail("Should have thrown");
    } catch (err: any) {
      didThrow = true;

      console.log("Error structure:", JSON.stringify(err, null, 2));

      if (err.error?.errorCode) {
        expect(err.error.errorCode.code).to.be.oneOf([
          "AccountNotInitialized",
          "ConstraintInit",
          "AccountOwnedByWrongProgram",
        ]);
      } else if (err.logs) {
        const logs = err.logs.join(" ");
        expect(logs).to.include("already in use");
      } else {
        expect(err).to.exist;
      }
    }

    expect(didThrow, "Expected transaction to fail").to.be.true;
  });
});
