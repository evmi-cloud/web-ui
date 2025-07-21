import { useEffect, useState } from 'react';
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
  Button,
  Anchor,
  Checkbox,
  Container,
  Modal,
  PasswordInput,
  NumberInput,
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch, IconPlayerStop, IconPlayerPlay } from '@tabler/icons-react';
import classes from './blockchain-table.module.css';
import useClient from '../providers/client-context';
import { EvmBlockchain } from '../clients/evm_indexer/v1/evm_indexer_pb';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export function BlockchainsCreationModal() {

  const client = useClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      rpcUrl: '',
      blockRange: 10000,
      blockSlice: 10,
      pullInterval: 5,
      rpcMaxBatchSize: 1,
    },

    validate: {
      
    },
  });

  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);

  const onSubmit = (
    values: {
      chainId: number;
      name: string;
      rpcUrl: string;
      blockRange: number;
      blockSlice: number;
      pullInterval: number;
      rpcMaxBatchSize: number;
    }
  ) => {
    client.client.createEvmBlockchain({ blockchain: {
      chainId: BigInt(values.chainId), 
      name: values.name, 
      rpcUrl: values.rpcUrl, 
      blockRange: BigInt(values.blockRange), 
      blockSlice: BigInt(values.blockSlice), 
      pullInterval: BigInt(values.pullInterval), 
      rpcMaxBatchSize: BigInt(values.rpcMaxBatchSize), 
    }}).then(() => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'Blockchain created',
        message: 'Blockchain entry has been successfully created',
      })
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'Blockchain creation failed',
        message: error,
      })
    })
  }

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Create Blockchain" size={640}>
        <Container>
          <form onSubmit={form.onSubmit(onSubmit)}>
            <NumberInput
              withAsterisk
              label="Chain ID"
              placeholder="Enter 1 for Ethereum chain"
              key={form.key('chainId')}
              {...form.getInputProps('chainId')}
            />
            
            <TextInput
              withAsterisk
              label="Name"
              placeholder="Chain name"
              key={form.key('name')}
              {...form.getInputProps('name')}
            />

            <TextInput
              withAsterisk
              label="RPC Url"
              placeholder="Enter RPC url"
              key={form.key('rpcUrl')}
              {...form.getInputProps('rpcUrl')}
            />

            <NumberInput
              withAsterisk
              label="Block range"
              placeholder="Let the default value if you don't know what is it"
              key={form.key('blockRange')}
              {...form.getInputProps('blockRange')}
            />

            <NumberInput
              withAsterisk
              label="Block slice"
              placeholder="Let the default value if you don't know what is it"
              key={form.key('blockSlice')}
              {...form.getInputProps('blockSlice')}
            />

            <NumberInput
              withAsterisk
              label="Pull interval"
              placeholder="Let the default value if you don't know what is it"
              key={form.key('pullInterval')}
              {...form.getInputProps('pullInterval')}
            />

            <NumberInput
              withAsterisk
              label="Max batch size supported by the RPC"
              placeholder="Let the default value if you don't know what is it"
              key={form.key('rpcMaxBatchSize')}
              {...form.getInputProps('rpcMaxBatchSize')}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Container>
      </Modal>

      <Button onClick={openCreateModal}>Create blockchain</Button>
    </>
  );
}
