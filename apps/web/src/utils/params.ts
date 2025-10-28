export const getParams = (
  params: Record<string, unknown> | URLSearchParams,
  defaultParams: Record<string, unknown> = {}
) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.append(key, String(value));
    }
  });

  Object.entries(defaultParams).forEach(([key, value]) => {
    if (value) {
      if (searchParams.has(key)) {
        searchParams.set(key, String(value));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
};

export const calculateNextPageParam = ({
  totalPages,
  page,
}: {
  totalPages: number;
  page: number;
}) => {
  if (totalPages === 0 || page === totalPages - 1) {
    return undefined;
  }
  return page + 1;
};
