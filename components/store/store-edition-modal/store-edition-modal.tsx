import {
  Group,
  TextInput,
  Button,
  Container,
  Modal,
  Textarea,
} from '@mantine/core';
import useClient from '../../providers/client-context';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconEdit } from '@tabler/icons-react';
import { EvmLogStore } from '../../clients/evm_indexer/v1/evm_indexer_pb';
import { useForm } from '@mantine/form';

export function EvmLogStoreEditionModal({ 
  store,
  onClose
}: { 
  store: EvmLogStore
  onClose?: () => void,
}) {

  const client = useClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: store,
    validate: {
      
    },
  });

  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);

  const onSubmit = (
    values: EvmLogStore
  ) => {
    client.client.updateEvmLogStore({ store: values }).then(() => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'Store edited',
        message: 'Store entry has been successfully updated',
      })
      onClose()
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'red',
        title: 'Store update failed',
        message: error,
      })
    })
  }

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Edit Store" size={640}>
        <Container>
        <form onSubmit={form.onSubmit(onSubmit)}>            
            <TextInput
              withAsterisk
              label="Identifier"
              placeholder="Store identifier"
              key={form.key('identifier')}
              {...form.getInputProps('identifier')}
            />

            <TextInput
              withAsterisk
              label="Description"
              placeholder="Store description"
              key={form.key('description')}
              {...form.getInputProps('description')}
            />

            <TextInput
              withAsterisk
              label="Store Type"
              placeholder="Store type"
              key={form.key('storeType')}
              {...form.getInputProps('storeType')}
            />

            <Textarea
              withAsterisk
              label="Config JSON"
              placeholder="Enter store configuration JSON"
              key={form.key('storeConfigJson')}
              {...form.getInputProps('storeConfigJson')}
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