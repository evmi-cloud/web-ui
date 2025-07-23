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

export function EvmLogPipelineCreationModal({ 
  onClose
}: { 
  onClose?: () => void,
}) {

  const client = useClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      type: '',
      evmiInstanceId: '',
      evmBlockchainId: '',
      evmLogStoreId: '',
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
      type: string;
      evmiInstanceId: string;
      evmBlockchainId: string;
      evmLogStoreId: string;
    }
  ) => {
    client.client.createEvmLogPipeline({ pipeline: {
      name: values.name,
      type: values.type,
      evmiInstanceId: parseInt(values.evmiInstanceId),
      evmBlockchainId: parseInt(values.evmBlockchainId),
      evmLogStoreId: parseInt(values.evmLogStoreId),
    }}).then(() => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'Pipeline created',
        message: 'Pipeline entry has been successfully created',
      })
      onClose()
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'red',
        title: 'Pipeline creation failed',
        message: error,
      })
    })
  }

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Create Pipeline" size={640}>
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

      <Button onClick={openCreateModal}>Create Pipeline</Button>
    </>
  );
}