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
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="brand">
          <div className="vault-mark small" />
          <h1>Vault</h1>
        </div>
        <div className="header-actions">
          <span className="user-email">{user.email}</span>
          <button type="button" className="btn btn-ghost" onClick={handleLogout}>Log out</button>
        </div>
      </header>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="dashboard-toolbar">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => { setEditingEntry(null); setShowForm(true); setError(''); }}
        >
          Add entry
        </button>
      </div>
      {showForm && (
        <div className="panel-wrap">
          <VaultEntryForm
            key={editingEntry?.id ?? 'new'}
            initialEntry={editingEntry}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingEntry(null); }}
          />
        </div>
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
