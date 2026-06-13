import { useState } from "react";
import { AppLayout } from "@/crm/components/AppLayout";
import { Card } from "@/crm/components/ui/card";
import { Button } from "@/crm/components/ui/button";
import { Input } from "@/crm/components/ui/input";
import { Textarea } from "@/crm/components/ui/textarea";
import { Badge } from "@/crm/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/crm/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/crm/components/ui/tabs";
import { MessageSquare, Mail, Phone, Send, Clock, CheckCheck, X, FileText } from "lucide-react";

const messageHistory = [
  { id: "1", candidate: "Priya Sharma", channel: "WhatsApp", message: "Hi Priya, you have been shortlisted for Frontend Developer role at TechCorp.", time: "10:30 AM", status: "delivered" },
  { id: "2", candidate: "Rahul Verma", channel: "Email", message: "Interview Confirmation - Backend Developer Position", time: "9:45 AM", status: "read" },
  { id: "3", candidate: "Anjali Patel", channel: "SMS", message: "Reminder: Your interview is scheduled for tomorrow at 2 PM.", time: "Yesterday", status: "delivered" },
  { id: "4", candidate: "Vikram Singh", channel: "WhatsApp", message: "Congratulations! Your offer letter is ready. Please check your email.", time: "Yesterday", status: "read" },
  { id: "5", candidate: "Deepak Joshi", channel: "Phone", message: "Called for screening - No answer", time: "2 days ago", status: "failed" },
];

const templates = [
  { id: "1", name: "Interview Invitation", channel: "WhatsApp", content: "Hi {name}, you've been shortlisted for {job_title} at {client}. Interview on {date} at {time}. Reply YES to confirm." },
  { id: "2", name: "Offer Letter", channel: "Email", content: "Dear {name}, We're pleased to offer you the position of {job_title}..." },
  { id: "3", name: "Follow Up", channel: "SMS", content: "Hi {name}, just checking in about the {job_title} opportunity. Are you still interested?" },
  { id: "4", name: "Joining Reminder", channel: "WhatsApp", content: "Hi {name}, this is a reminder that your joining date is {date}. Please carry all required documents." },
];

const channelIcon: Record<string, React.ReactNode> = {
  WhatsApp: <MessageSquare className="h-3.5 w-3.5 text-success" />,
  Email: <Mail className="h-3.5 w-3.5 text-info" />,
  SMS: <Phone className="h-3.5 w-3.5 text-warning" />,
  Phone: <Phone className="h-3.5 w-3.5 text-primary" />,
};

const statusIcon: Record<string, React.ReactNode> = {
  delivered: <CheckCheck className="h-3 w-3 text-muted-foreground" />,
  read: <CheckCheck className="h-3 w-3 text-info" />,
  failed: <X className="h-3 w-3 text-destructive" />,
};

export default function Communications() {
  return (
    <AppLayout title="Communications" subtitle="Manage all candidate communications">
      <div className="space-y-4 animate-fade-in">
        <Tabs defaultValue="inbox" className="w-full">
          <TabsList className="bg-card border">
            <TabsTrigger value="inbox" className="text-xs">Inbox</TabsTrigger>
            <TabsTrigger value="compose" className="text-xs">Compose</TabsTrigger>
            <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="inbox" className="mt-4">
            <Card>
              <div className="divide-y">
                {messageHistory.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 p-4 hover:bg-muted/30 cursor-pointer transition-colors">
                    <div className="mt-0.5">{channelIcon[msg.channel]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-card-foreground">{msg.candidate}</p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          {statusIcon[msg.status]}
                          <span>{msg.time}</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0">{msg.channel}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="compose" className="mt-4">
            <Card className="p-4">
              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Channel</label>
                  <Select defaultValue="whatsapp">
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">To</label>
                  <Input placeholder="Search candidate..." className="h-8 text-xs" />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Template (optional)</label>
                  <Select>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(t => (
                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Message</label>
                  <Textarea placeholder="Type your message..." className="text-xs min-h-[120px]" />
                </div>
                <Button size="sm" className="text-xs gap-1.5">
                  <Send className="h-3.5 w-3.5" /> Send Message
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((t) => (
                <Card key={t.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <h4 className="text-sm font-medium text-card-foreground">{t.name}</h4>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">{t.channel}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t.content}</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="text-xs h-7">Edit</Button>
                    <Button size="sm" variant="outline" className="text-xs h-7">Use</Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
