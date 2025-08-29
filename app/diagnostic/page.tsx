import AIDiagnostic from '@/components/debug/AIDiagnostic';

export default function DiagnosticPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">AI Connection Diagnostic</h1>
        <AIDiagnostic />
      </div>
    </div>
  );
}
