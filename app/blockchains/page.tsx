'use client';

import { useEffect, useState } from 'react';
import useClient from '../../components/providers/client-context';
import { EvmBlockchain } from '../../components/clients/evm_indexer/v1/evm_indexer_pb';
import { EvmBlockchainTable } from '../../components/blockchain/blockchain-table/blockchain-table';

export default function BlockchainsPage() {
  const [blockchains, setBlockchains] = useState<EvmBlockchain[]>([]);
  const client = useClient();

  useEffect(() => {
    client.client.listEvmBlockchains({ 
      pagination: { limit: 50, offset: 0 }
    }).then((res) => {
      setBlockchains(res.blockchains);
    })
    .catch((error) => console.error(error));
  }, []);

  const refetch = () => {
    client.client.listEvmBlockchains({ 
      pagination: { limit: 50, offset: 0 }
    }).then((res) => {
      setBlockchains(res.blockchains);
    })
    .catch((error) => console.error(error));
  }

  return (
    <EvmBlockchainTable data={blockchains} refetch={refetch} />
  );
}
