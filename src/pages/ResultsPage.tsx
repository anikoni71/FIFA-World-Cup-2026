import MatchResultsWorkstation from '../components/MatchResultsWorkstation';

export default function ResultsPage() {
  return (
    <div className="bg-[#0a0f16] text-white overflow-y-auto" style={{ minHeight: '-webkit-fill-available', height: '100dvh' }}>
      <MatchResultsWorkstation />
    </div>
  );
}
