import { useState } from 'react';

function VaultEntryList({ entries, onEdit, onDelete }) {
  const [revealedId, setRevealedId] = useState(null);

  if (entries.length === 0) {
    return <p className="empty-state">Your vault is empty — add your first entry.</p>;
  }

  return (
    <ul className="ledger">
      {entries.map((entry) => (
        <li className="ledger-row" key={entry.id}>
          <div className="ledger-main">
            <span className="ledger-title">{entry.title}</span>
            {entry.username && <span className="ledger-username">{entry.username}</span>}
          </div>
          <div className="ledger-secret">
            <span className="secret-value">
              {revealedId === entry.id ? entry.password : '••••••••'}
            </span>
            <button
              type="button"
              className="btn-icon"
              onClick={() => setRevealedId(revealedId === entry.id ? null : entry.id)}
            >
              {revealedId === entry.id ? 'Hide' : 'Reveal'}
            </button>
          </div>
          <div className="ledger-actions">
            <button type="button" className="btn-icon" onClick={() => onEdit(entry)}>Edit</button>
            <button type="button" className="btn-icon btn-danger" onClick={() => onDelete(entry.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default VaultEntryList;
