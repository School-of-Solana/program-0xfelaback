// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, getBase58Decoder, SolanaClient } from 'gill'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Client, CLIENT_DISCRIMINATOR, CLIENT_PROGRAM_ADDRESS, getClientDecoder } from './client/js'
import ClientIDL from '../target/idl/client.json'

export type ClientAccount = Account<Client, string>

// Re-export the generated IDL and type
export { ClientIDL }

export * from './client/js'

export function getClientProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getClientDecoder(),
    filter: getBase58Decoder().decode(CLIENT_DISCRIMINATOR),
    programAddress: CLIENT_PROGRAM_ADDRESS,
  })
}
