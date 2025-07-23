import {
  Group,
  TextInput,
  Button,
  Container,
  Modal,
} from '@mantine/core';
import useClient from '../../providers/client-context';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export function EvmiInstanceCreationModal({ 
  onClose
}: { 
  onClose?: () => void,
}) {

  const client = useClient();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      instanceId: '',
      ipv4: '',
      status: '',
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
      instanceId: string;
      ipv4: string;
      status: string;
    }
  ) => {
    client.client.createEvmiInstance({ instance: {
      instanceId: BigInt(values.instanceId),
      ipv4: values.ipv4,
      status: values.status,
    }}).then(() => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'Instance created',
        message: 'Instance entry has been successfully created',
      })
      onClose()
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'red',
        title: 'Instance creation failed',
        message: error,
      })
    })
  }

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Create Instance" size={640}>
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

      <Button onClick={openCreateModal}>Create Instance</Button>
    </>
  );
}