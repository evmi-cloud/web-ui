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
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export function EvmLogStoreCreationModal({ 
  onClose
}: { 
  onClose?: () => void,
}) {

  const client = useClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      identifier: '',
      description: '',
      storeType: '',
      storeConfigJson: '',
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
      identifier: string;
      description: string;
      storeType: string;
      storeConfigJson: string;
    }
  ) => {
    client.client.createEvmLogStore({ store: {
      identifier: values.identifier,
      description: values.description,
      storeType: values.storeType,
      storeConfigJson: values.storeConfigJson,
    }}).then(() => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'Store created',
        message: 'Store entry has been successfully created',
      })
      onClose()
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'red',
        title: 'Store creation failed',
        message: error,
      })
    })
  }

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Create Store" size={640}>
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

      <Button onClick={openCreateModal}>Create Store</Button>
    </>
  );
}