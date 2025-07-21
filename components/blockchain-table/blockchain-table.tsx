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
} from '@mantine/core';
import { IconSelector, IconChevronDown, IconChevronUp, IconSearch, IconPlayerStop, IconPlayerPlay } from '@tabler/icons-react';
import classes from './blockchain-table.module.css';
import useClient from '../providers/client-context';
import { EvmBlockchain } from '../clients/evm_indexer/v1/evm_indexer_pb';

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

export interface TableProps {
    data: EvmBlockchain[]
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

function filterData(data: EvmBlockchain[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => typeof item[key] === 'string' && (item[key] as string ?? '').toLowerCase().includes(query))
  );
}

function sortData(
  data: EvmBlockchain[],
  payload: { sortBy: keyof EvmBlockchain | null; reversed: boolean; search: string }
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

export function BlockchainsTable({ data }: TableProps) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof EvmBlockchain | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const client = useClient();

  useEffect(() => {
    setSorting('chainId');
  }, [data]);

  const setSorting = (field: keyof EvmBlockchain) => {
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
  console.log(sortedData)
  const rows = sortedData.map((row) => (
    <Table.Tr key={row.id}>
      <Table.Td>{row.chainId.toString()}</Table.Td>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.rpcUrl}</Table.Td>
      <Table.Td>{row.blockRange.toString()}</Table.Td>
      <Table.Td>{row.blockSlice.toString()}</Table.Td>
      <Table.Td>{row.pullInterval.toString()}</Table.Td>
      <Table.Td>{row.rpcMaxBatchSize.toString()}</Table.Td>
      <Table.Td>
        <Group justify="center">
            <Button leftSection={<IconPlayerPlay size={14} />} variant="default">
              Edit
            </Button>
            <Button leftSection={<IconPlayerPlay size={14} />} variant="default">
              Delete
            </Button>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        mb="md"
        leftSection={<IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table horizontalSpacing="md" verticalSpacing="xs" miw={700} layout="fixed">
        <Table.Tbody>
          <Table.Tr>
            <Th
              sorted={sortBy === 'id'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('id')}
            >
              Chain ID
            </Th>
            <Th
              sorted={sortBy === 'name'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('name')}
            >
              Name
            </Th>
            <Th
              sorted={sortBy === 'rpcUrl'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('rpcUrl')}
            >
              Rpc Url
            </Th>
            <Th
              sorted={sortBy === 'blockRange'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('blockRange')}
            >
              Block Range
            </Th>
            <Th
              sorted={sortBy === 'blockSlice'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('blockSlice')}
            >
              Block Slice
            </Th>
            <Th
              sorted={sortBy === 'pullInterval'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('pullInterval')}
            >
              Pull Interval
            </Th>
            <Th
              sorted={sortBy === 'rpcMaxBatchSize'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('rpcMaxBatchSize')}
            >
              Max batch size
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
              <Table.Td colSpan={3}>
                <Text fw={500} ta="center">
                  Nothing found
                </Text>
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </ScrollArea>
  );
}
