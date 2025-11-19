import { ClientAccount } from '@project/anchor'
import { ellipsify, UiWalletAccount } from '@wallet-ui/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ClientUiButtonClose } from './client-ui-button-close'
import { ClientUiButtonDecrement } from './client-ui-button-decrement'
import { ClientUiButtonIncrement } from './client-ui-button-increment'
import { ClientUiButtonSet } from './client-ui-button-set'

export function ClientUiCard({ account, client }: { account: UiWalletAccount; client: ClientAccount }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client: {client.data.count}</CardTitle>
        <CardDescription>
          Account: <AppExplorerLink address={client.address} label={ellipsify(client.address)} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-evenly">
          <ClientUiButtonIncrement account={account} client={client} />
          <ClientUiButtonSet account={account} client={client} />
          <ClientUiButtonDecrement account={account} client={client} />
          <ClientUiButtonClose account={account} client={client} />
        </div>
      </CardContent>
    </Card>
  )
}
