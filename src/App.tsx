import { useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import type { FeedbackEntry } from './types';

const STORAGE_KEY = 'feedback-entries';

function loadEntries(): FeedbackEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: FeedbackEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export default function App() {
  const [entries, setEntries] = useState<FeedbackEntry[]>(loadEntries);

  const handleSubmit = (entry: FeedbackEntry) => {
    setEntries((prev) => {
      const updated = [...prev, entry];
      saveEntries(updated);
      return updated;
    });
  };

  return (
    <main>
      <FeedbackForm onSubmit={handleSubmit} />
      <FeedbackList entries={entries} />
    </main>
  );
}
