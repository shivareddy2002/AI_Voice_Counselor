export interface ConversationEntry {
  id: number;
  userText: string;
  aiText: string;
}

interface ConversationHistoryProps {
  entries: ConversationEntry[];
}

export function ConversationHistory({ entries }: ConversationHistoryProps) {
  if (entries.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground">Recent Conversations</h3>
      {entries.map((entry) => (
        <div key={entry.id} className="rounded-lg border bg-card p-3 space-y-2 animate-in fade-in duration-300">
          <div className="flex gap-2">
            <span className="text-xs font-medium text-primary">You:</span>
            <p className="text-xs text-foreground">{entry.userText}</p>
          </div>
          <div className="flex gap-2">
            <span className="text-xs font-medium text-muted-foreground">AI:</span>
            <p className="text-xs text-muted-foreground leading-relaxed">{entry.aiText}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
