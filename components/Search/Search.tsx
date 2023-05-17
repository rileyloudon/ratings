'use client';

import { useRouter } from 'next/navigation';
import { FocusEvent, FormEvent, useState } from 'react';
import styles from './Search.module.css';

const Search = () => {
  const router = useRouter();

  const [searchString, setSearchString] = useState<string>('');

  const handleFocus = (e: FocusEvent<HTMLInputElement>): void =>
    e.target.select();

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (searchString.trim().length >= 1) {
      const input = document.querySelector('input');
      if (input) input.blur();

      const encodedSearchString = encodeURIComponent(searchString.trim());

      router.push(`/search?q=${encodedSearchString}&page=1`);
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
