import { ClientUiCard } from './client-ui-card'
import { useClientAccountsQuery } from '@/features/client/data-access/use-client-accounts-query'
import { UiWalletAccount } from '@wallet-ui/react'

export function ClientUiList({ account }: { account: UiWalletAccount }) {
  const clientAccountsQuery = useClientAccountsQuery()

  if (clientAccountsQuery.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }

  if (!clientAccountsQuery.data?.length) {
    return (
      <div className="text-center">
        <h2 className={'text-2xl'}>No accounts</h2>
        No accounts found. Initialize one to get started.
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      {clientAccountsQuery.data?.map((client) => (
        <ClientUiCard account={account} key={client.address} client={client} />
      ))}
    </div>
  )
}
