import { ClientAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useClientDecrementMutation } from '../data-access/use-client-decrement-mutation'

export function ClientUiButtonDecrement({ account, client }: { account: UiWalletAccount; client: ClientAccount }) {
  const decrementMutation = useClientDecrementMutation({ account, client })

  return (
    <Button variant="outline" onClick={() => decrementMutation.mutateAsync()} disabled={decrementMutation.isPending}>
      Decrement
    </Button>
  )
}
