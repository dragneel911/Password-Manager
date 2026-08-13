import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
import VaultEntryList from '../components/VaultEntryList.jsx';
import VaultEntryForm from '../components/VaultEntryForm.jsx';

function Dashboard({ user, onLogout }) {
  const [entries, setEntries] = useState([]);
  const [editingEntry, setEditingEntry] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEntries();
  }, []);

  async function loadEntries() {
    try {
      const data = await api.listEntries();
      setEntries(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSave(entry) {
    try {
      if (editingEntry) {
        await api.updateEntry(editingEntry.id, entry);
      } else {
        await api.createEntry(entry);
      }
      setShowForm(false);
      setEditingEntry(null);
      await loadEntries();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteEntry(id);
      await loadEntries();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogout() {
    try {
      await api.logout();
    } catch (err) {
      setError(err.message);
    } finally {
      onLogout();
    }
  }

  return (
    <div>
      <header>
        <h1>Vault — {user.email}</h1>
        <button onClick={handleLogout}>Log out</button>
      </header>
      {error && <p role="alert">{error}</p>}
      <button onClick={() => { setEditingEntry(null); setShowForm(true); setError(''); }}>Add entry</button>
      {showForm && (
        <VaultEntryForm
          key={editingEntry?.id ?? 'new'}
          initialEntry={editingEntry}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingEntry(null); }}
        />
      )}
      <VaultEntryList
        entries={entries}
        onEdit={(entry) => { setEditingEntry(entry); setShowForm(true); setError(''); }}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Dashboard;
