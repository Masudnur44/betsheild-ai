import { useState } from "react";
import { ScanLine } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function URLScanner() {
  const [url, setUrl] = useState("");
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // MOCK intelligent detection
  const detectGambling = async (url: string) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simple heuristic: if domain contains gambling keywords or known patterns
    const gamblingPatterns = [
      "bet",
      "casino",
      "stake",
      "odds",
      "pesa",
      "lotto",
      "gamble",
    ];

    const domain = url.replace(/^https?:\/\//, "").split("/")[0].toLowerCase();

    // Return true if any pattern matches the domain
    const isGambling = gamblingPatterns.some((p) => domain.includes(p));

    return isGambling;
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    const isGambling = await detectGambling(url);

    const result = {
      url,
      isGambling,
      scannedAt: new Date().toLocaleString(),
    };

    setScanHistory([result, ...scanHistory]);
    setUrl("");
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          URL Scanner
        </h1>
        <p className="text-muted-foreground">
          Scan URLs to detect gambling websites
        </p>
      </div>

      {/* Scanner */}
      <Card className="p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Scan URL</h2>
        <form onSubmit={handleScan} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
              <Button type="submit" className="gap-2" disabled={loading}>
                <ScanLine className="h-4 w-4" />
                {loading ? "Scanning..." : "Scan"}
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Scan History */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Scan History</h2>
        <Card className="p-6 shadow-lg space-y-4">
          {scanHistory.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No scan history yet. Scan a URL above to get started.
            </p>
          ) : (
            scanHistory.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-3 last:border-none"
              >
                <div>
                  <p className="font-medium">{item.url}</p>
                  <p className="text-xs text-muted-foreground">
                    Scanned: {item.scannedAt}
                  </p>
                </div>

                <Badge
                  variant={item.isGambling ? "destructive" : "secondary"}
                  className="text-sm"
                >
                  {item.isGambling ? "Gambling Site" : "Safe"}
                </Badge>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}
