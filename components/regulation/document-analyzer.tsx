'use client';

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Loader2, 
  CheckCircle,
  AlertTriangle,
  Bot,
  ClipboardList,
  Key,
  Download,
  Eye,
  Brain
} from 'lucide-react';

interface AnalysisResult {
  id: string;
  summary: string;
  keyPoints: string[];
  complianceChecklist: string[];
  message: string;
}

export function DocumentAnalyzer() {
  const [analysisMethod, setAnalysisMethod] = useState<'upload' | 'paste'>('paste');
  const [fileName, setFileName] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setDocumentText(text);
      };
      reader.readAsText(file);
    } else if (file.type === 'application/pdf') {
      // For PDF files, we would need a PDF parser
      // For now, show a message asking to paste text content
      alert('PDF parsing is not yet implemented. Please copy and paste the text content manually.');
      setAnalysisMethod('paste');
    } else {
      alert('Please upload a text file (.txt) or paste the content manually.');
    }
  };

  const analyzeDocument = async () => {
    if (!documentText.trim() || !uploaderName.trim()) {
      alert('Please provide document text and your name.');
      return;
    }

    if (!fileName && analysisMethod === 'paste') {
      setFileName('Pasted Document');
    }

    try {
      setAnalyzing(true);
      setResult(null);

      const response = await fetch('/api/regulation/analyze-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: documentText,
          fileName: fileName || 'Untitled Document',
          uploadedBy: uploaderName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Document analysis error:', error);
      alert('Failed to analyze document. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const resetForm = () => {
    setDocumentText('');
    setFileName('');
    setUploaderName('');
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Document Analyzer
          </CardTitle>
          <CardDescription>
            Upload or paste mining compliance documents for AI-powered analysis and checklist generation
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Analysis Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analyze Document</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Method Selection */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={analysisMethod === 'paste' ? 'default' : 'outline'}
              onClick={() => setAnalysisMethod('paste')}
              className="h-24 flex-col"
            >
              <FileText className="h-6 w-6 mb-2" />
              <span>Paste Text</span>
            </Button>
            <Button
              variant={analysisMethod === 'upload' ? 'default' : 'outline'}
              onClick={() => setAnalysisMethod('upload')}
              className="h-24 flex-col"
            >
              <Upload className="h-6 w-6 mb-2" />
              <span>Upload File</span>
            </Button>
          </div>

          <Separator />

          {/* Upload Method */}
          {analysisMethod === 'upload' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Upload Document</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".txt,.pdf"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="mt-1"
                />
                <p className="text-sm text-slate-500 mt-1">
                  Supported formats: .txt files (PDF parsing coming soon)
                </p>
              </div>

              {fileName && (
                <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    File uploaded: <strong>{fileName}</strong>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Paste Method */}
          {analysisMethod === 'paste' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="document-name">Document Name (Optional)</Label>
                <Input
                  id="document-name"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g., Mining Safety Protocol V2.1"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="document-text">Document Content</Label>
                <Textarea
                  id="document-text"
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                  placeholder="Paste your mining compliance document content here..."
                  className="mt-1 min-h-[200px]"
                />
                <p className="text-sm text-slate-500 mt-1">
                  {documentText.length} characters
                </p>
              </div>
            </div>
          )}

          {/* Uploader Information */}
          <div>
            <Label htmlFor="uploader-name">Your Name</Label>
            <Input
              id="uploader-name"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              placeholder="Enter your name for tracking purposes"
              className="mt-1"
            />
          </div>

          {/* AI Disclaimer */}
          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <Bot className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>AI Analysis:</strong> Our Gemini AI will analyze your document and generate a summary, 
              key compliance points, and a checklist. All results are saved for admin review before publication.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={analyzeDocument}
              disabled={analyzing || !documentText.trim() || !uploaderName.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Document
                </>
              )}
            </Button>
            
            <Button variant="outline" onClick={resetForm}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <CheckCircle className="h-5 w-5" />
                    Analysis Complete
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <Eye className="h-3 w-3 mr-1" />
                    Pending Review
                  </Badge>
                </div>
                <CardDescription>
                  {result.message}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Summary
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {result.summary}
                  </p>
                </div>

                <Separator />

                {/* Key Points */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Key Compliance Points
                  </h3>
                  <ul className="space-y-2">
                    {result.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Compliance Checklist */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Compliance Checklist
                  </h3>
                  <ul className="space-y-2">
                    {result.complianceChecklist.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-4 h-4 border border-slate-300 rounded mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <Alert className="flex-1 mr-4 bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 dark:text-amber-200">
                      Results are saved for admin review before publication
                    </AlertDescription>
                  </Alert>
                  
                  <Button variant="outline" onClick={() => setResult(null)}>
                    Analyze Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 border-purple-200 dark:border-purple-800">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Advanced Gemini AI analyzes your documents for compliance insights
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <ClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Compliance Checklists</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Generate actionable checklists for mining compliance requirements
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">Expert Review</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                All AI-generated results are reviewed by compliance experts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
