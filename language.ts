

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'id';

export const TRANSLATIONS = {
  en: {
    // Layout
    appName: "HyperTune AI",
    aboutTitle: "About HyperTune AI",
    aboutText: "HyperTune AI is an intelligent SaaS platform designed to democratize machine learning optimization. We simplify the complex process of hyperparameter tuning by providing an intuitive interface that connects your data with powerful tuning algorithms like Random Search and Bayesian Optimization.",
    howItWorksTitle: "How It Works",
    featUpload: "Secure Upload:",
    featUploadDesc: "Your data is processed locally to extract schema information.",
    featConfig: "Smart Configuration:",
    featConfigDesc: "Select from a wide range of models including XGBoost, SVM, and Random Forest.",
    featCode: "Instant Code:",
    featCodeDesc: "Receive a downloadable, optimized Python script tailored to your specific dataset.",
    footerText: "HyperTune AI. Built for the modern ML workflow.",

    // FileUpload
    uploadTitle: "Upload Dataset",
    uploadSubtitle: "Upload your CSV file to begin analysis (Max 50GB)",
    dragDrop: "Drag & drop your dataset here",
    or: "or",
    browseFiles: "Browse Files",
    onlyCsv: "Only CSV files are supported at this time.",
    fileTooBig: "File size limit exceeded (Max 50GB).",
    privacyTitle: "Privacy Note",
    privacyText: "Your data is processed locally in the browser to extract headers. Only the schema and small sample rows are sent to the tuning engine for metadata analysis.",

    // ModelConfig
    configTitle: "Configure Experiment",
    rows: "rows",
    selectDataset: "Select Different Dataset",
    targetVar: "Target Variable",
    analyzing: "AI is analyzing schema...",
    selectModel: "Select Model Architecture",
    options: "options",
    hyperparams: "Hyperparameter Search Space",
    preset: "Preset:",
    custom: "Custom",
    tuningStrategy: "Tuning Strategy",
    advancedConfig: "Advanced Configuration",
    nTrials: "Number of Trials",
    cvFolds: "Cross-Validation Folds",
    runs: "runs",
    folds: "folds",
    trialsDesc: "Total iterations. Higher values search more space but take longer.",
    foldsDesc: "Splits data for validation. Higher values reduce overfitting risk.",
    launchBtn: "Launch Optimization Engine",
    dataPreview: "Data Preview",
    totalSamples: "Total Samples:",
    tuningTips: "Tuning Tips",
    tip1: "Bayesian Optimization is generally 3-5x more efficient than Random Search for complex models like XGBoost.",
    tip2: "Use 5+ CV Folds for datasets smaller than 1,000 rows to ensure the score is reliable.",
    tip3: "The 'High Accuracy' preset explores a wider hyperparameter space but requires more trials.",

    // Dashboard
    optimizing: "Optimization in Progress...",
    tuningModel: "Tuning Model",
    genScript: "Generating Script",
    bootInit: "Initializing secure worker environment...",
    bootAlloc: "Allocating GPU/CPU resources...",
    bootLoad: "Loading dataset into memory...",
    bootValid: "Validating schema compatibility...",
    bootSetup: "Setting up cross-validation strategy...",
    bootImport: "Importing machine learning libraries...",
    bootConnect: "Establishing connection to optimization engine...",
    bootStart: "System boot sequence initiated.",
    optSuccess: "Optimization plan generated successfully.",
    startTrials: "Starting trials...",
    optComplete: "Optimization complete.",
    finalize: "Finalizing artifact...",
    
    // Results
    resTitle: "Optimization Complete",
    resSubtitle: "Your model has been tuned and is ready for deployment.",
    bestScore: "Best Validation Score",
    bestConfig: "Best Configuration",
    exportJson: "Export JSON",
    deployGuide: "Deployment Guide",
    step1: "Generate Model Artifact",
    step1Desc: "Running the script will save a model.pkl file locally.",
    step2: "Load for Inference",
    genScriptLabel: "Generated Python Script",
    execLogs: "Execution Logs",
    clickCollapse: "Click to collapse",
    clickExpand: "Click to expand",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
    startNew: "Start New Experiment",
    
    // SHAP
    shapTitle: "Model Explainability (SHAP)",
    shapSubtitle: "Generate visualization code to understand your model's decisions.",
    genShapBtn: "Generate SHAP Code",
    shapGenerating: "Writing Explainability Script...",
    shapCodeLabel: "SHAP Visualization Script",
    shapTip: "Requires 'pip install shap matplotlib'. Assumes 'model.pkl' and 'dataset.csv' are in the same directory.",

    // Error Boundary
    errorTitle: "Unexpected Error",
    errorGeneric: "An unexpected error occurred during the process.",
    retry: "Retry Operation",
    goBack: "Return to Configuration",

    // Access Gate
    gateTitle: "Limit Reached",
    gateSubtitle: "You have used your free trials. Enter access code to continue.",
    enterCode: "Access Code",
    unlock: "Unlock Platform",
    verifying: "Verifying...",
    invalidCode: "Invalid Access Code.",
    poweredBy: "Powered by Gemini AI • Valid session: 24h",
    adminWelcome: "Welcome back, Admin.",
    noCode: "Don't have an access code?",
    contactAdmin: "Get one here",
    
    // Admin Panel
    adminDashboard: "Admin Console",
    generateCode: "Generate User Code",
    enterPlatform: "Enter Platform",
    newCodeLabel: "New Access Code:",
    adminUserLabel: "User Name / ID",
    adminDurationLabel: "Validity Duration",
    days: "Days",
  },
  id: {
    // Layout
    appName: "HyperTune AI",
    aboutTitle: "Tentang HyperTune AI",
    aboutText: "HyperTune AI adalah platform SaaS cerdas yang dirancang untuk mendemokratisasi optimasi machine learning. Kami menyederhanakan proses tuning hyperparameter yang kompleks dengan menyediakan antarmuka intuitif yang menghubungkan data Anda dengan algoritma tuning canggih seperti Random Search dan Bayesian Optimization.",
    howItWorksTitle: "Cara Kerja",
    featUpload: "Unggah Aman:",
    featUploadDesc: "Data Anda diproses secara lokal untuk mengekstrak informasi skema.",
    featConfig: "Konfigurasi Cerdas:",
    featConfigDesc: "Pilih dari berbagai model termasuk XGBoost, SVM, dan Random Forest.",
    featCode: "Kode Instan:",
    featCodeDesc: "Dapatkan skrip Python yang dioptimalkan dan siap pakai untuk dataset Anda.",
    footerText: "HyperTune AI. Dibangun untuk alur kerja ML modern.",

    // FileUpload
    uploadTitle: "Unggah Dataset",
    uploadSubtitle: "Unggah file CSV Anda untuk memulai analisis (Maks 50GB)",
    dragDrop: "Seret & lepas dataset Anda di sini",
    or: "atau",
    browseFiles: "Jelajahi File",
    onlyCsv: "Hanya file CSV yang didukung saat ini.",
    fileTooBig: "Batas ukuran file terlampaui (Maks 50GB).",
    privacyTitle: "Catatan Privasi",
    privacyText: "Data Anda diproses secara lokal di browser untuk mengekstrak header. Hanya skema dan sampel baris kecil yang dikirim ke mesin tuning untuk analisis metadata.",

    // ModelConfig
    configTitle: "Konfigurasi Eksperimen",
    rows: "baris",
    selectDataset: "Pilih Dataset Lain",
    targetVar: "Variabel Target",
    analyzing: "AI sedang menganalisis skema...",
    selectModel: "Pilih Arsitektur Model",
    options: "opsi",
    hyperparams: "Ruang Pencarian Hyperparameter",
    preset: "Preset:",
    custom: "Kustom",
    tuningStrategy: "Strategi Tuning",
    advancedConfig: "Konfigurasi Lanjutan",
    nTrials: "Jumlah Percobaan",
    cvFolds: "Fold Cross-Validation",
    runs: "jalan",
    folds: "fold",
    trialsDesc: "Total iterasi. Nilai lebih tinggi mencari lebih banyak ruang tetapi memakan waktu lebih lama.",
    foldsDesc: "Membagi data untuk validasi. Nilai lebih tinggi mengurangi risiko overfitting.",
    launchBtn: "Jalankan Mesin Optimasi",
    dataPreview: "Pratinjau Data",
    totalSamples: "Total Sampel:",
    tuningTips: "Tips Tuning",
    tip1: "Bayesian Optimization umumnya 3-5x lebih efisien daripada Random Search untuk model kompleks seperti XGBoost.",
    tip2: "Gunakan 5+ CV Fold untuk dataset lebih kecil dari 1.000 baris untuk memastikan skor dapat diandalkan.",
    tip3: "Preset 'High Accuracy' mengeksplorasi ruang hyperparameter yang lebih luas tetapi membutuhkan lebih banyak percobaan.",

    // Dashboard
    optimizing: "Optimasi Sedang Berjalan...",
    tuningModel: "Tuning Model",
    genScript: "Membuat Skrip",
    bootInit: "Menginisialisasi lingkungan worker aman...",
    bootAlloc: "Mengalokasikan sumber daya GPU/CPU...",
    bootLoad: "Memuat dataset ke memori...",
    bootValid: "Memvalidasi kompatibilitas skema...",
    bootSetup: "Menyiapkan strategi cross-validation...",
    bootImport: "Mengimpor pustaka machine learning...",
    bootConnect: "Membangun koneksi ke mesin optimasi...",
    bootStart: "Urutan boot sistem dimulai.",
    optSuccess: "Rencana optimasi berhasil dibuat.",
    startTrials: "Memulai percobaan...",
    optComplete: "Optimasi selesai.",
    finalize: "Menyelesaikan artefak...",

    // Results
    resTitle: "Optimasi Selesai",
    resSubtitle: "Model Anda telah dituning dan siap untuk deployment.",
    bestScore: "Skor Validasi Terbaik",
    bestConfig: "Konfigurasi Terbaik",
    exportJson: "Ekspor JSON",
    deployGuide: "Panduan Deployment",
    step1: "Hasilkan Artefak Model",
    step1Desc: "Menjalankan skrip akan menyimpan file model.pkl secara lokal.",
    step2: "Muat untuk Inferensi",
    genScriptLabel: "Skrip Python yang Dihasilkan",
    execLogs: "Log Eksekusi",
    clickCollapse: "Klik untuk menutup",
    clickExpand: "Klik untuk membuka",
    copy: "Salin",
    copied: "Disalin",
    download: "Unduh",
    startNew: "Mulai Eksperimen Baru",

    // SHAP
    shapTitle: "Interpretabilitas Model (SHAP)",
    shapSubtitle: "Hasilkan kode visualisasi untuk memahami keputusan model Anda.",
    genShapBtn: "Buat Kode SHAP",
    shapGenerating: "Menulis Skrip Interpretabilitas...",
    shapCodeLabel: "Skrip Visualisasi SHAP",
    shapTip: "Memerlukan 'pip install shap matplotlib'. Asumsi 'model.pkl' dan 'dataset.csv' ada di direktori yang sama.",

    // Error Boundary
    errorTitle: "Kesalahan Tidak Terduga",
    errorGeneric: "Terjadi kesalahan yang tidak terduga selama proses.",
    retry: "Coba Lagi",
    goBack: "Kembali ke Konfigurasi",

    // Access Gate
    gateTitle: "Batas Terlampaui",
    gateSubtitle: "Anda telah menggunakan percobaan gratis. Masukkan kode akses untuk melanjutkan.",
    enterCode: "Kode Akses",
    unlock: "Buka Platform",
    verifying: "Memverifikasi...",
    invalidCode: "Kode Akses Tidak Valid.",
    poweredBy: "Didukung oleh Gemini AI • Sesi valid: 24h",
    adminWelcome: "Selamat datang kembali, Admin.",
    noCode: "Belum punya kode akses?",
    contactAdmin: "Dapatkan di sini",

    // Admin Panel
    adminDashboard: "Konsol Admin",
    generateCode: "Buat Kode User",
    enterPlatform: "Masuk Platform",
    newCodeLabel: "Kode Akses Baru:",
    adminUserLabel: "Nama User / ID",
    adminDurationLabel: "Durasi Aktif",
    days: "Hari",
  }
};

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
  t: typeof TRANSLATIONS['en'];
}

// Export the context so it can be used in class components via Consumer
export const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'id' : 'en');
  };

  const t = TRANSLATIONS[language];

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, toggleLanguage, t } },
    children
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};