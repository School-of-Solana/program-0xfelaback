import { useQueryClient } from '@tanstack/react-query'
import { useClientAccountsQueryKey } from './use-client-accounts-query-key'

export function useClientAccountsInvalidate() {
  const queryClient = useQueryClient()
  const queryKey = useClientAccountsQueryKey()

  return () => queryClient.invalidateQueries({ queryKey })
}
