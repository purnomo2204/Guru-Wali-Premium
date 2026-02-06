
import React from 'react';
import { ViewMode } from '../types';
import { Users, FileText, BarChart3, LogOut, FileCheck, Settings as SettingsIcon } from 'lucide-react';

interface DashboardProps {
  setView: (view: ViewMode) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setView }) => {
  const menus = [
    {
      id: ViewMode.STUDENT_LIST,
      title: 'Daftar Siswa Bimbingan',
      description: 'Kelola data identitas siswa, tambah, edit, dan hapus profil bimbingan.',
      icon: <Users className="w-8 h-8 text-cyan-400" />,
      color: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/30'
    },
    {
      id: ViewMode.COUNSELING_INPUT,
      title: 'Pelaksanaan Bimbingan',
      description: 'Catat jurnal harian, pendampingan klasikal, individual, dan tindak lanjut.',
      icon: <FileText className="w-8 h-8 text-emerald-400" />,
      color: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'border-emerald-500/30'
    },
    {
      id: ViewMode.COUNSELING_DATA,
      title: 'Data Pendampingan',
      description: 'Lihat riwayat bimbingan, rekapitulasi bulanan, dan ekspor laporan.',
      icon: <BarChart3 className="w-8 h-8 text-purple-400" />,
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      id: ViewMode.LPJ_MANAGEMENT,
      title: 'Laporan Pertanggungjawaban',
      description: 'Rekapitulasi pendampingan tahunan guru wali sesuai format standar.',
      icon: <FileCheck className="w-8 h-8 text-yellow-400" />,
      color: 'from-yellow-500/20 to-orange-500/20',
      borderColor: 'border-yellow-500/30'
    },
    {
      id: ViewMode.SETTINGS,
      title: 'Pengaturan Aplikasi',
      description: 'Atur identitas guru, cadangan data fisik, dan integrasi Google Spreadsheet.',
      icon: <SettingsIcon className="w-8 h-8 text-blue-400" />,
      color: 'from-blue-500/20 to-indigo-500/20',
      borderColor: 'border-blue-500/30'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setView(menu.id)}
            className={`glass-card group p-8 rounded-[2rem] text-left border ${menu.borderColor} hover:scale-[1.02] transition-all duration-300 relative overflow-hidden shadow-lg h-full`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${menu.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
            
            <div className="relative z-10">
              <div className="mb-6 p-4 rounded-2xl bg-slate-900/50 w-fit group-hover:scale-110 transition-transform shadow-inner border border-slate-800">
                {menu.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 font-orbitron text-slate-100">{menu.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {menu.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center pt-4">
        <button
          onClick={() => setView(ViewMode.WELCOME)}
          className="group flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-slate-300 border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all duration-300 shadow-xl"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-orbitron tracking-widest text-sm">KELUAR APLIKASI</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
