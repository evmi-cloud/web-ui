import {
  Group,
  TextInput,
  Button,
  Container,
  Modal,
} from '@mantine/core';
import useClient from '../../providers/client-context';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconEdit } from '@tabler/icons-react';
import { EvmBlockchain } from '../../clients/evm_indexer/v1/evm_indexer_pb';
import { useForm } from '@mantine/form';

export function EvmBlockchainEditionModal({ 
  blockchain,
  onClose
}: { 
  blockchain: EvmBlockchain
  onClose?: () => void,
}) {

  const client = useClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      ...blockchain,
      chainId: blockchain.chainId.toString(),
      blockRange: blockchain.blockRange.toString(),
      blockSlice: blockchain.blockSlice.toString(),
      pullInterval: blockchain.pullInterval.toString(),
      rpcMaxBatchSize: blockchain.rpcMaxBatchSize.toString(),
    },
    validate: {
      
    },
  });

  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);

  const onSubmit = (
    values: typeof blockchain & {
      chainId: string;
      blockRange: string;
      blockSlice: string;
      pullInterval: string;
      rpcMaxBatchSize: string;
    }
  ) => {
    const updatedBlockchain = {
      ...values,
      chainId: BigInt(values.chainId),
      blockRange: BigInt(values.blockRange),
      blockSlice: BigInt(values.blockSlice),
      pullInterval: BigInt(values.pullInterval),
      rpcMaxBatchSize: BigInt(values.rpcMaxBatchSize),
    };
    
    client.client.updateEvmBlockchain({ blockchain: updatedBlockchain }).then(() => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'Blockchain edited',
        message: 'Blockchain entry has been successfully updated',
      })
      onClose()
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'red',
        title: 'Blockchain update failed',
        message: error,
      })
    })
  }

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Edit Blockchain" size={640}>
        <Container>
        <form onSubmit={form.onSubmit(onSubmit)}>            
            <TextInput
              withAsterisk
              label="Name"
              placeholder="Blockchain name"
              key={form.key('name')}
              {...form.getInputProps('name')}
            />

            <TextInput
              withAsterisk
              label="Chain ID"
              placeholder="Chain ID"
              key={form.key('chainId')}
              {...form.getInputProps('chainId')}
            />

            <TextInput
              withAsterisk
              label="RPC URL"
              placeholder="RPC URL"
              key={form.key('rpcUrl')}
              {...form.getInputProps('rpcUrl')}
            />

            <TextInput
              withAsterisk
              label="Block Range"
              placeholder="Block Range"
              key={form.key('blockRange')}
              {...form.getInputProps('blockRange')}
            />

            <TextInput
              withAsterisk
              label="Block Slice"
              placeholder="Block Slice"
              key={form.key('blockSlice')}
              {...form.getInputProps('blockSlice')}
            />

            <TextInput
              withAsterisk
              label="Pull Interval"
              placeholder="Pull Interval"
              key={form.key('pullInterval')}
              {...form.getInputProps('pullInterval')}
            />

            <TextInput
              withAsterisk
              label="RPC Max Batch Size"
              placeholder="RPC Max Batch Size"
              key={form.key('rpcMaxBatchSize')}
              {...form.getInputProps('rpcMaxBatchSize')}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Container>
      </Modal>

      <Button leftSection={<IconEdit size={14} />} variant="default" onClick={openCreateModal}>
        Edit
      </Button>
    </>
  );
}