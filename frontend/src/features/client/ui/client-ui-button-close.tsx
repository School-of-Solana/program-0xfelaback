import { ClientAccount } from '@project/anchor'
import { UiWalletAccount } from '@wallet-ui/react'
import { Button } from '@/components/ui/button'

import { useClientCloseMutation } from '@/features/client/data-access/use-client-close-mutation'

export function ClientUiButtonClose({ account, client }: { account: UiWalletAccount; client: ClientAccount }) {
  const closeMutation = useClientCloseMutation({ account, client })

  return (
    <Button
      variant="destructive"
      onClick={() => {
        if (!window.confirm('Are you sure you want to close this account?')) {
          return
        }
        return closeMutation.mutateAsync()
      }}
      disabled={closeMutation.isPending}
    >
      Close
    </Button>
  )
}
