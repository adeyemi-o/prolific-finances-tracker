import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase-client";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import { Navigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const EVENT_TYPES = ["create", "update", "delete"];

function renderUpdateDiff(previous: any, current: any) {
  let prev = {};
  let curr = {};
  try {
    prev = previous ? JSON.parse(previous) : {};
  } catch { prev = {}; }
  try {
    curr = current ? JSON.parse(current) : {};
  } catch { curr = {}; }
  // Only show these fields
  const fieldMap = {
    amount: 'Amount',
    category: 'Category',
    details: 'Details',
  };
  const fields = Object.keys(fieldMap);
  return (
    <div className="space-y-1">
      {fields.every((key) => prev[key] === undefined && curr[key] === undefined) && (
        <div className="text-muted-foreground">No relevant field changes</div>
      )}
      {fields.map((key) => {
        const label = fieldMap[key];
        const oldVal = prev[key];
        const newVal = curr[key];
        if (oldVal === undefined && newVal === undefined) return null;
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          return (
            <div key={key}>
              <b>{label}:</b> {newVal !== undefined ? JSON.stringify(newVal) : <span className="text-red-600">(removed)</span>}
              {oldVal !== undefined && newVal !== undefined && (
                <><br /><span className="text-red-600 text-xs">was: {JSON.stringify(oldVal)}</span></>
              )}
              {oldVal !== undefined && newVal === undefined && (
                <><br /><span className="text-red-600 text-xs">was: {JSON.stringify(oldVal)}</span></>
              )}
            </div>
          );
        } else if (newVal !== undefined) {
          // Unchanged, but show if present
          return (
            <div key={key}>
              <b>{label}:</b> {JSON.stringify(newVal)}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// Simple useMediaQuery hook for responsive rendering
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) setMatches(media.matches);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  return matches;
}

export default function AuditLogsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Visualization state
  const [eventTypeStats, setEventTypeStats] = useState<any[]>([]);
  const [eventTypeStatsLoading, setEventTypeStatsLoading] = useState(false);
  const [eventTypeStatsError, setEventTypeStatsError] = useState<string | null>(null);
  const [eventsOverTime, setEventsOverTime] = useState<any[]>([]);
  const [eventsOverTimeLoading, setEventsOverTimeLoading] = useState(false);
  const [eventsOverTimeError, setEventsOverTimeError] = useState<string | null>(null);

  const isMobile = useMediaQuery('(max-width: 767px)');

  // Fetch logs (table)
  useEffect(() => {
    if (!user || user.role !== "Admin") return;
    setLoading(true);
    setError(null);
    let query = supabase.from("audit_logs").select("*", { count: "exact" });
    if (eventType !== "all") {
      query = query.eq("event_type", eventType);
    }
    if (search) {
      query = query.or(`display_name.ilike.%${search}%,resource.ilike.%${search}%`);
    }
    query = query.order("timestamp", { ascending: false });
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    query.then(({ data, count, error }) => {
      if (error) {
        setError(error.message);
        setLogs([]);
        setTotal(0);
      } else {
        setLogs(data || []);
        setTotal(count || 0);
      }
      setLoading(false);
    });
  }, [user, eventType, search, page]);

  // Fetch event type distribution (aggregate in JS for small datasets)
  useEffect(() => {
    if (!user || user.role !== "Admin") return;
    setEventTypeStatsLoading(true);
    setEventTypeStatsError(null);
    let query = supabase
      .from('audit_logs')
      .select('event_type');
    if (eventType !== "all") {
      query = query.eq("event_type", eventType);
    }
    if (search) {
      query = query.or(`display_name.ilike.%${search}%,resource.ilike.%${search}%`);
    }
    query.then(({ data, error }) => {
      if (error) {
        setEventTypeStatsError(error.message);
        setEventTypeStats([]);
      } else {
        // Aggregate in JS (for small datasets; use SQL function for large datasets)
        const counts: Record<string, number> = {};
        (data || []).forEach((row: any) => {
          counts[row.event_type] = (counts[row.event_type] || 0) + 1;
        });
        setEventTypeStats(Object.entries(counts).map(([event_type, count]) => ({ event_type, count })));
      }
      setEventTypeStatsLoading(false);
    });
  }, [user, eventType, search]);

  // Fetch events over time (by day)
  useEffect(() => {
    if (!user || user.role !== "Admin") return;
    setEventsOverTimeLoading(true);
    setEventsOverTimeError(null);
    // Use RPC or view for date_trunc if needed, but try simple select for now
    // This may require a Supabase function for production
    supabase.rpc('audit_logs_events_by_day', {})
      .then(({ data, error }) => {
        if (error) {
          setEventsOverTimeError(error.message);
          setEventsOverTime([]);
        } else {
          setEventsOverTime(data || []);
        }
        setEventsOverTimeLoading(false);
      });
  }, [user]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  if (!user || user.role !== "Admin") {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto" data-testid="audit-logs-page">
      <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
      {/* Log Visualizations */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {/* Event Type Distribution */}
        <div className="bg-card rounded-lg shadow p-2 sm:p-3 md:p-4 w-full">
          <h2 className="text-lg font-semibold mb-2">Event Type Distribution</h2>
          {eventTypeStatsLoading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : eventTypeStatsError ? (
            <div className="text-red-500">Error: {eventTypeStatsError}</div>
          ) : eventTypeStats.length === 0 ? (
            <div className="text-muted-foreground">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={eventTypeStats} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event_type" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        {/* Events Over Time */}
        <div className="bg-card rounded-lg shadow p-2 sm:p-3 md:p-4 w-full">
          <h2 className="text-lg font-semibold mb-2">Events Over Time</h2>
          {eventsOverTimeLoading ? (
            <div className="text-muted-foreground">Loading...</div>
          ) : eventsOverTimeError ? (
            <div className="text-red-500">Error: {eventsOverTimeError}</div>
          ) : eventsOverTime.length === 0 ? (
            <div className="text-muted-foreground">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={eventsOverTime} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#059669" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      {/* Filters and Table/Card */}
      <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4 mb-6 w-full">
        <Input
          placeholder="Search logs..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full md:w-64"
        />
        <Select value={eventType} onValueChange={(v) => { setEventType(v); setPage(1); }}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="All Event Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Event Types</SelectItem>
            {EVENT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="w-full md:w-auto" onClick={() => { setSearch(""); setEventType("all"); setPage(1); }}>Clear Filters</Button>
      </div>
      <div className="bg-card rounded-lg shadow w-full">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Error: {error}</div>
        ) : isMobile ? (
          <div className="flex flex-col gap-3">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No logs found.</div>
            ) : (
              logs.map((log: any, idx: number) => (
                <div key={log.id} className="rounded-lg border border-border bg-background p-3 flex flex-col gap-1 shadow-sm">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}</span>
                    <span className="capitalize">{log.event_type || '-'}</span>
                  </div>
                  <div className="font-semibold text-sm mb-1">{log.display_name || '-'}</div>
                  <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs">
                    <span><b>Resource:</b> {log.resource || '-'}</span>
                    {log.resource === 'Transaction' && log.resource_id ? (
                      <span><b>ID:</b> <a href={`/transactions/${log.resource_id}`} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{log.resource_id}</a></span>
                    ) : log.resource_id ? (
                      <span><b>ID:</b> {log.resource_id}</span>
                    ) : null}
                    <span><b>Outcome:</b> {log.outcome || '-'}</span>
                  </div>
                  <div className="mt-1 text-xs">
                    <b>Details:</b> {log.event_type === 'update' ? renderUpdateDiff(log.previous_state, log.new_state) : (log.details || '-')}
                  </div>
                  {idx !== logs.length - 1 && <div className="border-t border-border mt-2" />}
                </div>
              ))
            )}
            <div className="mt-4 flex flex-col items-center gap-2">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      aria-disabled={page === 1}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        isActive={page === i + 1}
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      aria-disabled={page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        ) : (
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-background sticky top-0 z-10">
                  <TableHead>Date/Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Resource ID</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">No logs found.</TableCell>
                  </TableRow>
                ) : (
                  logs.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell className="p-2 sm:p-4 text-xs sm:text-sm">{log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}</TableCell>
                      <TableCell className="p-2 sm:p-4 text-xs sm:text-sm">{log.display_name || '-'}</TableCell>
                      <TableCell className="p-2 sm:p-4 text-xs sm:text-sm">{log.event_type || '-'}</TableCell>
                      <TableCell className="p-2 sm:p-4 text-xs sm:text-sm">{log.resource || '-'}</TableCell>
                      <TableCell className="p-2 sm:p-4 text-xs sm:text-sm">
                        {log.resource === 'Transaction' && log.resource_id ? (
                          <a
                            href={`/transactions/${log.resource_id}`}
                            className="text-blue-600 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {log.resource_id}
                          </a>
                        ) : (
                          log.resource_id || '-'
                        )}
                      </TableCell>
                      <TableCell className="p-2 sm:p-4 text-xs sm:text-sm">{log.outcome || '-'}</TableCell>
                      <TableCell className="p-2 sm:p-4 text-xs sm:text-sm">
                        {log.event_type === 'update'
                          ? renderUpdateDiff(log.previous_state, log.new_state)
                          : log.details || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
} 