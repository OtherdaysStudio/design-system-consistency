import {
  Stack,
  Box,
  Text,
  Card,
  Divider,
  SearchInput,
  IconButton,
  Icon,
  token,
} from '@/ds';

export interface DataTableToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  page?: number;
  pageCount?: number;
  totalRows?: number;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
}

export function DataTableToolbar({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search…',
  page = 1,
  pageCount = 1,
  totalRows = 0,
  onPreviousPage,
  onNextPage,
}: DataTableToolbarProps) {
  const isFirstPage = page <= 1;
  const isLastPage = page >= pageCount;

  return (
    <Card>
      <Stack
        direction="row"
        align="center"
        justify="between"
        gap="md"
        padding="md"
      >
        <Box width={token.size.input.md}>
          <SearchInput
            value={searchValue}
            onChange={onSearchChange}
            placeholder={searchPlaceholder}
            aria-label="Search table"
          />
        </Box>

        <Stack direction="row" align="center" gap="md">
          <Text variant="caption" color={token.color.text.secondary}>
            {totalRows} rows
          </Text>

          <Divider orientation="vertical" />

          <Stack direction="row" align="center" gap="sm">
            <IconButton
              variant="ghost"
              size="sm"
              disabled={isFirstPage}
              onClick={onPreviousPage}
              aria-label="Previous page"
            >
              <Icon name="chevron-left" />
            </IconButton>

            <Text variant="caption" color={token.color.text.secondary}>
              Page {page} of {pageCount}
            </Text>

            <IconButton
              variant="ghost"
              size="sm"
              disabled={isLastPage}
              onClick={onNextPage}
              aria-label="Next page"
            >
              <Icon name="chevron-right" />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>

      <Divider />

      <Box padding="lg" minHeight={token.size.table.bodyPlaceholder}>
        <Text variant="body" color={token.color.text.muted}>
          Table body placeholder
        </Text>
      </Box>
    </Card>
  );
}

export default DataTableToolbar;
