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
      <label className="field">
        <span className="field-label">Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label className="field">
        <span className="field-label">Username</span>
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label className="field field-mono">
        <span className="field-label">Password</span>
        <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <StrengthMeter password={password} />
      <label className="field">
        <span className="field-label">URL</span>
        <input value={url} onChange={(e) => setUrl(e.target.value)} />
      </label>
      <label className="field">
        <span className="field-label">Notes</span>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>
      <div className="panel-actions">
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default VaultEntryForm;
