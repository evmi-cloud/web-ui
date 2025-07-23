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
import { EvmLogPipeline } from '../../clients/evm_indexer/v1/evm_indexer_pb';

export function EvmLogPipelineDeletionModal({ 
  pipeline,
  onClose
}: { 
  pipeline: EvmLogPipeline
  onClose?: () => void,
}) {

  const client = useClient();
  const [
    createModalOpened,
    { open: openCreateModal, close: closeCreateModal },
  ] = useDisclosure(false);

  const deletePipeline = () => {
    client.client.deleteEvmLogPipeline({ id: pipeline.id }).then(() => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'green',
        title: 'Pipeline deleted',
        message: 'Pipeline entry has been successfully deleted',
      })

      onClose()
      closeCreateModal()
    }).catch((error) => {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'red',
        title: 'Pipeline deletion failed',
        message: error,
      })
    })
  }

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Delete Pipeline" size={640}>
        <Container>
            <p>Are you sure you want delete pipeline "{pipeline.name}" ?</p>

            <Group justify="flex-end" mt="md">
              <Button leftSection={<IconTrash size={14} />} variant="default" onClick={deletePipeline}>
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