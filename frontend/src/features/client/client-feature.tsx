import { useSolana } from '@/components/solana/use-solana'
import { WalletDropdown } from '@/components/wallet-dropdown'
import { AppHero } from '@/components/app-hero'
import { ClientUiButtonInitialize } from './ui/client-ui-button-initialize'
import { ClientUiList } from './ui/client-ui-list'
import { ClientUiProgramExplorerLink } from './ui/client-ui-program-explorer-link'
import { ClientUiProgramGuard } from './ui/client-ui-program-guard'

export default function ClientFeature() {
  const { account } = useSolana()

  return (
    <ClientUiProgramGuard>
      <AppHero
        title="Client"
        subtitle={
          account
            ? "Initialize a new client onchain by clicking the button. Use the program's methods (increment, decrement, set, and close) to change the state of the account."
            : 'Select a wallet to run the program.'
        }
      >
        <p className="mb-6">
          <ClientUiProgramExplorerLink />
        </p>
        {account ? (
          <ClientUiButtonInitialize account={account} />
        ) : (
          <div style={{ display: 'inline-block' }}>
            <WalletDropdown />
          </div>
        )}
      </AppHero>
      {account ? <ClientUiList account={account} /> : null}
    </ClientUiProgramGuard>
  )
}
