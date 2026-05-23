/** Safe admin list fetch — never crashes the page on API/parse errors */
export function loadAdminList(request, pickList, setItems, setError) {
  return request
    .then(({ data }) => {
      const list = pickList(data);
      setItems(Array.isArray(list) ? list : []);
      setError?.("");
    })
    .catch((err) => {
      setItems([]);
      setError?.(
        err.response?.data?.message ||
          (err.code === "ECONNABORTED" ? "Request timed out — is the server running?" : null) ||
          err.message ||
          "Failed to load data. Check that the backend is running on port 5000."
      );
    });
}
