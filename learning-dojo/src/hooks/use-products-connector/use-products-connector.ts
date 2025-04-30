import { ApolloError } from "@apollo/client";
import { useMcQuery } from "@commercetools-frontend/application-shell";
import { GRAPHQL_TARGETS } from "@commercetools-frontend/constants";
import type { TDataTableSortingState } from "@commercetools-uikit/hooks";
import FetchProductsQuery from "./fetch-products.ctp.graphql";
import type { TFetchProductsQuery, TFetchProductsQueryVariables } from "../../types/generated/ctp";

type PaginationAndSortingProps = {
  page: { value: number };
  perPage: { value: number };
  tableSorting: TDataTableSortingState;
};

type TUseProductsFetcher = (
  paginationAndSortingProps: PaginationAndSortingProps
) => {
  productsPaginatedResult?: TFetchProductsQuery["products"];
  error?: ApolloError;
  loading: boolean;
};

export const useProductsFetcher: TUseProductsFetcher = ({ page, perPage, tableSorting }) => {
  const { data, error, loading } = useMcQuery<TFetchProductsQuery, TFetchProductsQueryVariables>(
    FetchProductsQuery,
    {
      variables: {
        limit: perPage.value,
        offset: (page.value - 1) * perPage.value,
        sort: [`${tableSorting.value.key} ${tableSorting.value.order}`],
      },
      context: {
        target: GRAPHQL_TARGETS.COMMERCETOOLS_PLATFORM,
      },
    }
  );

  return {
    productsPaginatedResult: data?.products,
    error,
    loading,
  };
};

