export default function SortButton({
  searchParams,
  setSearchParams,
  columnName,
}) {
  function sortBooks(e) {
    //
    // function to set sort queries to the URL whenever a sort button is clicked
    // this will automatically query the API via useEffect
    //

    const sortBy = e.target.name;
    let currentParams = Object.fromEntries([...searchParams]);

    if (currentParams.sortQuery === sortBy) {
      currentParams.sortQuery = `-${sortBy}`;
      setSearchParams(currentParams);
      return;
    }

    currentParams.sortQuery = sortBy;
    setSearchParams(currentParams);
  }

  function sortIcon() {
    //
    //  Render icon dynamically based on current sort state
    //  If only one book is available, no sort icon is shown
    //

    if (!searchParams) return;

    if (searchParams.get("sortQuery") === columnName) {
      return "↑";
    } else if (searchParams.get("sortQuery") === `-${columnName}`) {
      return "↓";
    }

    return "⇅";
  }

  return (
    <button className="sortButton" name={columnName} onClick={sortBooks}>
      {sortIcon(columnName)}
    </button>
  );
}
