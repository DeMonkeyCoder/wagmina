import { type QueryKey, useQueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { useWatchBlockHash } from './useWatchBlockHash.js'

export function useInvalidateOnBlock({
  networkId,
  enabled,
  queryKey,
}: {
  networkId?: string
  enabled?: boolean
  queryKey: QueryKey
}) {
  const queryClient = useQueryClient()

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const onBlock = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey }, { cancelRefetch: false })
  }, [])

  useWatchBlockHash({
    networkId,
    enabled,
    onBlockHash: enabled ? onBlock : undefined,
  })
}
