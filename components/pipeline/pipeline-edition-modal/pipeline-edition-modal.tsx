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
import { EvmLogPipeline } from '../../clients/evm_indexer/v1/evm_indexer_pb';
import { useForm } from '@mantine/form';

export function EvmLogPipelineEditionModal({ 
  pipeline,
  onClose
}: { 
  pipeline: EvmLogPipeline
  onClose?: () => void,
}) {

  const client = useClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      ...pipeline,
      evmiInstanceId: pipeline.evmiInstanceId.toString(),
      evmBlockchainId: pipeline.evmBlockchainId.toString(),
      evmLogStoreId: pipeline.evmLogStoreId.toString(),
    },
    validate: {
      
    },
  });

  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);

  const onSubmit = (
    values: typeof pipeline & {
      evmiInstanceId: string;
      evmBlockchainId: string;
      evmLogStoreId: string;
    }
  ) => {
    const updatedPipeline = {
      ...values,
      evmiInstanceId: parseInt(values.evmiInstanceId),
      evmBlockchainId: parseInt(values.evmBlockchainId),
      evmLogStoreId: parseInt(values.evmLogStoreId),
    };
    
    client.client.updateEvmLogPipeline({ pipeline: updatedPipeline }).then(() => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'Pipeline edited',
        message: 'Pipeline entry has been successfully updated',
      })
      onClose()
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'red',
        title: 'Pipeline update failed',
        message: error,
      })
    })
  }

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Edit Pipeline" size={640}>
        <Container>
        <form onSubmit={form.onSubmit(onSubmit)}>            
            <TextInput
              withAsterisk
              label="Name"
              placeholder="Pipeline name"
              key={form.key('name')}
              {...form.getInputProps('name')}
            />

            <TextInput
              withAsterisk
              label="Type"
              placeholder="Pipeline type"
              key={form.key('type')}
              {...form.getInputProps('type')}
            />

            <TextInput
              withAsterisk
              label="Instance ID"
              placeholder="EVMI Instance ID"
              key={form.key('evmiInstanceId')}
              {...form.getInputProps('evmiInstanceId')}
            />

            <TextInput
              withAsterisk
              label="Blockchain ID"
              placeholder="EVM Blockchain ID"
              key={form.key('evmBlockchainId')}
              {...form.getInputProps('evmBlockchainId')}
            />

            <TextInput
              withAsterisk
              label="Store ID"
              placeholder="EVM Log Store ID"
              key={form.key('evmLogStoreId')}
              {...form.getInputProps('evmLogStoreId')}
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