import {
  Stack,
  Inline,
  Box,
  Text,
  SearchInput,
  IconButton,
  Icon,
  Divider,
  token,
} from '@/ds';

export interface DataTableToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export function DataTableToolbar({
  query,
  onQueryChange,
  page,
  pageSize,
  totalCount,
  onPageChange,
}: DataTableToolbarProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const rangeStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalCount);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <Stack gap="md">
      <Inline align="center" justify="between" gap="md">
        <Box width={token.size.input.lg}>
          <SearchInput
            value={query}
            onChange={onQueryChange}
            placeholder="Search"
            aria-label="Search table"
          />
        </Box>

        <Inline align="center" gap="md">
          <Text variant="bodySmall" color={token.color.text.secondary}>
            {rangeStart}–{rangeEnd} of {totalCount}
          </Text>

          <Divider orientation="vertical" />

          <Inline align="center" gap="xs">
            <IconButton
              aria-label="Previous page"
              variant="ghost"
              disabled={!canPrev}
              onClick={() => onPageChange(page - 1)}
            >
              <Icon name="chevronLeft" />
            </IconButton>

            <Text variant="bodySmall" color={token.color.text.secondary}>
              Page {page} of {totalPages}
            </Text>

            <IconButton
              aria-label="Next page"
              variant="ghost"
              disabled={!canNext}
              onClick={() => onPageChange(page + 1)}
            >
              <Icon name="chevronRight" />
            </IconButton>
          </Inline>
        </Inline>
      </Inline>

      <Divider />

      <Box
        padding="xl"
        background={token.color.surface.subtle}
        borderRadius={token.radius.md}
      >
        <Text variant="bodySmall" color={token.color.text.tertiary} align="center">
          Table body placeholder
        </Text>
      </Box>
    </Stack>
  );
}

export default DataTableToolbar;
