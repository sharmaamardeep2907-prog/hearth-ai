export default function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative h-16 w-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-hearth-gold-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-hearth-gold-400 animate-spin" />
        </div>
        <p className="text-sm text-hearth-muted-foreground/50">Loading...</p>
      </div>
    </div>
  );
}