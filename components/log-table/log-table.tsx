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
import classes from './log-table.module.css';
import useClient from '../providers/client-context';
import { LogSource } from '../clients/evm_indexer/v1/evm_indexer_pb';

interface ThProps {
  children: React.ReactNode;
  reversed: boolean;
  sorted: boolean;
  onSort: () => void;
}

export interface LogProps {
    id: string
    address: string
    topics: string[]
    data: string
    blockNumber: number
    transactionHash: string
    transactionIndex: number
    blockHash: string
    logIndex: number,
    removed: boolean
    metadata: {
      contractName: string,
      eventName: string,
      functionName: string,
      data: {[key: string]: string}
    }
    mintedAt: number
}

export interface TableProps {
    data: LogProps[]
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

function filterData(data: LogProps[], search: string) {
  const query = search.toLowerCase().trim();
  return data.filter((item) =>
    keys(data[0]).some((key) => typeof key === 'string' && (item[key] as string).toLowerCase().includes(query))
  );
}

function sortData(
  data: LogProps[],
  payload: { sortBy: keyof LogProps | null; reversed: boolean; search: string }
) {
  const { sortBy } = payload;

  if (!sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        if (typeof a[sortBy] == 'number' && typeof b[sortBy] == 'number') {
          if(b[sortBy] > a[sortBy]) {
            return -1
          } else if(b[sortBy] < a[sortBy]) {
            return 1
          } else {
            return 0
          }
        } else {
          return (b[sortBy] as string).localeCompare((a[sortBy] as string));
        }
      }

      if (typeof a[sortBy] == 'number' && typeof b[sortBy] == 'number') {
          if(b[sortBy] < a[sortBy]) {
            return -1
          } else if(b[sortBy] > a[sortBy]) {
            return 1
          } else {
            return 0
          }
        } else {
          return (b[sortBy] as string).localeCompare((a[sortBy] as string));
        }
    }),
    payload.search
  );
}

export function LogTableSort({ data }: TableProps) {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState<keyof LogProps | null>(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const client = useClient();

  useEffect(() => {
    setSortedData(data)
  }, [data]);


  const setSorting = (field: keyof LogProps) => {
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
      <Table.Td>{row.blockNumber}</Table.Td>
      <Table.Td>{row.address}</Table.Td>
      <Table.Td>{row.metadata.contractName}</Table.Td>
      <Table.Td>{row.metadata.eventName}</Table.Td>
      <Table.Td>{(new Date(row.mintedAt * 1000)).toISOString()}</Table.Td>
      <Table.Td>
        <Group justify="center">
          <a href={`/pipelines/${row.id}`}>
            <Button leftSection={<IconPlayerPlay size={14} />} variant="default">
              Details
            </Button>
          </a>
        
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
            <Table.Th className={classes.th}>
                Block Number
            </Table.Th>
            <Table.Th className={classes.th}>
                Address
            </Table.Th>
            <Table.Th className={classes.th}>
                Contract 
            </Table.Th>
            <Table.Th className={classes.th}>
                Event 
            </Table.Th>
            
            <Th
              sorted={sortBy === 'mintedAt'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('mintedAt')}
            >
              Minted at
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
