import type { FeedbackEntry } from '../types';
import quoteIcon from '../assets/quote.svg';
import './FeedbackList.css';

interface FeedbackListProps {
  entries: FeedbackEntry[];
}

function Stars({ count }: { count: number }) {
  return (
    <span className="feedback-stars" aria-label={`${count} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`feedback-star ${star <= count ? 'feedback-star--filled' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={star <= count ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

export default function FeedbackList({ entries }: FeedbackListProps) {
  if (entries.length === 0) return null;

  return (
    <section className="feedback-list-section">
      <div className="feedback-list-section__content">
        <div className="feedback-list">
          {entries.map((entry, index) => (
            <article key={index} className="feedback-card">
              <div className="feedback-card__header">
                <img src={quoteIcon} alt="" className="feedback-card__quote" />
                <Stars count={entry.rating} />
              </div>
              <p className="feedback-card__message">{entry.message}</p>
              <span className="feedback-card__name">{entry.name}</span>
            </article>
          ))}
        </div>
        <div className="feedback-list-section__text">
          <h2>We help make claims easier for brokers,<br />too</h2>
          <p>
            Browse through the experiences of our global clients. We pride
            ourselves on transparency and consistent quality.
          </p>
        </div>
      </div>
    </section>
  );
}
