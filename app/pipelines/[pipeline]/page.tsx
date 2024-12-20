'use client';

import { useEffect, useState } from 'react';
import { OrderBook } from '@lab49/react-order-book';
import useClient from '../../../components/providers/client-context';

import './orderbook.module.css';
import { EvmLog } from '../../../components/clients/evm_indexer/v1/evm_indexer_pb';
import { LogTableSort } from '../../../components/log-table/log-table';
import { useInterval } from '@mantine/hooks';

export default function PipelineDetailsPage(
    { params }: { params: { pipeline: string } }
) {
    const [latestLogs, setLatestLogs] = useState<EvmLog[] | undefined>(undefined);
    const client = useClient();

    // async function listenOrderbook() {
    //     for await (const next of client.client.getOrderBooksStream({ markets: [params] })) {
    //         setOrderbook({
    //             bids: next.orderbook!.bids.map((o) => [o.price.toString(), o.quantity.toString()]),
    //             asks: next.orderbook!.asks.map((o) => [o.price.toString(), o.quantity.toString()]),
    //         });
    //     }
    // }

  useEffect(() => {
    client.client.getLatestsStoreLogs({
      id: params.pipeline,
      limit: BigInt(50)
    }).then((res => {
      setLatestLogs(res.logs)
    })).catch((err) => {
      console.error(err)
    })
  }, [params]);

  useInterval(() => {
    client.client.getLatestsStoreLogs({
      id: params.pipeline,
      limit: BigInt(50)
    }).then((res => {
      setLatestLogs(res.logs)
    })).catch((err) => {
      console.error(err)
    })
  }, 2000, { autoInvoke: true })

  // useEffect(() => { listenOrderbook(); }, [params]);

  return (
    <>
      {latestLogs  && (
          <LogTableSort
            data={latestLogs.map((log) => {
              return {
                ...log, 
                id: `${log.transactionHash}:${log.logIndex}`, 
                metadata: log.metadata,
                blockNumber: Number(log.blockNumber.toString()), 
                transactionIndex: Number(log.transactionIndex.toString()), 
                logIndex: Number(log.logIndex.toString()), 
                mintedAt: Number(log.mintedAt.toString()), 
              }
            })}
          />
      )}
    </>
  );
}
