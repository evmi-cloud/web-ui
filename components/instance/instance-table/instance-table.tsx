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
import classes from './instance-table.module.css';
import useClient from '../../providers/client-context';
import { EvmiInstance } from '../../clients/evm_indexer/v1/evm_indexer_pb';
import { EvmiInstanceDeletionModal } from '../instance-deletion-modal/instance-deletion-modal';
import { EvmiInstanceEditionModal } from '../instance-edition-modal/instance-edition-modal';
import { EvmiInstanceCreationModal } from '../instance-creation-modal/instance-creation-modal';

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
  
}

export interface TableProps {
    data: EvmiInstance[]
    refetch?: () => void;
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

function filterData(data: EvmiInstance[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => typeof key === 'string' && (item[key].toString() ?? '').toLowerCase().includes(query))
  );
}

function sortData(
  data: EvmiInstance[],
  payload: { sortBy: keyof EvmiInstance | null; reversed: boolean; search: string }
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

export function EvmiInstanceTable({ data, refetch }: TableProps) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof EvmiInstance | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    setSorting('instanceId');
  }, [data]);

  const setSorting = (field: keyof EvmiInstance) => {
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

  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.id}</Table.Td>
      <Table.Td>{row.instanceId.toString()}</Table.Td>
      <Table.Td>{row.ipv4}</Table.Td>
      <Table.Td>{row.status}</Table.Td>
      <Table.Td>
        <Group justify="center">
          <EvmiInstanceEditionModal onClose={refetch} instance={row}/>
          <EvmiInstanceDeletionModal onClose={refetch} instance={row}/>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

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
          <EvmiInstanceCreationModal onClose={refetch} />
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
              sorted={sortBy === 'instanceId'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('instanceId')}
            >
              Instance ID
            </Th>
            <Th
              sorted={sortBy === 'ipv4'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('ipv4')}
            >
              IPv4
            </Th>
            <Th
              sorted={sortBy === 'status'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('status')}
            >
              Status
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
              <Table.Td colSpan={5}>
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