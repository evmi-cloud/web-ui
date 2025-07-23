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
import { EvmBlockchain } from '../../clients/evm_indexer/v1/evm_indexer_pb';

export function EvmBlockchainDeletionModal({ 
  blockchain,
  onClose
}: { 
  blockchain: EvmBlockchain
  onClose?: () => void,
}) {

  const client = useClient();
  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);

  const deleteBlockchain = () => {
    client.client.deleteEvmBlockchain({ id: blockchain.id }).then(() => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'Blockchain deleted',
        message: 'Blockchain entry has been successfully deleted',
      })

      onClose()
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'red',
        title: 'Blockchain deletion failed',
        message: error,
      })
    })
  }

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Delete Blockchain" size={640}>
        <Container>
            <p>Are you sure you want delete {blockchain.name} blockchain ?</p>

            <Group justify="flex-end" mt="md">
              <Button leftSection={<IconTrash size={14} />} variant="default" onClick={deleteBlockchain}>
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