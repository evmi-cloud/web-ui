import {
  Group,
  Button,
  Container,
  Modal,
} from '@mantine/core';
import useClient from '../../providers/client-context';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons-react';
import { EvmiInstance } from '../../clients/evm_indexer/v1/evm_indexer_pb';

export function EvmiInstanceDeletionModal({ 
  instance,
  onClose
}: { 
  instance: EvmiInstance
  onClose?: () => void,
}) {

  const client = useClient();
  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);

  const deleteInstance = () => {
    client.client.deleteEvmiInstance({ id: instance.id }).then(() => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'Instance deleted',
        message: 'Instance entry has been successfully deleted',
      })

      onClose()
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'red',
        title: 'Instance deletion failed',
        message: error,
      })
    })
  }

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Delete Instance" size={640}>
        <Container>
            <p>Are you sure you want delete instance {instance.instanceId.toString()} ?</p>

            <Group justify="flex-end" mt="md">
              <Button leftSection={<IconTrash size={14} />} variant="default" onClick={deleteInstance}>
                Delete
              </Button>
            </Group>
        </Container>
      </Modal>

      <Button leftSection={<IconTrash size={14} />} variant="default" onClick={openCreateModal}>
        Delete
      </Button>
    </>
  );
}