'use client';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [step, setStep] = useState<'home' | 'upload' | 'results'>('home');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const analyzeCompliance = async () => {
    if (!file) return;
    setAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analyze',
