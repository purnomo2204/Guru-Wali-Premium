
import React, { useState } from 'react';
import { ViewMode, Student, TeacherData } from '../types';
import { Plus, Save, Trash2, Edit, ArrowLeft, Camera, Download } from 'lucide-react';

interface StudentManagementProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  students: Student[];
  onAdd: (s: Student) => void;
  onUpdate: (s: Student) => void;
  onDelete: (id: string) => void;
  academicYear: string;
  teacherData: TeacherData;
}

const StudentManagement: React.FC<StudentManagementProps> = ({ view, setView, students, onAdd, onUpdate, onDelete, academicYear, teacherData }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Student>>({
    name: '', className: '', address: '', phone: '', notes: '', photo: ''
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, photo: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      onUpdate({ ...formData as Student, id: editingId });
      setEditingId(null);
    } else {
      onAdd({ ...formData as Student, id: Date.now().toString() });
    }
    setFormData({ name: '', className: '', address: '', phone: '', notes: '', photo: '' });
    setView(ViewMode.STUDENT_LIST);
  };

  const startEdit = (s: Student) => {
    setEditingId(s.id);
    setFormData(s);
    setView(ViewMode.STUDENT_INPUT);
  };

  const handleExportDOCX = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Daftar Siswa Bimbingan</title></head>
      <body>
        <h1 style="text-align:center">Daftar Siswa Bimbingan</h1>
        <p style="text-align:center">${teacherData.school}</p>
        <p style="text-align:center">Guru Wali : ${teacherData.name}</p>
        <p style="text-align:center">NIP : ${teacherData.nip}</p>
        <p style="text-align:center; font-weight:bold">Tahun Ajaran : ${academicYear}</p>
        <hr>
        <table border="1" style="width:100%; border-collapse:collapse">
          <thead>
            <tr style="background:#eee">
              <th style="padding:5px">No</th>
              <th style="padding:5px">Nama Siswa</th>
              <th style="padding:5px">Kelas</th>
              <th style="padding:5px">No. HP</th>
              <th style="padding:5px">Alamat</th>
            </tr>
          </thead>
          <tbody>
            ${students.map((s, index) => `
              <tr>
                <td style="padding:5px; text-align:center">${index + 1}</td>
                <td style="padding:5px">${s.name}</td>
                <td style="padding:5px">${s.className}</td>
                <td style="padding:5px">${s.phone}</td>
                <td style="padding:5px">${s.address}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Daftar_Siswa_${new Date().toLocaleDateString()}.doc`;
    link.click();
  };

  if (view === ViewMode.STUDENT_INPUT) {
    return (
      <div className="max-w-3xl mx-auto glass-card p-8 rounded-[2rem]">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold font-orbitron">{editingId ? 'Edit Data Siswa' : 'Input Data Siswa'}</h2>
          <div className="bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-cyan-400">
            TA: {academicYear}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32 rounded-3xl bg-slate-800 border-2 border-dashed border-slate-600 flex items-center justify-center overflow-hidden group">
              {formData.photo ? (
                <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-slate-500" />
              )}
              <input 
                type="file" 
                accept="image/jpeg" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handlePhotoChange}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Format JPEG (Wajib)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Nama Lengkap</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Kelas</label>
              <input required value={formData.className} onChange={e => setFormData({...formData, className: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">No. Telephone</label>
              <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Alamat</label>
              <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-400">Catatan</label>
            <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 h-32" />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-cyan-600 hover:bg-cyan-500 py-4 rounded-xl font-bold flex items-center justify-center gap-2">
              <Save className="w-5 h-5" /> SIMPAN DATA
            </button>
            <button type="button" onClick={() => setView(ViewMode.STUDENT_LIST)} className="metallic-black px-8 rounded-xl font-bold">KEMBALI</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center no-print">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold font-orbitron text-slate-100">Daftar Siswa Bimbingan</h2>
          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase">TA: {academicYear}</span>
        </div>
        <button onClick={() => setView(ViewMode.STUDENT_INPUT)} className="bg-cyan-600 p-3 rounded-xl hover:bg-cyan-500 flex items-center gap-2 font-bold text-sm">
          <Plus className="w-5 h-5" /> TAMBAH SISWA
        </button>
      </div>

      <div className="overflow-x-auto glass-card rounded-[2rem] border border-slate-800">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-sm uppercase">
              <th className="p-6">Foto</th>
              <th className="p-6">Nama</th>
              <th className="p-6">Kelas</th>
              <th className="p-6">No. HP</th>
              <th className="p-6 text-right no-print">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {students.length === 0 ? (
              <tr><td colSpan={5} className="p-12 text-center text-slate-500">Belum ada data siswa</td></tr>
            ) : students.map(s => (
              <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-6">
                  <img src={s.photo} className="w-12 h-12 rounded-xl object-cover bg-slate-800" />
                </td>
                <td className="p-6 font-medium text-slate-200">{s.name}</td>
                <td className="p-6 text-slate-300">{s.className}</td>
                <td className="p-6 text-slate-400">{s.phone}</td>
                <td className="p-6 text-right space-x-2 no-print">
                  <button onClick={() => startEdit(s)} className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg"><Edit className="w-5 h-5" /></button>
                  <button onClick={() => onDelete(s.id)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex gap-4 no-print">
        <button onClick={handleExportDOCX} className="bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all">
          <Download className="w-5 h-5" /> DOCX
        </button>
        <button onClick={() => setView(ViewMode.HOME)} className="metallic-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all hover:brightness-110">
          <ArrowLeft className="w-5 h-5" /> KEMBALI
        </button>
      </div>
    </div>
  );
};

export default StudentManagement;
