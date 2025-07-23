'use client';

import { useEffect, useState } from 'react';
import { useDisclosure, useInterval } from '@mantine/hooks';
import { Anchor, Button, Checkbox, Container, Group, Modal, Paper, PasswordInput, TextInput, Title, Text } from '@mantine/core';
import useClient from '../../components/providers/client-context';
import { EvmBlockchain, EvmJsonAbi } from '../../components/clients/evm_indexer/v1/evm_indexer_pb';
import { BlockchainsCreationModal } from '../../components/blockchain-creation-modal/blockchain-creation-modal';
import { EvmAbiTable } from '../../components/abi/abi-table/abi-table';

export default function AbisPage() {
  const [abis, setAbis] = useState<EvmJsonAbi[]>([]);
  const client = useClient();

  useEffect(() => {
    client.client.listEvmJsonAbis({ 
      pagination: { limit: 50, offset: 0 }
    }).then((res) => {
      setAbis(res.abis);
    })
    .catch((error) => console.error(error));
  }, []);

  const refetch = () => {
    client.client.listEvmJsonAbis({ 
      pagination: { limit: 50, offset: 0 }
    }).then((res) => {
      setAbis(res.abis);
    })
    .catch((error) => console.error(error));
  }

  return (
    <EvmAbiTable data={abis} refetch={refetch} />
  );
}
