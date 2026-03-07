'use client'

import { useState, useRef } from 'react';
import { Upload, Download } from 'lucide-react';
import { importStudents } from '@/app/actions/students';

export default function StudentImportExport({ students }: { students: any[] }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);

  const handleExport = () => {
    // Generate CSV content
    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Date of Birth', 'Status', 'Remaining Classes'];
    const rows = students.map(s => [
      s.first_name,
      s.last_name,
      s.email || '',
      s.phone || '',
      s.date_of_birth || '',
      s.status,
      s.remaining_classes || 0,
    ]);

    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim());
      // Skip header row
      const dataLines = lines.slice(1);

      const studentsData = dataLines.map(line => {
        // Simple CSV parser - split by comma, handle quoted fields
        const cells = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(c => c.replace(/^"|"$/g, '').trim()) || [];
        return {
          first_name: cells[0] || '',
          last_name: cells[1] || '',
          email: cells[2] || undefined,
          phone: cells[3] || undefined,
          date_of_birth: cells[4] || undefined,
          status: cells[5] || 'active',
        };
      }).filter(s => s.first_name && s.last_name);

      if (studentsData.length > 0) {
        await importStudents(studentsData);
        window.location.reload();
      }
    } catch (err) {
      console.error('Import error:', err);
      alert('Error importing file. Please check the format.');
    }
    setImporting(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExport}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 border border-slate-300 bg-transparent hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      >
        <Download className="w-4 h-4" /> Export
      </button>
      <label className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 border border-slate-300 bg-transparent hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 cursor-pointer">
        <Upload className="w-4 h-4" /> {importing ? 'Importing...' : 'Import'}
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleImport}
          className="hidden"
        />
      </label>
    </div>
  );
}
