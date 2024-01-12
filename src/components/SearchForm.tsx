import React, { useRef } from "react";

type SearchFormProps = {
  onSearch: (query: string) => void;
  initialQuery?: string;
  className?: string;
};

const SearchForm = ({ onSearch, initialQuery, className }: SearchFormProps) => {
  const searchRef = useRef() as React.RefObject<HTMLInputElement>;
  return (
    <>
      <search className={className}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!searchRef.current?.value) return;
            onSearch(searchRef.current?.value);
          }}
          className="flex flex-col gap-2"
        >
          <label htmlFor="query" className="text-lg">
            Search videos from youtube
          </label>
          <div className="flex items-center justify-center gap-1">
            <input
              type="search"
              id="query"
              name="qeury"
              defaultValue={initialQuery}
              required
              placeholder="Search..."
              className="border py-2 px-2.5 border-black rounded outline-black w-full"
              ref={searchRef}
            />
            <button
              type="submit"
              className="border bg-black rounded text-white px-2.5 py-2 hover:bg-opacity-75 transition-all duration-100 active:scale-95"
            >
              Search
            </button>
          </div>
        </form>
      </search>
    </>
  );
};

export default React.memo(SearchForm);
