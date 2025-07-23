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

export function EvmAbiCreationModal({ 
  onClose
}: { 
  onClose?: () => void,
}) {

  const client = useClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      contractName: '',
      content: '',
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
      contractName: string;
      content: string;
    }
  ) => {
    client.client.createEvmJsonAbi({ abi: {
      contractName: values.contractName,
      content: values.content,
    }}).then(() => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'ABI created',
        message: 'ABI entry has been successfully created',
      })
      onClose()
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'ABI creation failed',
        message: error,
      })
    })
  }

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Create ABI" size={640}>
        <Container>
          <form onSubmit={form.onSubmit(onSubmit)}>            
            <TextInput
              withAsterisk
              label="Contract name"
              placeholder="Contract name"
              key={form.key('contractName')}
              {...form.getInputProps('contractName')}
            />

            <Textarea
              withAsterisk
              label="ABI"
              placeholder="Enter ABI"
              key={form.key('content')}
              {...form.getInputProps('content')}
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Container>
      </Modal>

      <Button onClick={openCreateModal}>Create ABI</Button>
    </>
  );
}
