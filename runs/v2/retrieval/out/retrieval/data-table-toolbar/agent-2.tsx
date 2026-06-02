import {
  Stack,
  Text,
  SearchInput,
  Pagination,
  Table,
  token,
} from '@/ds';

export interface DataTableToolbarProps {
  query?: string;
  onQueryChange?: (value: string) => void;
  totalRows?: number;
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
}

export function DataTableToolbar({
  query = '',
  onQueryChange,
  totalRows = 0,
  page = 1,
  pageCount = 1,
  onPageChange,
}: DataTableToolbarProps) {
  return (
    <Stack
      direction="column"
      gap="md"
      style={{
        backgroundColor: token.color.surface.default,
        borderRadius: token.radius.lg,
        borderColor: token.color.border.subtle,
        padding: token.space.lg,
      }}
    >
      <Stack
        direction="row"
        align="center"
        justify="between"
        gap="md"
      >
        <SearchInput
          size="md"
          value={query}
          placeholder="Search"
          onChange={onQueryChange}
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
          direction="column"
          align="center"
          justify="center"
          gap="sm"
          style={{
            paddingTop: token.space.xl,
            paddingBottom: token.space.xl,
          }}
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
