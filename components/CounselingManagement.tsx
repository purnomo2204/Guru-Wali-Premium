
import React, { useState, useMemo, useEffect } from 'react';
import { ViewMode, Student, CounselingLog, CounselingType, CounselingAspect, CounselingStatus, TeacherData } from '../types';
import { Send, ArrowLeft, Download, Eye, X, Plus, Filter } from 'lucide-react';

interface CounselingManagementProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  students: Student[];
  logs: CounselingLog[];
  onAdd: (l: CounselingLog) => void;
  globalAcademicYear: string;
  teacherData: TeacherData;
}

const CounselingManagement: React.FC<CounselingManagementProps> = ({ view, setView, students, logs, onAdd, globalAcademicYear, teacherData }) => {
  const [formData, setFormData] = useState<Partial<CounselingLog>>({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    academicYear: globalAcademicYear,
    studentId: '',
    type: 'Individual',
    aspect: 'Akademik',
    result: '',
    status: 'baik',
    followUp: '',
    notes: ''
  });

  const [filterType, setFilterType] = useState<string>('Individual & Klasikal');
  const [previewLog, setPreviewLog] = useState<CounselingLog | null>(null);

  // Sync academicYear if global changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, academicYear: globalAcademicYear }));
  }, [globalAcademicYear]);

  const selectedStudent = useMemo(() => 
    students.find(s => s.id === formData.studentId),
    [formData.studentId, students]
  );

  // Logika filter untuk tabel pratinjau
  const filteredDisplayLogs = useMemo(() => {
    if (filterType === 'Individual & Klasikal') return logs;
    return logs.filter(log => log.type === filterType);
  }, [logs, filterType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    
    onAdd({
      ...formData as CounselingLog,
      id: Date.now().toString(),
      studentName: selectedStudent.name,
      className: selectedStudent.className
    });
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      startTime: '', endTime: '', academicYear: globalAcademicYear, studentId: '', type: 'Individual',
      aspect: 'Akademik', result: '', status: 'baik', followUp: '', notes: ''
    });
    setView(ViewMode.COUNSELING_DATA);
  };

  const handleExportDOCX = () => {
    const content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Jurnal Bimbingan</title></head>
      <body>
        <h1 style="text-align:center">Jurnal Bimbingan Guru Wali</h1>
        <p style="text-align:center">${teacherData.school}</p>
        <p style="text-align:center">Guru Wali : ${teacherData.name}</p>
        <p style="text-align:center">NIP : ${teacherData.nip}</p>
        <p style="text-align:center; font-weight:bold">Tahun Ajaran : ${globalAcademicYear}</p>
        <p style="text-align:center">Kategori : ${filterType}</p>
        <hr>
        <table border="1" style="width:100%; border-collapse:collapse">
          <thead>
            <tr style="background:#eee">
              <th style="padding:5px">No</th>
              <th style="padding:5px">Tanggal</th>
              <th style="padding:5px">Nama Siswa</th>
              <th style="padding:5px">Kelas</th>
              <th style="padding:5px">Jenis</th>
              <th style="padding:5px">Aspek</th>
              <th style="padding:5px">Hasil</th>
              <th style="padding:5px">Tindak Lanjut</th>
            </tr>
          </thead>
          <tbody>
            ${filteredDisplayLogs.map((l, index) => `
              <tr>
                <td style="padding:5px; text-align:center">${index + 1}</td>
                <td style="padding:5px">${l.date}</td>
                <td style="padding:5px">${l.studentName}</td>
                <td style="padding:5px">${l.className}</td>
                <td style="padding:5px">${l.type}</td>
                <td style="padding:5px">${l.aspect}</td>
                <td style="padding:5px">${l.result}</td>
                <td style="padding:5px">${l.followUp}</td>
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
    link.download = `Jurnal_Bimbingan_${filterType.replace(/\s/g, '_')}_${new Date().toLocaleDateString()}.doc`;
    link.click();
  };

  if (view === ViewMode.COUNSELING_INPUT) {
    return (
      <div className="max-w-4xl mx-auto glass-card p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl">
        <div className="flex justify-between items-start mb-10">
          <h2 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Pelaksanaan Bimbingan
          </h2>
          <div className="bg-slate-900/50 px-6 py-3 rounded-2xl border border-slate-700">
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tahun Ajaran</label>
            <input 
              type="text" 
              value={formData.academicYear} 
              onChange={e => setFormData({...formData, academicYear: e.target.value})} 
              className="bg-transparent border-none p-0 text-cyan-400 font-bold focus:ring-0 w-24"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Tanggal</label>
            <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Jam Awal</label>
              <input type="time" required value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Jam Akhir</label>
              <input type="time" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Nama Siswa</label>
              <select required value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4">
                <option value="">Pilih Siswa...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Kelas</label>
              <input disabled value={selectedStudent?.className || '-'} className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-slate-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Jenis Bimbingan</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as CounselingType})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4">
                <option value="Individual">Individual</option>
                <option value="Klasikal">Klasikal</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Aspek Pendampingan</label>
              <select value={formData.aspect} onChange={e => setFormData({...formData, aspect: e.target.value as CounselingAspect})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4">
                <option>Akademik</option>
                <option>Karakter</option>
                <option>Sosial-Emosional</option>
                <option>Kedisiplinan</option>
                <option>Bakat dan Minat</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Hasil Pendampingan</label>
            <textarea required value={formData.result} onChange={e => setFormData({...formData, result: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 h-24" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Status Bimbingan</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as CounselingStatus})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4">
                <option value="baik">Baik</option>
                <option value="perlu perhatian">Perlu Perhatian</option>
                <option value="butuh bantuan">Butuh Bantuan</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Tindak Lanjut</label>
              <input required value={formData.followUp} onChange={e => setFormData({...formData, followUp: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Catatan</label>
            <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 h-24" />
          </div>

          <div className="flex gap-4 pt-6">
            <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]">
              <Send className="w-6 h-6" /> KIRIM DATA JURNAL
            </button>
            <button type="button" onClick={() => setView(ViewMode.HOME)} className="metallic-black px-10 rounded-2xl font-bold border border-slate-700 flex items-center gap-2 transition-all hover:brightness-125">
              <ArrowLeft className="w-5 h-5" /> KEMBALI
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 no-print">
        <div className="glass-card p-6 rounded-3xl border border-slate-800 group hover:border-cyan-500/50 transition-all">
          <h4 className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-2">Total Bimbingan</h4>
          <div className="text-4xl font-orbitron font-bold text-cyan-400">{logs.length}</div>
          <p className="text-[10px] text-slate-500 mt-2 uppercase">TA: {globalAcademicYear}</p>
        </div>
        <div className="glass-card p-6 rounded-3xl border border-slate-800 group hover:border-red-500/50 transition-all">
          <h4 className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-2">Butuh Bantuan</h4>
          <div className="text-4xl font-orbitron font-bold text-red-400">{logs.filter(l => l.status === 'butuh bantuan').length}</div>
          <p className="text-[10px] text-slate-500 mt-2 uppercase">Perlu Tindakan Segera</p>
        </div>
        <div className="glass-card p-6 rounded-3xl border border-slate-800 group hover:border-emerald-500/50 transition-all">
          <h4 className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-2">Harian (Hari Ini)</h4>
          <div className="text-4xl font-orbitron font-bold text-emerald-400">
            {logs.filter(l => l.date === new Date().toISOString().split('T')[0]).length}
          </div>
          <p className="text-[10px] text-slate-500 mt-2 uppercase">Jurnal Hari Ini</p>
        </div>
        <div className="glass-card p-6 rounded-3xl border border-slate-800 group hover:border-purple-500/50 transition-all">
          <h4 className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-2">Individual/Klasikal</h4>
          <div className="text-xl font-orbitron font-bold text-slate-300">
            {logs.filter(l => l.type === 'Individual').length} Indv / {logs.filter(l => l.type === 'Klasikal').length} Klas
          </div>
          <p className="text-[10px] text-slate-500 mt-2 uppercase">Metode Bimbingan</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 no-print">
        <h2 className="text-3xl font-bold font-orbitron">Data Pendampingan</h2>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group flex items-center bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2 min-w-[200px]">
            <Filter className="w-4 h-4 text-cyan-400 mr-3" />
            <div className="flex flex-col flex-1">
              <label className="text-[9px] uppercase font-bold text-slate-500 leading-none mb-1">Jenis Bimbingan</label>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-transparent border-none p-0 text-sm font-bold focus:ring-0 outline-none w-full text-slate-200 cursor-pointer"
              >
                <option className="bg-slate-900" value="Individual & Klasikal">Individual & Klasikal</option>
                <option className="bg-slate-900" value="Individual">Individual</option>
                <option className="bg-slate-900" value="Klasikal">Klasikal</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setView(ViewMode.COUNSELING_INPUT)} 
              className="bg-emerald-600 hover:bg-emerald-500 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/10 transition-colors"
            >
              <Plus className="w-4 h-4" /> TAMBAH DATA BIMBINGAN
            </button>
            <button 
              onClick={handleExportDOCX} 
              title="Download DOCX (Word)" 
              className="bg-slate-800 hover:bg-slate-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4" /> DOCX
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto glass-card rounded-[2.5rem] border border-slate-800">
        <div className="bg-slate-900/50 p-4 border-b border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Filter className="w-3 h-3 text-cyan-500" /> Filter Aktif: <span className="text-cyan-400">{filterType}</span>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-widest bg-slate-900/40">
              <th className="p-6">No</th>
              <th className="p-6">Tanggal & Jam</th>
              <th className="p-6">Nama / Kelas</th>
              <th className="p-6">Jenis</th>
              <th className="p-6">Aspek</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right no-print">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredDisplayLogs.length === 0 ? (
              <tr><td colSpan={7} className="p-20 text-center text-slate-500 italic">Tidak ada data bimbingan {filterType !== 'Individual & Klasikal' ? `kategori ${filterType}` : ''} yang ditemukan.</td></tr>
            ) : filteredDisplayLogs.map((l, index) => (
              <tr key={l.id} className="hover:bg-slate-800/20 transition-colors group">
                <td className="p-6">
                  <span className="text-xs font-bold text-cyan-500/70">{index + 1}</span>
                </td>
                <td className="p-6">
                  <div className="font-medium text-slate-200 text-xs">{l.date}</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-tighter">{l.startTime} - {l.endTime}</div>
                </td>
                <td className="p-6">
                  <div className="font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">{l.studentName}</div>
                  <div className="text-xs text-slate-500">{l.className}</div>
                </td>
                <td className="p-6">
                  <span className={`text-[10px] font-bold uppercase ${l.type === 'Klasikal' ? 'text-purple-400' : 'text-emerald-400'}`}>{l.type}</span>
                </td>
                <td className="p-6">
                  <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-[10px] font-medium text-slate-300 uppercase">{l.aspect}</span>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    l.status === 'baik' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                    l.status === 'perlu perhatian' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                    'bg-red-500/10 text-red-400 border border-red-500/30'
                  }`}>
                    {l.status}
                  </span>
                </td>
                <td className="p-6 text-right no-print">
                  <button 
                    onClick={() => setPreviewLog(l)} 
                    title="Preview Detail" 
                    className="p-2 hover:bg-slate-700 rounded-lg transition-all text-slate-400 hover:text-cyan-400"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 no-print">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setPreviewLog(null)} />
          <div className="relative glass-card w-full max-w-2xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold font-orbitron text-cyan-400 uppercase tracking-widest">Detail Jurnal</h3>
                <span className="bg-slate-800 px-3 py-1 rounded-lg text-[10px] font-bold text-slate-400">TA: {previewLog.academicYear}</span>
              </div>
              <button onClick={() => setPreviewLog(null)} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Nama Siswa</label>
                  <p className="text-lg font-bold">{previewLog.studentName}</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Kelas</label>
                  <p className="text-lg font-bold">{previewLog.className}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Waktu</label>
                  <p className="text-slate-300">{previewLog.date} ({previewLog.startTime} - {previewLog.endTime})</p>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Status</label>
                  <div className="mt-1">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      previewLog.status === 'baik' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      previewLog.status === 'perlu perhatian' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                      'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {previewLog.status}
                    </span>
                  </div>
                </div>
              </div>
              <hr className="border-slate-800" />
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Hasil Pendampingan</label>
                <p className="text-slate-200 mt-2 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">{previewLog.result}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase">Tindak Lanjut</label>
                <p className="text-slate-200 mt-2 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">{previewLog.followUp}</p>
              </div>
            </div>
            <div className="p-8 border-t border-slate-800 flex gap-4 bg-slate-900/30">
              <button onClick={() => setPreviewLog(null)} className="flex-1 metallic-black px-8 py-4 rounded-xl font-bold border border-slate-700">TUTUP</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselingManagement;
