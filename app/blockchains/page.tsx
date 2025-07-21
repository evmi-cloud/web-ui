'use client';

import { useEffect, useState } from 'react';
import { useDisclosure, useInterval } from '@mantine/hooks';
import { Anchor, Button, Checkbox, Container, Group, Modal, Paper, PasswordInput, TextInput, Title, Text } from '@mantine/core';
import useClient from '../../components/providers/client-context';
import { BlockchainsTable } from '../../components/blockchain-table/blockchain-table';
import { EvmBlockchain } from '../../components/clients/evm_indexer/v1/evm_indexer_pb';
import { BlockchainsCreationModal } from '../../components/blockchain-creation-modal/blockchain-creation-modal';

export default function BlockchainsPage() {
  const [blockchains, setBlockchains] = useState<EvmBlockchain[]>([]);
  const client = useClient();

  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);

  useEffect(() => {
    client.client.listEvmBlockchains({ 
      pagination: { limit: 50, offset: 0 }
    }).then((res) => {
      setBlockchains(res.blockchains);
    })
    .catch((error) => console.error(error));
  }, []);

  return (
    <>
      <BlockchainsCreationModal />
      <BlockchainsTable data={blockchains} />
    </>
  );
}
