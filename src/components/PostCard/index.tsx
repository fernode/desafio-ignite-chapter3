import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { BsFillCalendarFill, BsPersonFill } from 'react-icons/bs';
import styles from './styles.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

export default function PostCard({ uid, data, first_publication_date }: Post) {
  return (
    <div className={styles.postCard} key={uid}>
      <Link href={`/post/${uid}`}>
        <a>
          <h3>{data.title}</h3>
        </a>
      </Link>
      <p>{data.subtitle}</p>

      <div className={styles.postCardInfo}>
        <span>
          <BsFillCalendarFill />
          <time>
            {format(new Date(first_publication_date), 'dd MMM yyyy', {
              locale: ptBR,
            })}
          </time>
        </span>
        <span>
          <BsPersonFill />
          {data.author}
        </span>
      </div>
    </div>
  );
}
