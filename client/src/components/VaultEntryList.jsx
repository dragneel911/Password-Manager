import { useState } from 'react';

function VaultEntryList({ entries, onEdit, onDelete }) {
  const [revealedId, setRevealedId] = useState(null);

  if (entries.length === 0) {
    return <p>No saved entries yet.</p>;
  }

  return (
    <ul>
      {entries.map((entry) => (
        <li key={entry.id}>
          <strong>{entry.title}</strong>
          {entry.username && <span> — {entry.username}</span>}
          <span>
            {' '}
            {revealedId === entry.id ? entry.password : '••••••••'}
            <button type="button" onClick={() => setRevealedId(revealedId === entry.id ? null : entry.id)}>
              {revealedId === entry.id ? 'Hide' : 'Reveal'}
            </button>
          </span>
          <button type="button" onClick={() => onEdit(entry)}>Edit</button>
          <button type="button" onClick={() => onDelete(entry.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}

export default VaultEntryList;
