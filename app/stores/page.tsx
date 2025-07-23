'use client';

import { useEffect, useState } from 'react';
import useClient from '../../components/providers/client-context';
import { EvmLogStore } from '../../components/clients/evm_indexer/v1/evm_indexer_pb';
import { EvmLogStoreTable } from '../../components/store/store-table/store-table';

export default function StoresPage() {
  const [stores, setStores] = useState<EvmLogStore[]>([]);
  const client = useClient();

  useEffect(() => {
    client.client.listEvmLogStores({ 
      pagination: { limit: 50, offset: 0 }
    }).then((res) => {
      setStores(res.stores);
    })
    .catch((error) => console.error(error));
  }, []);

  const refetch = () => {
    client.client.listEvmLogStores({ 
      pagination: { limit: 50, offset: 0 }
    }).then((res) => {
      setStores(res.stores);
    })
    .catch((error) => console.error(error));
  }

  return (
    <EvmLogStoreTable data={stores} refetch={refetch} />
  );
}