
import React, { useCallback, useState } from 'react';
import { DatasetPreview } from '../types';
import { useLanguage } from '../language';

interface FileUploadProps {
  onFileProcessed: (dataset: DatasetPreview) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed }) => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError(t.onlyCsv);
      return;
    }
    
    // 50GB Limit (50 * 1024 * 1024 * 1024 bytes)
    const MAX_SIZE_BYTES = 50 * 1024 * 1024 * 1024;
    
    if (file.size > MAX_SIZE_BYTES) {
      setError(t.fileTooBig);
      return;
    }

    // OPTIMIZATION: Read only the first 256KB to get headers and sample data.
    const CHUNK_SIZE = 256 * 1024; // 256KB
    const chunk = file.slice(0, CHUNK_SIZE);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').map(line => line.trim()).filter(line => line);
      
      if (lines.length < 2) {
        setError('CSV file is empty or malformed.');
        return;
      }

      const columns = lines[0].split(',').map(c => c.replace(/['"]+/g, '').trim());
      // Capture header + 10 rows
      const limit = Math.min(lines.length, 11);
      const sampleData = lines.slice(1, limit).map(line => {
        const values = line.split(',');
        const row: Record<string, string> = {};
        columns.forEach((col, idx) => {
          row[col] = values[idx] || '';
        });
        return row;
      });

      onFileProcessed({
        filename: file.name,
        columns,
        rowCount: file.size > CHUNK_SIZE ? 1000000 : lines.length - 1, 
        sampleData,
      });
    };
    
    reader.onerror = () => {
        setError("Error reading file.");
    };

    reader.readAsText(chunk);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{t.uploadTitle}</h2>
        <p className="text-slate-400">{t.uploadSubtitle}</p>
      </div>

      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
          ${isDragging 
            ? 'border-cyan-500 bg-cyan-950/20' 
            : 'border-slate-700 bg-slate-900 hover:border-slate-500'
          }
        `}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p className="text-lg font-medium text-slate-200">
            {t.dragDrop}
          </p>
          <p className="text-sm text-slate-500">
            {t.or}
          </p>
          <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-medium transition-colors border border-slate-700">
            {t.browseFiles}
            <input 
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={(e) => e.target.files && processFile(e.target.files[0])}
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-950/30 border border-red-900/50 rounded-lg text-red-400 flex items-center">
           <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
           {error}
        </div>
      )}

      {/* Demo Data Tip */}
      <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-cyan-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div className="text-sm text-slate-400">
            <p className="font-semibold text-slate-300 mb-1">{t.privacyTitle}</p>
            {t.privacyText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
