//import DashboardFeature from '@/features/dashboard/dashboard-feature'
'use client'

import { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor'
import idl from '../../../anchor_project/counter-dapp/target/idl/counter.json'
import { Counter } from '../../../anchor_project/counter-dapp/target/types/counter'

const PROGRAM_ID = new web3.PublicKey('MY3r8x1gJ9mnZTiWFWcvr3wThyCjLvvzNKsJ48ix9uW')

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

  const getProvider = () => {
    if (!wallet || !connection) return null
    return new AnchorProvider(connection, wallet as AnchorProvider['wallet'], {})
  }

  const getCounterPda = () => {
    if (!publicKey) throw new Error('Wallet not connected')
    const [pda] = web3.PublicKey.findProgramAddressSync([Buffer.from('counter'), publicKey.toBuffer()], PROGRAM_ID)
    return pda
  }

  const program = () => {
    const provider = getProvider()
    if (!provider) throw new Error('Wallet not connected')
    return new Program<Counter>(idl as Counter, provider)
  }
  const fetchCounter = async () => {
    if (!publicKey) return
    const counterPda = getCounterPda()
    try {
      const acc = await program().account.counter.fetch(counterPda)
      setCounter(acc as CounterAccount)
    } catch {
      setCounter(null)
    }
  }

  const initialize = async () => {
    try {
      setLoading(true)
      const counterPda = getCounterPda()
      const tx = await program()
        .methods.initialize()
        .accountsPartial({ counter: counterPda, user: publicKey! })
        .transaction()
      const txSig = await sendTransaction(tx, connection)
      await connection.confirmTransaction(txSig)
      await fetchCounter()
    } catch (error) {
      console.error('Error initializing counter:', error)
    } finally {
      setLoading(false)
    }
  }

  const increment = async () => {
    setLoading(true)
    const counterPda = getCounterPda()
    const tx = await program()
      .methods.increment()
      .accountsPartial({ counter: counterPda, user: publicKey! })
      .transaction()
    const txSig = await sendTransaction(tx, connection)
    await connection.confirmTransaction(txSig)
    fetchCounter()
    setLoading(false)
  }

  const reset = async () => {
    setLoading(true)
    const counterPda = getCounterPda()
    const tx = await program().methods.reset().accountsPartial({ counter: counterPda, user: publicKey! }).transaction()
    const txSig = await sendTransaction(tx, connection)
    await connection.confirmTransaction(txSig)
    fetchCounter()
    setLoading(false)
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
