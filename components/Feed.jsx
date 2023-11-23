'use client';

import { useState, useEffect, useRef } from 'react';

import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [posts, setPosts] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const searchTimeoutId = useRef(null);

  const filterPrompts = (searchtext) => {
    const regex = new RegExp(searchtext, 'i');
    return posts.filter(
      (post) =>
        regex.test(post.creator.username) ||
        regex.test(post.prompt) ||
        regex.test(post.tag)
    );
  };

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeoutId.current);
    setSearchText(e.target.value);

    searchTimeoutId.current = setTimeout(() => {
      const searchResult = filterPrompts(e.target.value);
      setSearchResults(searchResult);
    }, 500);
  };

  const handleTagClick = (tagName) => {};

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch('/api/prompt');

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form
        className="relative w-full flex-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {searchResults ? (
        <PromptCardList data={searchResults} handleTagClick={handleTagClick} />
      ) : (
        <PromptCardList data={posts} handleTagClick={handleTagClick} />
      )}
    </section>
  );
};

export default Feed;
