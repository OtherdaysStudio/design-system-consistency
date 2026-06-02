import {
  Stack,
  Box,
  SearchInput,
  Pagination,
  Table,
  Text,
  Divider,
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
    <Stack gap="md">
      <Box
        padding="md"
        background={token.color.surface.subtle}
        borderRadius={token.radius.md}
        borderColor={token.color.border.muted}
        borderWidth={token.border.width.thin}
      >
        <Stack
          direction="row"
          align="center"
          justify="between"
          gap="lg"
          wrap="wrap"
        >
          <Box minWidth={token.size.input.search}>
            <SearchInput
              size="md"
              value={query}
              placeholder="Search rows"
              onChange={onQueryChange}
            />
          </Box>

          <Stack direction="row" align="center" gap="md">
            <Text variant="bodySm" color={token.color.text.muted}>
              {totalRows} rows
            </Text>
            <Divider orientation="vertical" />
            <Pagination
              size="md"
              page={page}
              count={pageCount}
              onChange={onPageChange}
            />
          </Stack>
        </Stack>
      </Box>

      <Table size="md">
        <Box
          padding="xl"
          align="center"
          justify="center"
          minHeight={token.size.placeholder.lg}
        >
          <Text variant="bodySm" color={token.color.text.muted}>
            Table body
          </Text>
        </Box>
      </Table>
    </Stack>
  );
}

export default DataTableToolbar;
