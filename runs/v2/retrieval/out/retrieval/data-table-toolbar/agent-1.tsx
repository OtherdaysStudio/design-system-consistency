import {
  Stack,
  SearchInput,
  Pagination,
  Table,
  Text,
  token,
} from '@/ds';

export interface DataTableToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  totalRows?: number;
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
}

export function DataTableToolbar({
  searchValue = '',
  onSearchChange,
  totalRows = 0,
  page = 1,
  pageCount = 1,
  onPageChange,
}: DataTableToolbarProps) {
  return (
    <Stack gap="md">
      <Stack
        direction="row"
        align="center"
        justify="between"
        gap="md"
        style={{
          paddingBottom: token.space.sm,
          borderBottom: `${token.border.width.thin} solid ${token.color.border.subtle}`,
        }}
      >
        <SearchInput
          size="md"
          value={searchValue}
          placeholder="Search"
          onChange={onSearchChange}
        />

        <Stack direction="row" align="center" gap="lg">
          <Text variant="bodySm" color={token.color.text.muted}>
            {totalRows} rows
          </Text>
          <Pagination
            size="md"
            page={page}
            pageCount={pageCount}
            onPageChange={onPageChange}
          />
        </Stack>
      </Stack>

      <Table size="md">
        <Stack
          align="center"
          justify="center"
          style={{ padding: token.space.xl }}
        >
          <Text variant="bodyMd" color={token.color.text.muted}>
            No data to display
          </Text>
        </Stack>
      </Table>
    </Stack>
  );
}

export default DataTableToolbar;
