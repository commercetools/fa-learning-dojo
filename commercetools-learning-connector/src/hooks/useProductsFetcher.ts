import { useEffect, useState } from "react";
import { useApplicationContext } from "@commercetools-frontend/application-shell-connectors";

const useProductsFetcher = ({ page, perPage, tableSorting }) => {
  const [productsPaginatedResult, setProductsPaginatedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { environment } = useApplicationContext((context) => context);
  const apiUrl = environment.mcApiUrl;
  const authToken = environment.mcAccessToken;

  useEffect(() => {
    if (!authToken) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${apiUrl}/products?limit=${perPage}&offset=${(page - 1) * perPage}&sort=${tableSorting.value.key} ${tableSorting.value.order}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProductsPaginatedResult(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [authToken, apiUrl, page, perPage, tableSorting]);

  return { productsPaginatedResult, loading, error };
};

export default useProductsFetcher;
