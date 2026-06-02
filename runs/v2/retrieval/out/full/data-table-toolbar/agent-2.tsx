import {
  Stack,
  Box,
  SearchInput,
  Pagination,
  Text,
  Divider,
  List,
  ListItem,
  token,
} from '@/ds';

export interface DataTableToolbarProps {
  query?: string;
  onQueryChange?: (value: string) => void;
  totalCount?: number;
  rangeStart?: number;
  rangeEnd?: number;
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
}

export function DataTableToolbar({
  query = '',
  onQueryChange,
  totalCount = 0,
  rangeStart = 0,
  rangeEnd = 0,
  page = 1,
  pageCount = 1,
  onPageChange,
}: DataTableToolbarProps) {
  return (
    <Stack gap="md">
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: token.space.md,
          paddingInline: token.space.md,
          paddingBlock: token.space.sm,
          backgroundColor: token.color.surface,
          borderRadius: token.radius.md,
          borderWidth: token.border.width.thin,
          borderStyle: 'solid',
          borderColor: token.color.border,
        }}
      >
        <Box style={{ flex: '1 1 auto', maxWidth: token.size.input.lg }}>
          <SearchInput
            size="md"
            value={query}
            placeholder="Search records"
            onChange={onQueryChange}
          />
        </Box>

        <Stack direction="row" gap="md" align="center">
          <Text variant="bodySm" color="muted">
            {rangeStart}–{rangeEnd} of {totalCount}
          </Text>
          <Pagination
            size="md"
            page={page}
            count={pageCount}
            onChange={onPageChange}
          />
        </Stack>
      </Box>

      <Divider />

      <Box
        style={{
          borderRadius: token.radius.md,
          borderWidth: token.border.width.thin,
          borderStyle: 'solid',
          borderColor: token.color.border,
          backgroundColor: token.color.surface,
        }}
      >
        <List size="md">
          <ListItem>
            <Text variant="bodyMd" color="muted">
              Table rows render here
            </Text>
          </ListItem>
        </List>
      </Box>
    </Stack>
  );
}

export default DataTableToolbar;
