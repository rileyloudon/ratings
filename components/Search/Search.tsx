'use client';

import { useRouter } from 'next/navigation';
import { FocusEvent, FormEvent, useState } from 'react';
import styles from './Search.module.css';

interface SearchProps {
  currentSearch?: string;
  // updateCurrentSearch(value: string): void;
}

const Search = ({
  currentSearch = '',
}: // updateCurrentSearch
SearchProps) => {
  const router = useRouter();

  const [searchString, setSearchString] = useState<string>(currentSearch);

  const handleFocus = (e: FocusEvent<HTMLInputElement>): void =>
    e.target.select();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchString.trim().length >= 1) {
      const input = document.querySelector('input');
      if (input) input.blur();
      // turns any non-alphanumeric characters into spaces
      const filteredSearchString = searchString.replace(/[\W_]+/g, ' ').trim();

      // updateCurrentSearch(filteredSearchString);
      router.push(`/search?q=${filteredSearchString}&page=1`);
      if (filteredSearchString !== searchString)
        setSearchString(filteredSearchString);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type='search'
        inputMode='search'
        placeholder='Search'
        autoCorrect='off'
        value={searchString}
        onChange={(e) => setSearchString(e.target.value)}
        onFocus={handleFocus}
        // fixes safari handleFocus not selecting
        onMouseUp={(e) => e.preventDefault()}
      />
      <button type='submit'>Search</button>
    </form>
  );
};

export default Search;
