
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

const internships = [
  { id: '1', title: 'Web Development Intern', company: 'Tech Solutions', duration: '2 months', description: 'Build responsive websites using React and JavaScript.' },
  { id: '2', title: 'Python Developer Intern', company: 'Code Labs', duration: '3 months', description: 'Develop Python applications and work with databases.' },
  { id: '3', title: 'Data Analyst Intern', company: 'Analytics Hub', duration: '2 months', description: 'Analyze datasets and prepare useful reports.' }
];

export default function App() {
  const path = window.location.pathname;
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', rollNo: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const selected = internships.find(i => i.id === path.split('/').filter(Boolean).pop());
  const isDetails = path.startsWith('/internship/');
  const isApply = path.startsWith('/apply/');

  async function submit(e) {
    e.preventDefault();
    setMessage('');
    setError(false);

    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) || !form.rollNo.trim()) {
      setError(true);
      setMessage('Enter a valid name, email and roll number.');
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, internship: selected.title })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Application failed');
      setMessage('Application submitted successfully!');
      setForm({ name: '', email: '', rollNo: '' });
    } catch (err) {
      setError(true);
      setMessage(err.message || 'Could not connect to the server.');
    }
  }

  return (
    <main className="container">
      <h1>Student Internship Portal</h1>
      <p>Explore opportunities and apply for your internship.</p>

      {!isDetails && !isApply && (
        <section className="cards">
          {internships.map(i => (
            <article className="card" key={i.id}>
              <h2>{i.title}</h2>
              <p>{i.company}</p>
              <p>Duration: {i.duration}</p>
              <Link to={`/internship/${i.id}`}>View Details</Link>
            </article>
          ))}
        </section>
      )}

      {isDetails && selected && (
        <section className="card">
          <h2>{selected.title}</h2>
          <p>Company: {selected.company}</p>
          <p>Duration: {selected.duration}</p>
          <p>{selected.description}</p>
          <Link to={`/apply/${selected.id}`}>Apply Now</Link>
          <p><Link to="/">Back to Internships</Link></p>
        </section>
      )}

      {isApply && selected && (
        <form className="card form" onSubmit={submit}>
          <h2>Apply for {selected.title}</h2>
          <label>Student Name
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>Email ID
            <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </label>
          <label>Roll Number
            <input required value={form.rollNo} onChange={e => setForm({ ...form, rollNo: e.target.value })} />
          </label>
          <label>Selected Internship
            <input readOnly value={selected.title} />
          </label>
          <button type="submit">Submit Application</button>
          {message && <p className={error ? 'error' : 'success'}>{message}</p>}
          <Link to={`/internship/${selected.id}`}>Back to Details</Link>
        </form>
      )}

      {(isDetails || isApply) && !selected && (
        <p>Internship not found. <Link to="/">Return Home</Link></p>
      )}
    </main>
  );
}
