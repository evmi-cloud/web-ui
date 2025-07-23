'use client';

import { useEffect, useState } from 'react';
import useClient from '../../components/providers/client-context';
import { EvmLogPipeline } from '../../components/clients/evm_indexer/v1/evm_indexer_pb';
import { EvmLogPipelineTable } from '../../components/pipeline/pipeline-table/pipeline-table';

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<EvmLogPipeline[]>([]);
  const [runningPipelines, setRunningPipelines] = useState(new Set<number>());
  const client = useClient();

  useEffect(() => {
    client.client.listEvmLogPipelines({ 
      pagination: { limit: 50, offset: 0 }
    }).then((res) => {
      setPipelines(res.pipelines);
    })
    .catch((error) => console.error(error));
  }, []);

  const refetch = () => {
    client.client.listEvmLogPipelines({ 
      pagination: { limit: 50, offset: 0 }
    }).then((res) => {
      setPipelines(res.pipelines);
    })
    .catch((error) => console.error(error));
  }

  return (
    <EvmLogPipelineTable 
      data={pipelines} 
      refetch={refetch}
      runningPipelines={runningPipelines}
    />
  );
}
