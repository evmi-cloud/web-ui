'use client';

import { useEffect, useState } from 'react';
import { useDisclosure, useInterval } from '@mantine/hooks';
import { Anchor, Button, Checkbox, Container, Group, Modal, Paper, PasswordInput, TextInput, Title, Text } from '@mantine/core';
import useClient from '../../components/providers/client-context';
import { PipelineProps, TableSort } from '../../components/pipeline-table/pipeline-table';

export default function MarketsPage() {
    const [pipelines, setPipelines] = useState<PipelineProps[]>([]);
    const client = useClient();

    const [
      createModalOpened,
      { open: openCreateModal, close: closeCreateModal },
    ] = useDisclosure(false);

    useEffect(() => {
        client.client.getStores({})
            .then((res) => {
                setPipelines(res.stores.map((m) => ({
                        id: m.id,
                        identifier: m.identifier,
                        description: m.description,
                        rpc: m.rpcUrl,
                        status: m.status,
                        sources: m.sources,
                    })));
            })
            .catch((error) => console.error(error));
    }, []);

    useInterval(() => {
      client.client.getStores({})
            .then((res) => {
                setPipelines(res.stores.map((m) => ({
                        id: m.id,
                        identifier: m.identifier,
                        description: m.description,
                        rpc: m.rpcUrl,
                        status: m.status,
                        sources: m.sources,
                    })));
            })
            .catch((error) => console.error(error));
    }, 5000, { autoInvoke: true });

  return (
    <>
      <Modal opened={createModalOpened} onClose={closeCreateModal} title="Create pipeline" size={640}>
        <Container>
          <TextInput label="Name" placeholder="you@mantine.dev" required />
          <TextInput label="Description" placeholder="you@mantine.dev" required mt="md"/>
          <PasswordInput label="Password" placeholder="Your password" required mt="md" />
          <Group justify="space-between" mt="lg">
            <Checkbox label="Remember me" />
            <Anchor component="button" size="sm">
              Forgot password?
            </Anchor>
          </Group>
          <Button fullWidth mt="xl">
            Create
          </Button>
        </Container>
      </Modal>

      <Button onClick={openCreateModal}>Create pipeline</Button>
      <TableSort data={pipelines} />
    </>
  );
}
