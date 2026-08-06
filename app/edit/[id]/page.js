'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import MultiSelect from '../../../components/MultiSelect';
async function convertToJpeg(file) {
  try {
    const bitmap = await createImageBitmap(file);
    const maxDim = 1600;
    let { width, height } = bitmap;
    if (width > maxDim || height > maxDim) {
      const scale = maxDim / Math.max(width, height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    return blob || file;
  } catch (e) {
    return file;
  }
}
export default function EditRecap() {
  const { id } = useParams();
  const router = useRouter();
  const [people, setPeople] = useState([]);
  const [form, setForm] = useState(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    loadPeople();
    loadRecap();
  }, [id]);
  async function loadPeople() {
    const { data } = await supabase.from('people').select('*').order('name');
    setPeople(data || []);
  }
  async function loadRecap() {
    setLoading(true);
    const { data, error: loadError } = await supabase.from('recaps').select('*').eq('id', id).single();
    if (loadError || !data) {
      setError('Could not find that backblast.');
      setLoading(false);
      return;
    }
    setForm({
      title: data.title || '',
      date: data.date || '',
      qId: data.q_id != null ? String(data.q_id) : '',
      paxIds: (data.pax_ids || []).map(String),
      fngs: data.fngs || '',
      intro: data.intro || '',
      warmup: data.warmup || '',
      thang: data.thang || '',
      mary: data.mary || '',
      announcements: data.announcements || '',
      cot: data.cot || '',
    });
    setExistingPhotoUrl(data.photo_url || null);
    setLoading(false);
  }
  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const converted = await convertToJpeg(file);
    setPhotoBlob(converted);
    setPhotoPreview(URL.createObjectURL(converted));
  }
  function handleRemovePhoto() {
    setPhotoBlob(null);
    setPhotoPreview(null);
    setExistingPhotoUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (!form.title || !form.date || !form.qId) {
      setError('Title, date, and Q are required.');
      return;
    }
    setSubmitting(true);
    try {
      let photoUrl = existingPhotoUrl;
      if (photoBlob) {
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
        const { error: uploadError } = await supabase.storage
        .from('recap-photos')
        .upload(filename, photoBlob, { contentType: 'image/jpeg' });
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('recap-photos').getPublicUrl(filename);
        photoUrl = urlData.publicUrl;
      }
      const fngNames = form.fngs
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
      if (fngNames.length) {
        const { data: currentPeople } = await supabase.from('people').select('name');
        const existingLower = new Set((currentPeople || []).map((p) => p.name.toLowerCase()));
        const newNames = fngNames.filter((n) => !existingLower.has(n.toLowerCase()));
        if (newNames.length) {
          await supabase.from('people').insert(newNames.map((name) => ({ name })));
        }
      }
      const { error: updateError } = await supabase
      .from('recaps')
      .update({
        title: form.title,
        date: form.date,
        q_id: Number(form.qId),
        pax_ids: form.paxIds.map(Number),
        fngs: form.fngs || null,
        intro: form.intro || null,
        warmup: form.warmup || null,
        thang: form.thang || null,
        mary: form.mary || null,
        announcements: form.announcements || null,
        cot: form.cot || null,
        photo_url: photoUrl,
      })
      .eq('id', id);
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => router.push('/recent-backblasts'), 1200);
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }
  if (loading) {
    return (
      <main className="container">
      <p className="page-eyebrow">The Grill</p>
    <h1 className="page-title">Edit Backblast</h1>
    <p>Loading&hellip;</p>
      </main>
    );
  }
  if (!form) {
    return (
      <main className="container">
      <p className="page-eyebrow">The Grill</p>
    <h1 className="page-title">Edit Backblast</h1>
    <p className="error">{error || 'That backblast could not be found.'}</p>
  <p>
    <Link href="/recent-backblasts">&larr; Back to Recent Backblasts</Link>
      </p>
    </main>
  );
}
return (
  <main className="container">
  <p className="page-eyebrow">The Grill</p>
<h1 className="page-title">Edit Backblast</h1>
{error && <p className="error">{error}</p>}
 {success && <p className="success">Saved! Taking you back to Recent Backblasts&hellip;</p>}
   <form onSubmit={handleSubmit}>
   <div className="card form-card">
   <h2>Recap Details</h2>
  <div>
   <label>Title</label>
  <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)} />
   </div>
  <div>
   <label>Date</label>
  <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} />
   </div>
  <div>
   <label>The Q</label>
  <select value={form.qId} onChange={(e) => update('qId', e.target.value)}>
   <option value="">Select...</option>
  {people.map((p) => (
    <option key={p.id} value={p.id}>
  {p.name}
    </option>
  ))}
 </select>
   </div>
 <div>
   <label>PAX</label>
 <MultiSelect
 options={people.map((p) => ({ id: String(p.id), name: p.name }))}
selected={form.paxIds}
onChange={(ids) => update('paxIds', ids)}
placeholder="Select PAX..."
/>
  </div>
<div>
  <label>
  FNGs <span className="hint">(comma-separated new names get added automatically for next time)</span>
  </label>
<p className="hint-line">Add the F3 name followed by real name in parentheses</p>
<input type="text" value={form.fngs} onChange={(e) => update('fngs', e.target.value)} placeholder="e.g., Sprinkles (John DoeNut)" />
  </div>
<div>
  <label>Add Photo (the boyband!)</label>
<input type="file" accept="image/*" onChange={handlePhotoChange} ref={fileInputRef} />
{(photoPreview || existingPhotoUrl) && (
  <div>
  <img className="preview" src={photoPreview || existingPhotoUrl} alt="preview" />
  <button type="button" className="remove-photo" onClick={handleRemovePhoto}>
  Remove photo
  </button>
  </div>
)}
</div>
  </div>
<div className="card form-card">
  <h2 className="beatdown-heading">Beatdown</h2>
<div>
  <label>Quick description of the beatdown, or a fun story or comment</label>
<textarea value={form.intro} onChange={(e) => update('intro', e.target.value)} />
  </div>
<div>
  <label>Warmup</label>
<textarea value={form.warmup} onChange={(e) => update('warmup', e.target.value)} />
  </div>
<div>
  <label>The Thang</label>
<textarea rows={15} value={form.thang} onChange={(e) => update('thang', e.target.value)} />
  </div>
<div>
  <label>Mary</label>
<textarea value={form.mary} onChange={(e) => update('mary', e.target.value)} />
  </div>
<div>
  <label>Announcements</label>
<textarea value={form.announcements} onChange={(e) => update('announcements', e.target.value)} />
  </div>
<div>
  <label>COT</label>
<textarea value={form.cot} onChange={(e) => update('cot', e.target.value)} />
  </div>
  </div>
<div className="form-submit">
  <button type="submit" className="btn btn-primary" disabled={submitting}>
{submitting ? 'Saving...' : 'Save Changes'}
                                                               </button>
<Link href="/recent-backblasts" className="btn btn-outline-dark">
                                                                 Cancel
                                                                 </Link>
                                                                 </div>
                                                                 </form>
                                                                 </main>
);
}
