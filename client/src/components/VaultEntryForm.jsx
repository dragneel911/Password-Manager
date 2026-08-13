import { useState } from 'react';
import StrengthMeter from './StrengthMeter.jsx';

function VaultEntryForm({ initialEntry, onSave, onCancel }) {
  const [title, setTitle] = useState(initialEntry?.title || '');
  const [username, setUsername] = useState(initialEntry?.username || '');
  const [password, setPassword] = useState(initialEntry?.password || '');
  const [url, setUrl] = useState(initialEntry?.url || '');
  const [notes, setNotes] = useState(initialEntry?.notes || '');

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ title, username, password, url, notes });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Username
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <StrengthMeter password={password} />
      <label>
        URL
        <input value={url} onChange={(e) => setUrl(e.target.value)} />
      </label>
      <label>
        Notes
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
}

export default VaultEntryForm;
