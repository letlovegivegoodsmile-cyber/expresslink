import { useState } from "react";
import { trpc } from "@/providers/trpc";
import AuthLayout from "@/components/AuthLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  ClipboardList,
  Package,
  PackageCheck,
  Plus,
  Trash2,
  Truck,
} from "lucide-react";
import {
  SHIPMENT_STATUSES,
  SHIPMENT_STATUS_LABELS,
  FREIGHT_MODES,
  type ShipmentStatus,
} from "@contracts/shipping";

const QUOTE_STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  new: "default",
  quoted: "secondary",
  closed: "outline",
};

const SHIPMENT_BADGE_CLASS: Record<ShipmentStatus, string> = {
  pending: "bg-slate-200 text-slate-700",
  picked_up: "bg-blue-100 text-blue-800",
  in_transit: "bg-orange-100 text-orange-800",
  out_for_delivery: "bg-violet-100 text-violet-800",
  delivered: "bg-emerald-100 text-emerald-800",
};

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function QuotesTab() {
  const utils = trpc.useUtils();
  const quotes = trpc.quotes.list.useQuery();
  const setStatus = trpc.quotes.setStatus.useMutation({
    onSuccess: () => {
      utils.quotes.list.invalidate();
      toast.success("Quote status updated");
    },
    onError: (e) => toast.error(e.message),
  });

  if (quotes.isLoading) return <p className="text-muted-foreground p-4">Loading quotes…</p>;
  if (!quotes.data?.length)
    return (
      <p className="text-muted-foreground p-4">
        No quote requests yet. New submissions from the website form appear here
        instantly.
      </p>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Received</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Route</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead>Details</TableHead>
          <TableHead className="w-[130px]">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quotes.data.map((q) => (
          <TableRow key={q.id}>
            <TableCell className="whitespace-nowrap text-muted-foreground">
              {fmtDate(q.createdAt)}
            </TableCell>
            <TableCell>
              <div className="font-medium">{q.name}</div>
              <div className="text-xs text-muted-foreground">{q.email}</div>
            </TableCell>
            <TableCell className="whitespace-nowrap">
              {q.origin || "—"} → {q.destination || "—"}
            </TableCell>
            <TableCell className="whitespace-nowrap">{q.mode}</TableCell>
            <TableCell className="max-w-[260px] truncate text-muted-foreground">
              {q.message || "—"}
            </TableCell>
            <TableCell>
              <Select
                value={q.status}
                onValueChange={(v) =>
                  setStatus.mutate({
                    id: q.id,
                    status: v as "new" | "quoted" | "closed",
                  })
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(["new", "quoted", "closed"] as const).map((s) => (
                    <SelectItem key={s} value={s}>
                      <Badge variant={QUOTE_STATUS_VARIANT[s]} className="capitalize">
                        {s}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function NewShipmentDialog() {
  const utils = trpc.useUtils();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    origin: "",
    destination: "",
    mode: "Ground transport",
    eta: "",
       goods: "",
    deliveryAddress: "",
    amount: "",
    deliveryTime: "", 
  });
  const create = trpc.shipments.create.useMutation({
    onSuccess: (s) => {
      utils.shipments.list.invalidate();
      toast.success(`Shipment ${s.trackingCode} created`, {
        description: "Give this tracking number to the customer.",
      });
      setOpen(false);
      setForm({ customerName: "", origin: "", destination: "", mode: "Ground transport", eta: "" });
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" /> New shipment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create shipment</DialogTitle>
        </DialogHeader>
        <form
          className="grid gap-4 pt-2"
          onSubmit={(e) => {
            e.preventDefault();
            create.mutate({
              customerName: form.customerName || undefined,
              origin: form.origin,
              destination: form.destination,
              mode: form.mode,
              eta: form.eta || undefined,
            });
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="nsCustomer">Customer name (optional)</Label>
            <Input
              id="nsCustomer"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nsOrigin">Origin *</Label>
              <Input
                id="nsOrigin"
                required
                placeholder="Dallas, TX"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nsDest">Destination *</Label>
              <Input
                id="nsDest"
                required
                placeholder="Rotterdam, NL"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Mode</Label>
              <Select
                value={form.mode}
                onValueChange={(v) => setForm({ ...form, mode: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FREIGHT_MODES.slice(0, 4).map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nsEta">ETA (optional)</Label>
              <Input
                id="nsEta"
                placeholder="Oct 12"
                value={form.eta}
                onChange={(e) => setForm({ ...form, eta: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Creating…" : "Create & generate tracking code"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ShipmentsTab() {
  const utils = trpc.useUtils();
  const shipments = trpc.shipments.list.useQuery();
  const updateStatus = trpc.shipments.updateStatus.useMutation({
    onSuccess: (s) => {
      utils.shipments.list.invalidate();
      toast.success(`${s?.trackingCode} → ${SHIPMENT_STATUS_LABELS[s?.status as ShipmentStatus] ?? s?.status}`);
    },
    onError: (e) => toast.error(e.message),
  });
  const remove = trpc.shipments.delete.useMutation({
    onSuccess: () => {
      utils.shipments.list.invalidate();
      toast.success("Shipment deleted");
    },
    onError: (e) => toast.error(e.message),
  });

  if (shipments.isLoading)
    return <p className="text-muted-foreground p-4">Loading shipments…</p>;
  if (!shipments.data?.length)
    return (
      <p className="text-muted-foreground p-4">
        No shipments yet. Create one and hand the tracking code to your customer —
        they can track it live from the homepage.
      </p>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tracking code</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Route</TableHead>
          <TableHead>Mode</TableHead>
          <TableHead>ETA</TableHead>
          <TableHead className="w-[170px]">Status</TableHead>
          <TableHead className="w-[60px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {shipments.data.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="font-mono font-semibold">
              {s.trackingCode}
            </TableCell>
            <TableCell>{s.customerName || "—"}</TableCell>
            <TableCell className="whitespace-nowrap">
              {s.origin} → {s.destination}
            </TableCell>
            <TableCell className="whitespace-nowrap">{s.mode}</TableCell>
            <TableCell>{s.eta || "—"}</TableCell>
            <TableCell>
              <Select
                value={s.status}
                onValueChange={(v) =>
                  updateStatus.mutate({
                    id: s.id,
                    status: v as ShipmentStatus,
                    location: v === "delivered" ? s.destination : undefined,
                  })
                }
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SHIPMENT_STATUSES.map((st) => (
                    <SelectItem key={st} value={st}>
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${SHIPMENT_BADGE_CLASS[st]}`}
                      >
                        {SHIPMENT_STATUS_LABELS[st]}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  if (window.confirm(`Delete shipment ${s.trackingCode}?`)) {
                    remove.mutate({ id: s.id });
                  }
                }}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DashboardContent() {
  const quotes = trpc.quotes.list.useQuery();
  const shipments = trpc.shipments.list.useQuery();

  const newQuotes = quotes.data?.filter((q) => q.status === "new").length ?? 0;
  const activeShipments =
    shipments.data?.filter((s) => s.status !== "delivered").length ?? 0;
  const delivered = shipments.data?.filter((s) => s.status === "delivered").length ?? 0;

  const cards = [
    { label: "New quote requests", value: newQuotes, icon: ClipboardList },
    { label: "Total quotes", value: quotes.data?.length ?? 0, icon: Package },
    { label: "Active shipments", value: activeShipments, icon: Truck },
    { label: "Delivered", value: delivered, icon: PackageCheck },
  ];

  return (
    <div className="grid gap-6 p-2">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Operations Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Quote requests and live shipments — Express Link Logistics
          </p>
        </div>
        <NewShipmentDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {c.label}
              </CardTitle>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="quotes">
        <TabsList>
          <TabsTrigger value="quotes">
            Quote requests
            {newQuotes > 0 && (
              <Badge className="ml-2" variant="default">
                {newQuotes}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
        </TabsList>
        <TabsContent value="quotes">
          <Card>
            <CardContent className="p-0 sm:p-2">
              <QuotesTab />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="shipments">
          <Card>
            <CardContent className="p-0 sm:p-2">
              <ShipmentsTab />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function Admin() {
  return (
    <AuthLayout>
      <DashboardContent />
      <Toaster />
    </AuthLayout>
  );
}
