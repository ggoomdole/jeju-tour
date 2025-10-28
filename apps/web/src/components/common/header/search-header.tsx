"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SearchIcon from "@/assets/search.svg";
import Header from "@/components/common/header";
import { SEARCH } from "@/constants/search";
import { getParams } from "@/utils/params";
import { revalidateTags } from "@/utils/revalidate";

interface SearchHeaderProps {
  onSearch?: () => void;
  word: string;
  [key: string]: string | undefined | (() => void);
}

export default function SearchHeader(props: SearchHeaderProps) {
  const { word, page, onSearch, ...restProps } = props;
  const [searchQuery, setSearchQuery] = useState(word || "");

  const router = useRouter();

  const onSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const trimmedSearchQuery = searchQuery.trim();
    if (word === trimmedSearchQuery && onSearch) {
      return onSearch();
    }
    const params = getParams(restProps, { word: trimmedSearchQuery });
    if (page === "road") revalidateTags([SEARCH.ROAD]);
    router.push(`?${params}`);
  };

  useEffect(() => {
    setSearchQuery(word || "");
  }, [word]);

  return (
    <Header
      rightElement={
        <button onClick={onSubmit}>
          <SearchIcon />
        </button>
      }
      sticky
    >
      <form onSubmit={onSubmit} className="typo-medium flex items-center bg-gray-100 px-2.5 py-1">
        <input
          value={searchQuery}
          onChange={onSearchQueryChange}
          className="w-full"
          placeholder="검색어를 입력해주세요"
        />
      </form>
    </Header>
  );
}
