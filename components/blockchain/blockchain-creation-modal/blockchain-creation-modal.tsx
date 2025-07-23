import {
  Group,
  TextInput,
  Button,
  Container,
  Modal,
  NumberInput,
} from '@mantine/core';
import useClient from '../../providers/client-context';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export function EvmBlockchainCreationModal({ 
  onClose
}: { 
  onClose?: () => void,
}) {

  const client = useClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      chainId: '',
      rpcUrl: '',
      blockRange: '',
      blockSlice: '',
      pullInterval: '',
      rpcMaxBatchSize: '',
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
      name: string;
      chainId: string;
      rpcUrl: string;
      blockRange: string;
      blockSlice: string;
      pullInterval: string;
      rpcMaxBatchSize: string;
    }
  ) => {
    client.client.createEvmBlockchain({ blockchain: {
      name: values.name,
      chainId: BigInt(values.chainId),
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
      onClose()
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'red',
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

      <Button onClick={openCreateModal}>Create Blockchain</Button>
    </>
  );
}