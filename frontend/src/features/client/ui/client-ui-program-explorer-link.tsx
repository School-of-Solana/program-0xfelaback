import { CLIENT_PROGRAM_ADDRESS } from '@project/anchor'
import { AppExplorerLink } from '@/components/app-explorer-link'
import { ellipsify } from '@wallet-ui/react'

export function ClientUiProgramExplorerLink() {
  return <AppExplorerLink address={CLIENT_PROGRAM_ADDRESS} label={ellipsify(CLIENT_PROGRAM_ADDRESS)} />
}
