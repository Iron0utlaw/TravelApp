export const blobStyles = {
  position: "fixed",
  zIndex: -1, // Ensure the blob stays behind other content
  opacity: 0.5,
};

export const formatBudget = (value) => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// export const handleSearch = (query) => {
//   window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
// };