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
import { EvmLogStore } from '../../clients/evm_indexer/v1/evm_indexer_pb';

export function EvmLogStoreDeletionModal({ 
  store,
  onClose
}: { 
  store: EvmLogStore
  onClose?: () => void,
}) {

  const client = useClient();
  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);

  const deleteStore = () => {
    client.client.deleteEvmLogStore({ id: store.id }).then(() => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'Store deleted',
        message: 'Store entry has been successfully deleted',
      })

      onClose()
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'red',
        title: 'Store deletion failed',
        message: error,
      })
    })
  }

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Delete Store" size={640}>
        <Container>
            <p>Are you sure you want delete store "{store.identifier}" ?</p>

            <Group justify="flex-end" mt="md">
              <Button leftSection={<IconTrash size={14} />} variant="default" onClick={deleteStore}>
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