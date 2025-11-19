import { ClientAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'
import { useClientIncrementMutation } from '../data-access/use-client-increment-mutation'

export function ClientUiButtonIncrement({ account, client }: { account: UiWalletAccount; client: ClientAccount }) {
  const incrementMutation = useClientIncrementMutation({ account, client })

  return (
    <Button variant="outline" onClick={() => incrementMutation.mutateAsync()} disabled={incrementMutation.isPending}>
      Increment
    </Button>
  )
}
