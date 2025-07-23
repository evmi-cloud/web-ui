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
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { EvmJsonAbi } from '../../clients/evm_indexer/v1/evm_indexer_pb';
import { useForm } from '@mantine/form';

export function EvmAbiEditionModal({ 
  abi,
  onClose
}: { 
  abi: EvmJsonAbi
  onClose?: () => void,
}) {

  const client = useClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: abi,
    validate: {
      
    },
  });

  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);

  const onSubmit = (
    values: EvmJsonAbi
  ) => {
    client.client.updateEvmJsonAbi({ abi: values }).then(() => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'ABI edited',
        message: 'ABI entry has been successfully updated',
      })
      onClose()
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'red',
        title: 'ABI update failed',
        message: error,
      })
    })
  }

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Edit ABI" size={640}>
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

      <Button leftSection={<IconEdit size={14} />} variant="default" onClick={openCreateModal}>
        Edit
      </Button>
    </>
  );
}


