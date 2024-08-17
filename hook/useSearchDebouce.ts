import { DEBOUNCE_DELAY } from "@/constant/debounce";
import { useState } from "react";
import { useDebounce, useDebouncedCallback } from "use-debounce";

export default function useSearchDebounce(callback: () => void) {
  const [searchText, setSearchText] = useState("");
  const [debounceSearchText] = useDebounce(searchText, DEBOUNCE_DELAY);
  const debounceCallback = useDebouncedCallback(() => {
    callback();
  }, DEBOUNCE_DELAY);

  const handleSearchTextChange = (value: string) => {
    setSearchText(value);
    // debounceCallback();
  };

  return {
    searchText,
    debounceSearchText,
    handleSearchTextChange,
  };
}
