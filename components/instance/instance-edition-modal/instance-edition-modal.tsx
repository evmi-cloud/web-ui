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
import { EvmiInstance } from '../../clients/evm_indexer/v1/evm_indexer_pb';
import { useForm } from '@mantine/form';

export function EvmiInstanceEditionModal({ 
  instance,
  onClose
}: { 
  instance: EvmiInstance
  onClose?: () => void,
}) {

  const client = useClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      ...instance,
      instanceId: instance.instanceId.toString(),
    },
    validate: {
      
    },
  });

  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);

  const onSubmit = (
    values: typeof instance & {
      instanceId: string;
    }
  ) => {
    const updatedInstance = {
      ...values,
      instanceId: BigInt(values.instanceId),
    };
    
    client.client.updateEvmiInstance({ instance: updatedInstance }).then(() => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'Instance edited',
        message: 'Instance entry has been successfully updated',
      })
      onClose()
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'red',
        title: 'Instance update failed',
        message: error,
      })
    })
  }

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Edit Instance" size={640}>
        <Container>
        <form onSubmit={form.onSubmit(onSubmit)}>            
            <TextInput
              withAsterisk
              label="Instance ID"
              placeholder="Instance ID"
              key={form.key('instanceId')}
              {...form.getInputProps('instanceId')}
            />

            <TextInput
              withAsterisk
              label="IPv4"
              placeholder="IPv4 Address"
              key={form.key('ipv4')}
              {...form.getInputProps('ipv4')}
            />

            <TextInput
              withAsterisk
              label="Status"
              placeholder="Status"
              key={form.key('status')}
              {...form.getInputProps('status')}
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