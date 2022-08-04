import { format, parseISO } from 'date-fns';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';
import { FiClock } from 'react-icons/fi';
import Header from '../../components/Header';
import { getPrismicClient } from '../../services/prismic';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      };
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();
  const date = parseISO(post.first_publication_date);
  const totalTime = post.data.content.reduce((acc, time) => {
    const total = RichText.asText(time.body).split(' ');

    const min = Math.ceil(total.length / 200);
    return acc + min;
  }, 0);
  if (router.isFallback) {
    return <>Carregando...</>;
  }
  return (
    <>
      <Header />
      <div className={styles.banner}>
        <img src={post.data.banner.url} alt="banner page" />
        <div>
          <h1>{post.data.title}</h1>
          <p>{post.data.author}</p>
          <span>
            <FiClock />
            {totalTime} min
          </span>
          <time>{format(date, 'dd MMM yyyy').toLowerCase()}</time>
        </div>

        <section>
          {post.data.content.map(p => (
            <div key={p.heading}>
              <strong>{p.heading}</strong>
              <div
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(p.body) }}
              />
            </div>
          ))}
        </section>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts');
  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('posts', String(params.slug));

  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      ...response.data,
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 30, // 30 minutes
  };
};
