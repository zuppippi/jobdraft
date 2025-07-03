import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    position: '',
    employmentType: '',
    requiredSkills: '',
    appealPoints: '',
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  };

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>📄 求人票自動生成</h1>
      <input name="position" placeholder="職種" onChange={handleChange} />
      <input name="employmentType" placeholder="雇用形態（正社員など）" onChange={handleChange} />
      <input name="requiredSkills" placeholder="必須スキル" onChange={handleChange} />
      <textarea name="appealPoints" placeholder="魅力ポイント" onChange={handleChange} />
      <br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? '生成中...' : '求人票を生成する'}
      </button>
      <pre style={{ marginTop: 20, background: '#f9f9f9', padding: 10 }}>{result}</pre>
    </div>
  );
}
