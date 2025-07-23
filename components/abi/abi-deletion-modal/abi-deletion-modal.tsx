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
import { IconTrash } from '@tabler/icons-react';
import { EvmJsonAbi } from '../../clients/evm_indexer/v1/evm_indexer_pb';

export function EvmAbiDeletionModal({ 
  abi,
  onClose
}: { 
  abi: EvmJsonAbi
  onClose?: () => void,
}) {

  const client = useClient();
  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);

  const deleteAbi = () => {
    client.client.deleteEvmJsonAbi({ id: abi.id }).then(() => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'ABI created',
        message: 'ABI entry has been successfully deleted',
      })

      onClose()
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'ABI deletion failed',
        message: error,
      })
    })
  }

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Create ABI" size={640}>
        <Container>
            <p>Are you sure you want delete {abi.contractName} ABI ?</p>

            <Group justify="flex-end" mt="md">
              <Button leftSection={<IconTrash size={14} />} variant="default" onClick={deleteAbi}>
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
