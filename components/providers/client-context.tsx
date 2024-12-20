import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react';

import { Client, createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import { EvmIndexerService } from '../clients/evm_indexer/v1/evm_indexer_connect';

interface ClientContextProps {
  url: string,
  client: Client<typeof EvmIndexerService>;
}

interface ClientProviderProps {
  children: ReactNode | ReactNode[];
}

const ClientContext = createContext<ClientContextProps | undefined>(undefined);

export default function useClient() {
  const context = useContext(ClientContext);

  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }

  return context;
}

export function ClientProvider({ children }: ClientProviderProps) {
  const url = 'http://localhost:8080';
  const client = useMemo(
    () => {
      const transport = createConnectTransport({
        baseUrl: url,
      });

      return createClient(EvmIndexerService, transport);
    },
    []
  );

   const value = useMemo(
    () => ({
      url,
      client,
    }),
    [client],
  );

  return (
    <ClientContext.Provider value={value}>
      {children}
    </ClientContext.Provider>
  );
}
