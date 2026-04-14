import { type FormEvent, useRef, useState } from 'react';
import StarRating from './StarRating';
import type { FeedbackEntry } from '../types';
import './FeedbackForm.css';

interface FeedbackFormProps {
  onSubmit: (entry: FeedbackEntry) => void;
}

export default function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (rating === 0) {
      setRatingError(true);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') as string).trim();
    const message = (formData.get('message') as string).trim();

    onSubmit({ name, message, rating });
    setRating(0);
    setRatingError(false);
    formRef.current?.reset();
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
    setRatingError(false);
  };

  return (
    <section className="form-section">
      <div className="form-section__content">
        <div className="form-section__text">
          <h1>Your feedback helps us grow</h1>
          <p>
            Please take a moment to leave a rating and help others make informed
            decisions.
          </p>
        </div>
        <form
          className="feedback-form"
          onSubmit={handleSubmit}
          ref={formRef}
          noValidate={false}
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            required
            aria-label="Name"
          />
          <textarea
            name="message"
            placeholder="Message"
            rows={4}
            required
            aria-label="Message"
          />
          <div className="feedback-form__rating">
            <StarRating value={rating} onChange={handleRatingChange} />
            {ratingError && (
              <span className="feedback-form__error">
                Please select a rating.
              </span>
            )}
          </div>
          <button type="submit" className="feedback-form__submit">
            Submit<span className="feedback-form__arrow">›</span>
          </button>
        </form>
      </div>
    </section>
  );
}
