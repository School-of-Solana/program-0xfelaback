/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect, useCallback } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor'
import idl from './counter.json'
import { Counter } from '../../../anchor_project/counter-dapp/target/types/counter'
import { TransactionMessage, VersionedTransaction } from '@solana/web3.js'

interface CounterAccount {
  owner: web3.PublicKey
  count: BN
  totalIncrements: BN
  createdAt: BN
}

export default function Home() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const { publicKey, sendTransaction } = wallet
  const [counter, setCounter] = useState<CounterAccount | null>(null)
  const [loading, setLoading] = useState(false)

  const getProvider = useCallback(() => {
    if (!wallet || !connection) return null
    return new AnchorProvider(connection, wallet as AnchorProvider['wallet'], {})
  }, [connection, wallet])

  const program = useCallback(() => {
    const provider = getProvider()
    if (!provider) throw new Error('Wallet not connected')
    return new Program<Counter>(idl as Counter, provider)
  }, [getProvider])

  const getCounterPda = useCallback(() => {
    if (!publicKey) throw new Error('Wallet not connected')
    const [pda] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('counter'), publicKey.toBuffer()],
      program().programId,
    )
    console.log('Program id ?', program().programId)
    return pda
  }, [publicKey, program])

  const fetchCounter = useCallback(async () => {
    if (!publicKey) return
    const counterPda = getCounterPda()
    try {
      const acc = await program().account.counter.fetch(counterPda)
      setCounter(acc as CounterAccount)
    } catch {
      setCounter(null)
    }
  }, [publicKey, program, getCounterPda])

  /*useEffect(() => {
    if (publicKey) {
      const counterPda = getCounterPda()
      console.log('Derived Counter PDA:', counterPda.toBase58())
    }
  }, [publicKey, getCounterPda])*/

  useEffect(() => {
    if (publicKey) {
      fetchCounter()
    }
  }, [publicKey, fetchCounter])

  const initialize = async () => {
    if (!publicKey) return
    setLoading(true)
    try {
      const counterPda = getCounterPda()
      const instruction = await program()
        .methods.initialize()
        .accountsPartial({ counter: counterPda, user: publicKey })
        .instruction()
      const blockhash = (await connection.getLatestBlockhash()).blockhash
      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: [instruction],
      }).compileToV0Message()
      const tx = new VersionedTransaction(messageV0)

      // TEST SIMULATION
      const simResult = await connection.simulateTransaction(tx, { sigVerify: false, commitment: 'processed' })
      console.log('Simulation result:', simResult)
      if (simResult.value.err) {
        console.log('Simulation logs:', simResult.value.logs)
        throw new Error(`Simulation failed: ${JSON.stringify(simResult.value.err)}`)
      }

      const txSig = await sendTransaction(tx, connection)
      await connection.confirmTransaction(txSig)
      await fetchCounter()
    } catch (error: any) {
      console.error('Error initializing counter:', error)
      if (error.logs) console.log('Error logs:', error.logs)
    } finally {
      setLoading(false)
    }
  }

  const increment = async () => {
    if (!publicKey) return
    setLoading(true)
    try {
      const counterPda = getCounterPda()
      const instruction = await program()
        .methods.increment()
        .accountsPartial({ counter: counterPda, user: publicKey })
        .instruction()
      const blockhash = (await connection.getLatestBlockhash()).blockhash
      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: [instruction],
      }).compileToV0Message()
      const tx = new VersionedTransaction(messageV0)
      const txSig = await sendTransaction(tx, connection)
      await connection.confirmTransaction(txSig)
      await fetchCounter()
    } catch (error) {
      console.error('Error incrementing counter:', error)
    } finally {
      setLoading(false)
    }
  }

  const reset = async () => {
    if (!publicKey) return
    setLoading(true)
    try {
      const counterPda = getCounterPda()
      const instruction = await program()
        .methods.reset()
        .accountsPartial({ counter: counterPda, user: publicKey })
        .instruction()
      const blockhash = (await connection.getLatestBlockhash()).blockhash
      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: [instruction],
      }).compileToV0Message()
      const tx = new VersionedTransaction(messageV0)
      const txSig = await sendTransaction(tx, connection)
      await connection.confirmTransaction(txSig)
      await fetchCounter()
    } catch (error) {
      console.error('Error resetting counter:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Solana Counter dApp</h1>
          <WalletMultiButton />
        </div>
        {!publicKey ? (
          <p className="text-center text-xl">Connect your wallet to start counting!</p>
        ) : (
          <div className="bg-gray-800 rounded-xl p-8 space-y-6">
            <button onClick={fetchCounter} className="text-sm text-gray-400 underline">
              Refresh
            </button>
            {counter === null ? (
              <button
                onClick={initialize}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-lg text-xl"
              >
                {loading ? 'Loading...' : 'Create My Counter'}
              </button>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-6xl font-bold">{counter.count.toString()}</p>
                  <p className="text-gray-400 mt-2">Total increments: {counter.totalIncrements.toString()}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={increment}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-4 rounded-lg text-2xl"
                  >
                    {loading ? '...' : '+'}
                  </button>
                  <button
                    onClick={reset}
                    disabled={loading}
                    className="flex-1 bg-red-600 hover:bg-red-700 py-4 rounded-lg"
                  >
                    Reset
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
