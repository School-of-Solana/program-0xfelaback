import { useSolana } from '@/components/solana/use-solana'

export function useClientAccountsQueryKey() {
  const { cluster } = useSolana()

  return ['client', 'accounts', { cluster }]
}
