import { GetStaticProps } from 'next';
import { ReactElement, useState } from 'react';
import commonStyles from 'styles/common.module.scss';
import Header from '../components/Header';

import PostCard from '../components/PostCard';
import { getPrismicClient } from '../services/prismic';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): ReactElement {
  const [posts, setPosts] = useState(postsPagination.results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  function handleMorePosts(): void {
    fetch(postsPagination.next_page)
      .then(res => res.json())
      .then(jsonData => {
        const newPosts = jsonData.results.map(post => {
          return {
            uid: post.uid,
            first_publication_date: post.first_publication_date,
            data: post.data,
          };
        });
        setPosts(oldPosts => [...oldPosts, ...newPosts]);
        setNextPage(jsonData.next_page);
      });
  }
  return (
    <>
      <Header />

      <div className={commonStyles.container}>
        {posts.map(post => (
          <PostCard
            key={post.uid}
            data={post.data}
            uid={post.uid}
            first_publication_date={post.first_publication_date}
          />
        ))}
      </div>

      {nextPage && (
        <div className={commonStyles.container}>
          <button type="button" onClick={handleMorePosts}>
            Carregar mais posts
          </button>
        </div>
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const client = getPrismicClient({});
  const postsPagination = await client.getByType('posts');

  return {
    props: { postsPagination }, // Will be passed to the page component as props
  };
};
