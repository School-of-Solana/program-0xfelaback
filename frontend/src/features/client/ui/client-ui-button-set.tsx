import { ClientAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useClientSetMutation } from '@/features/client/data-access/use-client-set-mutation'

export function ClientUiButtonSet({ account, client }: { account: UiWalletAccount; client: ClientAccount }) {
  const setMutation = useClientSetMutation({ account, client })

  return (
    <Button
      variant="outline"
      onClick={() => {
        const value = window.prompt('Set value to:', client.data.count.toString() ?? '0')
        if (!value || parseInt(value) === client.data.count || isNaN(parseInt(value))) {
          return
        }
        return setMutation.mutateAsync(parseInt(value))
      }}
      disabled={setMutation.isPending}
    >
      Set
    </Button>
  )
}
