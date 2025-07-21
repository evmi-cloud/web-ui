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
import classes from './abi-table.module.css';
import useClient from '../providers/client-context';
import { EvmJsonAbi } from '../clients/evm_indexer/v1/evm_indexer_pb';

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

export interface TableProps {
    data: EvmJsonAbi[]
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

function filterData(data: EvmJsonAbi[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => typeof key === 'string' && (item[key] as string).toLowerCase().includes(query))
  );
}

function sortData(
  data: EvmJsonAbi[],
  payload: { sortBy: keyof EvmJsonAbi | null; reversed: boolean; search: string }
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

export function EvmAbiTable({ data }: TableProps) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof EvmJsonAbi | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const client = useClient();

  useEffect(() => {
    setSorting('contractName');
  }, [data]);

  const setSorting = (field: keyof EvmJsonAbi) => {
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
      <Table.Td>{row.contractName}</Table.Td>
      <Table.Td>{row.content}</Table.Td>
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
              ID
            </Th>
            <Th
              sorted={sortBy === 'contractName'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('contractName')}
            >
              Contract name
            </Th>
            <Th
              sorted={sortBy === 'content'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('content')}
            >
              Content
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
