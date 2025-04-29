"use client";

import { useIntl } from "react-intl";
import { Link as RouterLink, useHistory, useRouteMatch } from "react-router-dom";
import { usePaginationState, useDataTableSortingState } from "@commercetools-uikit/hooks";
import { BackIcon } from "@commercetools-uikit/icons";
import Constraints from "@commercetools-uikit/constraints";
import FlatButton from "@commercetools-uikit/flat-button";
import LoadingSpinner from "@commercetools-uikit/loading-spinner";
import DataTable from "@commercetools-uikit/data-table";
import { ContentNotification } from "@commercetools-uikit/notifications";
import { Pagination } from "@commercetools-uikit/pagination";
import Spacings from "@commercetools-uikit/spacings";
import Text from "@commercetools-uikit/text";
import { useProductsFetcher } from "../../hooks/use-products-connector/use-products-connector";

const columns = [
  { key: "name", label: "Product Name" },
  { key: "key", label: "Product Key", isSortable: true },
  { key: "sku", label: "SKU" },
];

const ProductList = () => {
  const intl = useIntl();
  const match = useRouteMatch();
  const { push } = useHistory();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: "key", order: "asc" });

  const { productsPaginatedResult, error, loading } = useProductsFetcher({
    page,
    perPage,
    tableSorting,
  });

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>Error fetching products: {error.message}</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <FlatButton as={RouterLink} to="/" label="Back to Home" icon={<BackIcon />} />
        <Text.Headline as="h2">Product List</Text.Headline>
      </Spacings.Stack>

      <Constraints.Horizontal max={13}>
        <ContentNotification type="info">
          <Text.Body>Browse and manage products in your commercetools project.</Text.Body>
        </ContentNotification>
      </Constraints.Horizontal>

      {loading && <LoadingSpinner />}

      {productsPaginatedResult ? (
        <Spacings.Stack scale="l">
          <DataTable
            isCondensed
            columns={columns}
            rows={productsPaginatedResult.results}
            itemRenderer={(item, column) => {
              switch (column.key) {
                case "key":
                  return item.key;
                case "sku":
                  return item.masterData.current.sku;
                case "name":
                  return item.masterData.current.nameAllLocales[0]?.value || "No Name";
                default:
                  return null;
              }
            }}
            sortedBy={tableSorting.value.key}
            sortDirection={tableSorting.value.order}
            onSortChange={tableSorting.onChange}
          />
          <Pagination page={page.value} onPageChange={page.onChange} perPage={perPage.value} onPerPageChange={perPage.onChange} totalItems={productsPaginatedResult.total} />
        </Spacings.Stack>
      ) : null}
    </Spacings.Stack>
  );
};

export default ProductList;
