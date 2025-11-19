import { useSolana } from '@/components/solana/use-solana'
import { useQuery } from '@tanstack/react-query'
import { getClientProgramAccounts } from '@project/anchor'
import { useClientAccountsQueryKey } from './use-client-accounts-query-key'

export function useClientAccountsQuery() {
  const { client } = useSolana()

  return useQuery({
    queryKey: useClientAccountsQueryKey(),
    queryFn: async () => await getClientProgramAccounts(client.rpc),
  })
}
