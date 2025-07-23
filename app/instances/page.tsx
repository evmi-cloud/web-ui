'use client';

import { useEffect, useState } from 'react';
import useClient from '../../components/providers/client-context';
import { EvmiInstance } from '../../components/clients/evm_indexer/v1/evm_indexer_pb';
import { EvmiInstanceTable } from '../../components/instance/instance-table/instance-table';

export default function InstancesPage() {
  const [instances, setInstances] = useState<EvmiInstance[]>([]);
  const client = useClient();

  useEffect(() => {
    client.client.listEvmiInstances({ 
      pagination: { limit: 50, offset: 0 }
    }).then((res) => {
      setInstances(res.instances);
    })
    .catch((error) => console.error(error));
  }, []);

  const refetch = () => {
    client.client.listEvmiInstances({ 
      pagination: { limit: 50, offset: 0 }
    }).then((res) => {
      setInstances(res.instances);
    })
    .catch((error) => console.error(error));
  }

  return (
    <EvmiInstanceTable data={instances} refetch={refetch} />
  );
}