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
import classes from './store-table.module.css';
import useClient from '../../providers/client-context';
import { EvmLogStore } from '../../clients/evm_indexer/v1/evm_indexer_pb';
import { EvmLogStoreDeletionModal } from '../store-deletion-modal/store-deletion-modal';
import { EvmLogStoreEditionModal } from '../store-edition-modal/store-edition-modal';
import { EvmLogStoreCreationModal } from '../store-creation-modal/store-creation-modal';

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
  
}

export interface TableProps {
    data: EvmLogStore[]
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

function filterData(data: EvmLogStore[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => typeof key === 'string' && (item[key].toString() ?? '').toLowerCase().includes(query))
  );
}

function sortData(
  data: EvmLogStore[],
  payload: { sortBy: keyof EvmLogStore | null; reversed: boolean; search: string }
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

export function EvmLogStoreTable({ data, refetch }: TableProps) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof EvmLogStore | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  useEffect(() => {
    setSorting('identifier');
  }, [data]);

  const setSorting = (field: keyof EvmLogStore) => {
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
      <Table.Td>{row.identifier}</Table.Td>
      <Table.Td>{row.description}</Table.Td>
      <Table.Td>{row.storeType}</Table.Td>
      <Table.Td style={{ maxWidth: '200px' }}>
        <Text truncate>{row.storeConfigJson}</Text>
      </Table.Td>
      <Table.Td>
        <Group justify="center">
          <EvmLogStoreEditionModal onClose={refetch} store={row}/>
          <EvmLogStoreDeletionModal onClose={refetch} store={row}/>
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
          <EvmLogStoreCreationModal onClose={refetch} />
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
              sorted={sortBy === 'identifier'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('identifier')}
            >
              Identifier
            </Th>
            <Th
              sorted={sortBy === 'description'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('description')}
            >
              Description
            </Th>
            <Th
              sorted={sortBy === 'storeType'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('storeType')}
            >
              Store Type
            </Th>
            <Th
              sorted={sortBy === 'storeConfigJson'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('storeConfigJson')}
            >
              Config JSON
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
              <Table.Td colSpan={6}>
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