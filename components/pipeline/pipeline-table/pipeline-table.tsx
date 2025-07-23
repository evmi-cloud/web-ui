import { useEffect, useState } from 'react';
import {
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  rem,
  keys,
  Button,
  Grid,
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch, IconPlayerStop, IconPlayerPlay } from '@tabler/icons-react';
import classes from './pipeline-table.module.css';
import useClient from '../../providers/client-context';
import { EvmLogPipeline } from '../../clients/evm_indexer/v1/evm_indexer_pb';
import { EvmLogPipelineDeletionModal } from '../pipeline-deletion-modal/pipeline-deletion-modal';
import { EvmLogPipelineEditionModal } from '../pipeline-edition-modal/pipeline-edition-modal';
import { EvmLogPipelineCreationModal } from '../pipeline-creation-modal/pipeline-creation-modal';
import { notifications } from '@mantine/notifications';

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
  
}

export interface TableProps {
    data: EvmLogPipeline[]
    refetch?: () => void;
    runningPipelines?: Set<number>;
}

function Th({ children, reversed, sorted, onSort }: ThProps) {
  const Icon = sorted ? (reversed ? IconChevronUp : IconChevronDown) : IconSelector;
  return (
    <Table.Th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group justify="space-between">
          <Text fw={500} fz="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            <Icon style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          </Center>
        </Group>
      </UnstyledButton>
    </Table.Th>
  );
}

function filterData(data: EvmLogPipeline[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => typeof key === 'string' && (item[key].toString() ?? '').toLowerCase().includes(query))
  );
}

function sortData(
  data: EvmLogPipeline[],
  payload: { sortBy: keyof EvmLogPipeline | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return (b[sortBy] as string).localeCompare((a[sortBy] as string));
      }

      return (a[sortBy] as string).localeCompare((b[sortBy] as string));
    }),
    payload.search
  );
}

export function EvmLogPipelineTable({ data, refetch, runningPipelines = new Set() }: TableProps) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof EvmLogPipeline | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);
  const [loadingPipelines, setLoadingPipelines] = useState(new Set<number>());

  const client = useClient();

  useEffect(() => {
    setSorting('name');
  }, [data]);

  const setSorting = (field: keyof EvmLogPipeline) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const handleStartPipeline = async (pipelineId: number) => {
    setLoadingPipelines(prev => new Set(prev).add(pipelineId));
    
    try {
      const response = await client.client.startPipeline({ id: pipelineId });
      
      if (response.success) {
        notifications.show({
          position: 'top-right',
          autoClose: 5000,
          color: 'green',
          title: 'Pipeline started',
          message: 'Pipeline has been successfully started',
        });
        refetch?.();
      } else {
        notifications.show({
          position: 'top-right',
          autoClose: 5000,
          color: 'red',
          title: 'Pipeline start failed',
          message: response.error || 'Failed to start pipeline',
        });
      }
    } catch (error) {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'red',
        title: 'Pipeline start failed',
        message: String(error),
      });
    } finally {
      setLoadingPipelines(prev => {
        const newSet = new Set(prev);
        newSet.delete(pipelineId);
        return newSet;
      });
    }
  };

  const handleStopPipeline = async (pipelineId: number) => {
    setLoadingPipelines(prev => new Set(prev).add(pipelineId));
    
    try {
      const response = await client.client.stopPipeline({ id: pipelineId });
      
      if (response.success) {
        notifications.show({
          position: 'top-right',
          autoClose: 5000,
          color: 'green',
          title: 'Pipeline stopped',
          message: 'Pipeline has been successfully stopped',
        });
        refetch?.();
      } else {
        notifications.show({
          position: 'top-right',
          autoClose: 5000,
          color: 'red',
          title: 'Pipeline stop failed',
          message: response.error || 'Failed to stop pipeline',
        });
      }
    } catch (error) {
      notifications.show({
        position: 'top-right',
        autoClose: 5000,
        color: 'red',
        title: 'Pipeline stop failed',
        message: String(error),
      });
    } finally {
      setLoadingPipelines(prev => {
        const newSet = new Set(prev);
        newSet.delete(pipelineId);
        return newSet;
      });
    }
  };

  const rows = sortedData.map((row) => {
    const isRunning = runningPipelines.has(row.id);
    const isLoading = loadingPipelines.has(row.id);

    return (
      <Table.Tr key={row.id}>
        <Table.Td>{row.id}</Table.Td>
        <Table.Td>{row.name}</Table.Td>
        <Table.Td>{row.type}</Table.Td>
        <Table.Td>{row.evmiInstanceId}</Table.Td>
        <Table.Td>{row.evmBlockchainId}</Table.Td>
        <Table.Td>{row.evmLogStoreId}</Table.Td>
        <Table.Td>
          <Group justify="center">
            {isRunning ? (
              <Button
                leftSection={<IconPlayerStop size={14} />}
                variant="filled"
                color="red"
                size="xs"
                onClick={() => handleStopPipeline(row.id)}
                loading={isLoading}
              >
                Stop
              </Button>
            ) : (
              <Button
                leftSection={<IconPlayerPlay size={14} />}
                variant="filled"
                color="green"
                size="xs"
                onClick={() => handleStartPipeline(row.id)}
                loading={isLoading}
              >
                Start
              </Button>
            )}
            <EvmLogPipelineEditionModal onClose={refetch} pipeline={row}/>
            <EvmLogPipelineDeletionModal onClose={refetch} pipeline={row}/>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <>
      <Grid ml="md">
        <Grid.Col span={10}>
          <TextInput
            placeholder="Search by any field"
            leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
            value={search}
            onChange={handleSearchChange}
          />
        </Grid.Col>
        <Grid.Col span={1}>
          <EvmLogPipelineCreationModal onClose={refetch} />
        </Grid.Col>
      </Grid>        
      <Table horizontalSpacing="md" mt="md" verticalSpacing="xs" width={'100%'} layout="fixed">
        <Table.Tbody>
          <Table.Tr>
            <Th
              sorted={sortBy === 'id'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('id')}
            >
              ID
            </Th>
            <Th
              sorted={sortBy === 'name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('name')}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === 'type'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('type')}
            >
              Type
            </Th>
            <Th
              sorted={sortBy === 'evmiInstanceId'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('evmiInstanceId')}
            >
              Instance ID
            </Th>
            <Th
              sorted={sortBy === 'evmBlockchainId'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('evmBlockchainId')}
            >
              Blockchain ID
            </Th>
            <Th
              sorted={sortBy === 'evmLogStoreId'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('evmLogStoreId')}
            >
              Store ID
            </Th>
            <Table.Th className={classes.th}>
                Actions
            </Table.Th>
          </Table.Tr>
        </Table.Tbody>
        <Table.Tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <Table.Tr>
              <Table.Td colSpan={7}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </>
  );
}