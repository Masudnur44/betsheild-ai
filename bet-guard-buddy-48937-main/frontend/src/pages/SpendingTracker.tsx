import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SpendingTracker() {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [entries, setEntries] = useState([]);

  // Handle submit
  const handleAddEntry = (e) => {
    e.preventDefault();

    if (!amount || !date || !description) {
      alert("Please fill in all fields");
      return;
    }

    const newEntry = {
      id: Date.now(),
      amount,
      date,
      description,
    };

    setEntries([newEntry, ...entries]);

    // Clear inputs
    setAmount("");
    setDate("");
    setDescription("");
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
          Spending Tracker
        </h1>
        <p className="text-muted-foreground">
          Track and monitor your gambling spending
        </p>
      </div>

      <Card className="p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add Spending Entry</h2>
        <form className="space-y-4" onSubmit={handleAddEntry}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button type="submit" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Recent Entries</h2>

        {entries.length === 0 ? (
          <Card className="p-6 shadow-lg">
            <p className="text-muted-foreground text-center py-8">
              No spending entries yet. Add your first entry above.
            </p>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="p-4 shadow-md flex justify-between items-center">
              <div>
                <p className="font-semibold">KSh {entry.amount}</p>
                <p className="text-sm text-muted-foreground">{entry.description}</p>
                <p className="text-xs text-muted-foreground">{entry.date}</p>
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteEntry(entry.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
