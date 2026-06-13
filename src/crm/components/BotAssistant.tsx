import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/crm/components/ui/button";
import { Input } from "@/crm/components/ui/input";
import { Card } from "@/crm/components/ui/card";
import { Badge } from "@/crm/components/ui/badge";
import { Bot, X, Send, Mic, CheckCircle2, Loader2, Edit3, Save, Search } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/crm/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/crm/components/ui/select";

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  content: string;
  extractedData?: ExtractedData;
  isEditing?: boolean;
}

interface ExtractedData {
  name: string;
  phone: string;
  clientMatch: string | null;
  clientId: string | null;
  isDuplicate: boolean;
}

function parseInput(text: string, clientList: any[]): ExtractedData {
  const phoneMatch = text.match(/(\+?\d[\d\s-]{8,14}\d)/);
  const phone = phoneMatch ? phoneMatch[1].replace(/\s/g, "") : "";

  let clientMatch: string | null = null;
  let clientId: string | null = null;
  const lowerText = text.toLowerCase();

  // Try matching client name in text or text in client name
  for (const c of clientList) {
    const nameLower = (c.company_name || "").toLowerCase();
    
    // Exact match or contains
    if (lowerText.includes(nameLower) && nameLower.length > 2) {
      clientMatch = c.company_name;
      clientId = c.id;
      break;
    }
    
    // Check for "for X" where X matches a client start
    const forMatch = text.match(/(?:for|to|at|with)\s+([a-zA-Z0-9]+)/i);
    if (forMatch) {
      const keyword = forMatch[1].toLowerCase();
      if (nameLower.includes(keyword) && keyword.length > 2) {
        clientMatch = c.company_name;
        clientId = c.id;
        break;
      }
    }
  }

  let name = "";
  if (phoneMatch) {
    const beforePhone = text.substring(0, text.indexOf(phoneMatch[0])).trim();
    name = beforePhone.replace(/[,]/g, "").trim();
  }
  if (!name) {
    const words = text.split(/[\s,]+/).filter(w => /^[A-Z]/.test(w) && !/^\d/.test(w));
    name = words.slice(0, 2).join(" ");
  }

  return { name, phone, clientMatch, clientId, isDuplicate: false };
}

export function BotAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "bot", content: "Hi! I'm your field assistant. Type or speak a candidate's details and I'll add them to the CRM.\n\nExample: \"Rahul Kumar, 9876543210, for Lava\"" }
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: clients = [] } = useQuery({
    queryKey: ["clients-minimal"],
    queryFn: async () => {
      const res = await api.get('/clients');
      return Array.isArray(res.data) ? res.data : (res.data?.data || []);
    }
  });

  const addCandidateMutation = useMutation({
    mutationFn: async (data: ExtractedData) => {
      const candidateRes = await api.post('/candidates', {
        name: data.name,
        phone: data.phone,
        email: `${data.name.toLowerCase().replace(/\s/g, '.')}@temp.com`,
        client_id: data.clientId,
        source: "Field Assistant",
        status: "new_lead"
      });
      return candidateRes.data;
    },
    onSuccess: (data, variables) => {
      toast.success(`Candidate "${variables.name}" added successfully!`);
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      if (variables.clientId) {
        queryClient.invalidateQueries({ queryKey: ["pipeline", variables.clientId] });
      }
      setMessages(prev => [...prev, {
        id: `b${Date.now()}`,
        role: "bot",
        content: `✅ Done! ${variables.name} is now a New Lead for ${variables.clientMatch}.`
      }]);
    }
  });

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: `u${Date.now()}`, role: "user", content: input };
    const extracted = parseInput(input, clients);

    const botMsg: ChatMessage = {
      id: `b${Date.now()}`,
      role: "bot",
      content: (extracted.name || extracted.phone) 
        ? `Extracted: ${extracted.name}. Confirm details below:` 
        : "I couldn't get details. Try: \"Name, 9988776655, for Client\"",
      extractedData: (extracted.name || extracted.phone) ? extracted : undefined,
    };

    setMessages(prev => [...prev, userMsg, botMsg]);
    setInput("");
  };

  const handleConfirm = (data: ExtractedData) => {
    if (!data.clientId) {
      toast.error("Please select a client first using the Edit button.");
      return;
    }
    addCandidateMutation.mutate(data);
  };

  const toggleEdit = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isEditing: !m.isEditing } : m));
  };

  const updateExtracted = (msgId: string, field: keyof ExtractedData, value: any) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId && m.extractedData) {
        const newData = { ...m.extractedData, [field]: value };
        if (field === 'clientId') {
          const client = clients.find((c: any) => c.id === value);
          newData.clientMatch = client ? client.company_name : null;
        }
        return { ...m, extractedData: newData };
      }
      return m;
    }));
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="fixed bottom-5 right-5 h-12 w-12 rounded-full shadow-lg z-50 p-0">
        <Bot className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-5 right-5 w-80 h-[520px] shadow-2xl z-50 flex flex-col rounded-2xl overflow-hidden border bg-background animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between px-4 py-4 bg-primary text-primary-foreground">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider">Field AI Assistant</span>
        </div>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-primary-foreground hover:bg-white/20" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[90%] rounded-2xl px-4 py-3 text-xs shadow-sm ${
              msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted text-foreground rounded-tl-none"
            }`}>
              <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
              {msg.extractedData && !addCandidateMutation.isSuccess && (
                <div className="mt-4 p-3 bg-card rounded-xl border-2 border-primary/10 space-y-3">
                  {msg.isEditing ? (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground">NAME</label>
                        <Input className="h-8 text-xs font-medium" value={msg.extractedData.name} onChange={e => updateExtracted(msg.id, 'name', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground">PHONE</label>
                        <Input className="h-8 text-xs font-medium" value={msg.extractedData.phone} onChange={e => updateExtracted(msg.id, 'phone', e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground">CLIENT</label>
                        <Select value={msg.extractedData.clientId || "none"} onValueChange={v => updateExtracted(msg.id, 'clientId', v === "none" ? null : v)}>
                          <SelectTrigger className="h-8 text-xs font-medium"><SelectValue placeholder="Select Client" /></SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            <SelectItem value="none" className="text-xs">No Match</SelectItem>
                            {clients.map((c: any) => <SelectItem key={c.id} value={c.id} className="text-xs">{c.company_name}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button size="sm" className="h-8 w-full text-xs font-bold gap-2" onClick={() => toggleEdit(msg.id)}>
                        <Save className="h-3.5 w-3.5" /> SAVE & CONTINUE
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2 border-b pb-3 border-dashed">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-muted-foreground">CANDIDATE</span>
                          <span className="font-bold text-sm">{msg.extractedData.name || "—"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-muted-foreground">PHONE</span>
                          <span className="font-medium">{msg.extractedData.phone || "—"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-muted-foreground">CLIENT</span>
                          <Badge variant={msg.extractedData.clientId ? "default" : "destructive"} className="text-[9px] px-1.5 py-0">
                            {msg.extractedData.clientMatch || "NOT MATCHED"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          disabled={addCandidateMutation.isPending} 
                          className="h-9 text-xs font-bold flex-1 bg-primary shadow-md hover:translate-y-[-1px] transition-transform" 
                          onClick={() => handleConfirm(msg.extractedData!)}
                        >
                          {addCandidateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "CONFIRM"}
                        </Button>
                        <Button variant="outline" size="sm" className="h-9 text-xs font-bold flex-1 gap-1.5" onClick={() => toggleEdit(msg.id)}>
                          <Edit3 className="h-3.5 w-3.5" /> EDIT
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t bg-muted/30 flex gap-2">
        <div className="relative flex-1">
          <Input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === "Enter" && handleSend()} 
            placeholder="Type: Rahul, 8764567654, for Lava" 
            className="h-10 text-xs pl-3 pr-10 rounded-xl bg-background border-primary/20 focus-visible:ring-primary" 
          />
          <Mic className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
        </div>
        <Button size="sm" className="h-10 w-10 p-0 rounded-xl shadow-lg" onClick={handleSend} disabled={addCandidateMutation.isPending}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
