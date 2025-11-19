import { Button } from '@/components/ui/button'
import { UiWalletAccount } from '@wallet-ui/react'

import { useClientInitializeMutation } from '@/features/client/data-access/use-client-initialize-mutation'

export function ClientUiButtonInitialize({ account }: { account: UiWalletAccount }) {
  const mutationInitialize = useClientInitializeMutation({ account })

  return (
    <Button onClick={() => mutationInitialize.mutateAsync()} disabled={mutationInitialize.isPending}>
      Initialize Client {mutationInitialize.isPending && '...'}
    </Button>
  )
}
