import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, TrendingUp, AlertOctagon, DollarSign, Shield, Activity,
  Car, Award, Download, Filter, ChevronRight, Building, LogOut,
  CheckCircle, FileWarning, Star, Ban, Trophy,
  AlertTriangle, Bell, Radio, Flame, Map
} from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const rideActivityData = [
  { month: "Aug", rides: 4200, drivers: 180 },
  { month: "Sep", rides: 5800, drivers: 220 },
  { month: "Oct", rides: 7200, drivers: 280 },
  { month: "Nov", rides: 9100, drivers: 340 },
  { month: "Dec", rides: 11500, drivers: 420 },
  { month: "Jan", rides: 14200, drivers: 510 },
  { month: "Feb", rides: 18500, drivers: 630 },
];
const revenueData = [
  { month: "Aug", revenue: 420000, expenses: 180000 },
  { month: "Sep", revenue: 580000, expenses: 220000 },
  { month: "Oct", revenue: 720000, expenses: 280000 },
  { month: "Nov", revenue: 910000, expenses: 340000 },
  { month: "Dec", revenue: 1150000, expenses: 420000 },
  { month: "Jan", revenue: 1420000, expenses: 510000 },
  { month: "Feb", revenue: 1850000, expenses: 630000 },
];
const driverOnboardingData = [
  { week: "W1", approved: 45, pending: 20, rejected: 5 },
  { week: "W2", approved: 52, pending: 18, rejected: 8 },
  { week: "W3", approved: 68, pending: 15, rejected: 4 },
  { week: "W4", approved: 71, pending: 22, rejected: 6 },
];

// Alert positions with real Mumbai coordinates
const PANIC_ALERTS = [
  { id: 1, driver: "Priya S.", passenger: "Ananya M.", lat: 19.0596, lng: 72.8295, area: "Bandra West", time: "2 min ago", type: "SOS", severity: "critical", status: "active" },
  { id: 2, driver: "Meera K.", passenger: "Ritu D.", lat: 19.1136, lng: 72.8697, area: "Andheri East", time: "8 min ago", type: "Route Deviation", severity: "warning", status: "investigating" },
  { id: 3, driver: "Sunita R.", passenger: "Pooja L.", lat: 19.0176, lng: 72.8190, area: "Worli", time: "15 min ago", type: "Emergency", severity: "critical", status: "resolved" },
  { id: 4, driver: "Kavya T.", passenger: "Sneha P.", lat: 19.1197, lng: 72.9078, area: "Powai", time: "22 min ago", type: "SOS", severity: "warning", status: "resolved" },
  { id: 5, driver: "Leela B.", passenger: "Preethi N.", lat: 19.0183, lng: 72.8478, area: "Dadar", time: "35 min ago", type: "Route Deviation", severity: "warning", status: "resolved" },
];

const EXPIRY_ALERTS = [
  { id: 1, driver: "Fatima Khan", doc: "Driver License", expiry: "Mar 5, 2026", daysLeft: 7, severity: "critical" },
  { id: 2, driver: "Rekha Sharma", doc: "Vehicle Insurance", expiry: "Mar 12, 2026", daysLeft: 14, severity: "warning" },
  { id: 3, driver: "Divya Nair", doc: "Fitness Certificate", expiry: "Mar 20, 2026", daysLeft: 22, severity: "warning" },
  { id: 4, driver: "Lakshmi Rao", doc: "Driver License", expiry: "Apr 1, 2026", daysLeft: 33, severity: "info" },
  { id: 5, driver: "Pallavi Joshi", doc: "Vehicle Insurance", expiry: "Apr 10, 2026", daysLeft: 42, severity: "info" },
];

const RATING_ANOMALIES = [
  { id: 1, passenger: "User #4821", pattern: "1-star to 8 consecutive drivers", flaggedAt: "Today, 11:32 AM", risk: "high", reviews: 8, avgRating: 1.1 },
  { id: 2, passenger: "User #2934", pattern: "Sudden drop from 4★ avg to all 1★", flaggedAt: "Today, 9:15 AM", risk: "medium", reviews: 5, avgRating: 1.4 },
  { id: 3, passenger: "User #7102", pattern: "5★ then 1★ same driver twice", flaggedAt: "Yesterday", risk: "medium", reviews: 3, avgRating: 2.0 },
];

const BLACKLIST = [
  { id: 1, passenger: "Rahul V.", reason: "Verbal harassment", reportedBy: "3 drivers", date: "Feb 20, 2026", shared: true, status: "active" },
  { id: 2, passenger: "Suresh M.", reason: "Physical intimidation", reportedBy: "1 driver", date: "Feb 18, 2026", shared: false, status: "active" },
  { id: 3, passenger: "Amit K.", reason: "Repeated no-shows + abuse", reportedBy: "2 drivers", date: "Feb 14, 2026", shared: true, status: "under review" },
];

const MILESTONES = [
  { id: 1, driver: "Priya Singh", rides: 1000, milestone: 1000, badge: "Diamond", reward: "₹5,000 bonus + Certificate", notified: false },
  { id: 2, driver: "Kavya Reddy", rides: 502, milestone: 500, badge: "Gold", reward: "₹2,000 bonus", notified: false },
  { id: 3, driver: "Meena Pillai", rides: 101, milestone: 100, badge: "Silver", reward: "₹500 bonus + Badge", notified: true },
  { id: 4, driver: "Anita Rao", rides: 498, milestone: 500, badge: "Gold", reward: "₹2,000 bonus", notified: true },
];

// ─── Shared primitives ────────────────────────────────────────────────────────
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg shadow-violet-100/50 border border-violet-50 ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ icon: Icon, text, gradient = "from-violet-500 to-blue-500" }: { icon: React.ComponentType<{ className?: string }>; text: string; gradient?: string }) {
  return (
    <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2.5">
      <span className={`w-7 h-7 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center flex-shrink-0 shadow-md`}>
        <Icon className="w-3.5 h-3.5 text-white" />
      </span>
      {text}
    </h3>
  );
}

function GBtn({ children, g = "from-violet-500 to-pink-500", h = "hover:from-violet-600 hover:to-pink-600", className = "", onClick }: { children: React.ReactNode; g?: string; h?: string; className?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`bg-gradient-to-r ${g} ${h} text-white font-semibold rounded-xl transition-all shadow-md shadow-violet-200/50 ${className}`}>
      {children}
    </button>
  );
}

// ─── FEATURE 1: Live Panic Map ───────────────────────────────────────────────
type PanicAlert = typeof PANIC_ALERTS[0];

function LivePanicMap() {
  const [selected, setSelected] = useState<PanicAlert | null>(null);
  const [tick, setTick] = useState(0);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  useEffect(() => { const t = setInterval(() => setTick(n => n + 1), 900); return () => clearInterval(t); }, []);
  const pulse = tick % 2 === 0;

  const sColor = { critical: "#f43f5e", warning: "#8b5cf6", info: "#3b82f6" };
  const sBadge = {
    active: "bg-rose-100 text-rose-700 border border-rose-200",
    investigating: "bg-violet-100 text-violet-700 border border-violet-200",
    resolved: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  };

  // Initialize MapTiler map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const mapTilerApiKey = import.meta.env.VITE_MAPTILER_API_KEY || "xhqIRToLkJY0o50U1N2u";
    const styleUrl = `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerApiKey}`;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [72.8777, 19.0760], // Mumbai center
      zoom: 11.5,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

    map.on('load', () => {
      console.log('✅ MapTiler loaded successfully');

      // Add markers for each panic alert
      PANIC_ALERTS.forEach(alert => {
        const color = alert.severity === 'critical' ? '#f43f5e' :
          alert.severity === 'warning' ? '#8b5cf6' : '#3b82f6';

        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.cssText = `
          width: 24px;
          height: 24px;
          background-color: ${color};
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s;
          ${alert.status === 'resolved' ? 'opacity: 0.5;' : ''}
        `;

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.3)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
        });
        el.addEventListener('click', () => {
          setSelected(alert);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([alert.lng, alert.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Fly to selected alert
  useEffect(() => {
    if (selected && mapRef.current) {
      mapRef.current.flyTo({
        center: [selected.lng, selected.lat],
        zoom: 14,
        duration: 1000
      });
    }
  }, [selected]);

  return (
    <Card className="p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <SectionLabel icon={Radio} text="Live Panic Alert Map" gradient="from-rose-500 to-pink-500" />
        <span className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-100 rounded-full text-xs font-black text-rose-600 tracking-wider">
          <span className={`w-2 h-2 rounded-full bg-rose-500 transition-opacity duration-300 ${pulse ? "opacity-100" : "opacity-20"}`} />
          LIVE
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        {[
          { label: "Active SOS", value: PANIC_ALERTS.filter(a => a.status === "active").length, g: "from-rose-500 to-pink-500" },
          { label: "Investigating", value: PANIC_ALERTS.filter(a => a.status === "investigating").length, g: "from-violet-500 to-purple-500" },
          { label: "Resolved", value: PANIC_ALERTS.filter(a => a.status === "resolved").length, g: "from-emerald-400 to-teal-500" },
        ].map((s, i) => (
          <div key={i} className={`bg-gradient-to-br ${s.g} rounded-xl p-3 text-white text-center`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs opacity-90 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="relative w-full rounded-xl overflow-hidden border border-violet-100 mb-4" style={{ height: "450px" }}>
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Info popup overlay */}
        {selected && (
          <div className="absolute top-4 left-4 right-4 sm:left-auto sm:w-80 bg-white rounded-xl shadow-2xl border border-violet-100 overflow-hidden z-10">
            <div className={`h-2 bg-gradient-to-r ${selected.severity === 'critical' ? 'from-rose-500 to-pink-500' : 'from-violet-500 to-purple-500'}`} />
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 mb-1">{selected.type}</h4>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <Map className="w-3.5 h-3.5" /> {selected.area}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-gray-400 text-xl leading-none">×</span>
                </button>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Driver:</span>
                  <span className="font-semibold text-gray-900">{selected.driver}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Passenger:</span>
                  <span className="font-semibold text-gray-900">{selected.passenger}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Time:</span>
                  <span className="text-gray-600">{selected.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sBadge[selected.status as keyof typeof sBadge]}`}>
                    {selected.status}
                  </span>
                </div>
              </div>
              {selected.status !== 'resolved' && (
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg text-xs font-bold shadow-sm hover:shadow-md transition-shadow">
                    🚨 Dispatch
                  </button>
                  <button className="flex-1 py-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-lg text-xs font-bold shadow-sm hover:shadow-md transition-shadow">
                    📞 Call
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-1.5 z-10">
          {[{ c: "bg-rose-500", l: "Critical" }, { c: "bg-violet-500", l: "Warning" }, { c: "bg-slate-400", l: "Resolved" }].map((l, i) => (
            <span key={i} className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md border border-gray-200">
              <span className={`w-2.5 h-2.5 rounded-full ${l.c}`} />
              <span className="text-gray-700 text-xs font-medium">{l.l}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Alert list */}
      <div className="space-y-2 mb-4">
        {PANIC_ALERTS.map(a => {
          const isSel = selected?.id === a.id;
          return (
            <div key={a.id}
              className={`rounded-xl border transition-all overflow-hidden ${isSel ? "border-violet-300 bg-violet-50" : "border-violet-50 bg-gray-50"
                }`}
            >
              <button onClick={() => setSelected(isSel ? null : a)} className="w-full text-left p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: sColor[a.severity as keyof typeof sColor] }} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{a.type} — {a.area}</p>
                      <p className="text-xs text-gray-400">{a.driver} · {a.passenger} · {a.time}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${sBadge[a.status as keyof typeof sBadge]}`}>{a.status}</span>
                </div>
              </button>

              {/* Inline action buttons — only when selected and not resolved */}
              <AnimatePresence>
                {isSel && a.status !== "resolved" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-2 px-3 pb-3">
                      <button className="flex-1 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg text-xs font-bold shadow-sm">
                        🚨 Dispatch Help
                      </button>
                      <button className="flex-1 py-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-lg text-xs font-bold shadow-sm">
                        📞 Call Driver
                      </button>
                      <button className="flex-1 py-2 bg-white border border-violet-200 text-violet-700 rounded-lg text-xs font-bold">
                        Track Live
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Action row */}
      <div className="grid grid-cols-2 gap-3">
        <GBtn onClick={() => { }} g="from-rose-500 to-pink-500" h="hover:from-rose-600 hover:to-pink-600" className="py-2.5 text-sm flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Dispatch All
        </GBtn>
        <GBtn onClick={() => { }} g="from-violet-500 to-blue-500" h="hover:from-violet-600 hover:to-blue-600" className="py-2.5 text-sm flex items-center justify-center gap-2">
          <Map className="w-4 h-4" /> Full Map View
        </GBtn>
      </div>
    </Card>
  );
}

// ─── FEATURE 2: Document Expiry Alerts ───────────────────────────────────────
function DocumentExpiryAlerts() {
  const sStyle = {
    critical: { bar: "from-rose-500 to-pink-500", badge: "bg-rose-100 text-rose-700 border border-rose-200", bg: "bg-rose-50/50 border-rose-100" },
    warning: { bar: "from-violet-500 to-purple-500", badge: "bg-violet-100 text-violet-700 border border-violet-200", bg: "bg-violet-50/50 border-violet-100" },
    info: { bar: "from-blue-400 to-violet-400", badge: "bg-blue-100 text-blue-700 border border-blue-200", bg: "bg-blue-50/50 border-blue-100" },
  };
  return (
    <Card className="p-5 sm:p-6">
      <SectionLabel icon={FileWarning} text="Document Expiry Alerts" gradient="from-violet-500 to-pink-500" />
      <div className="space-y-2.5">
        {EXPIRY_ALERTS.map(item => {
          const s = sStyle[item.severity as keyof typeof sStyle];
          const pct = Math.max(8, Math.min(100, ((60 - item.daysLeft) / 60) * 100));
          return (
            <div key={item.id} className={`p-3.5 rounded-xl border ${s.bg}`}>
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{item.driver}</p>
                  <p className="text-xs text-gray-500">{item.doc}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${s.badge}`}>{item.daysLeft}d left</span>
                  <p className="text-xs text-gray-400 mt-0.5">{item.expiry}</p>
                </div>
              </div>
              <div className="h-1.5 bg-white/70 rounded-full overflow-hidden border border-gray-100">
                <motion.div className={`h-full rounded-full bg-gradient-to-r ${s.bar}`}
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: "easeOut" }} />
              </div>
            </div>
          );
        })}
      </div>
      <GBtn onClick={() => { }} g="from-violet-500 to-pink-500" className="mt-4 w-full py-2.5 text-sm flex items-center justify-center gap-2">
        <Bell className="w-4 h-4" /> Send All Renewal Reminders
      </GBtn>
    </Card>
  );
}

// ─── FEATURE 3: Rating Anomaly Detector ──────────────────────────────────────
function RatingAnomalyDetector() {
  const [dismissed, setDismissed] = useState<number[]>([]);
  const visible = RATING_ANOMALIES.filter(r => !dismissed.includes(r.id));
  const rStyle = {
    high: "bg-rose-100 text-rose-700 border border-rose-200",
    medium: "bg-violet-100 text-violet-700 border border-violet-200",
  };
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <SectionLabel icon={Star} text="Rating Anomaly Detector" gradient="from-violet-500 to-blue-500" />
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">{visible.length} flagged</span>
      </div>
      <AnimatePresence>
        {visible.map(item => (
          <motion.div key={item.id} initial={{ opacity: 1 }} exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: "hidden" }} transition={{ duration: 0.3 }}
            className="mb-3 p-4 bg-gradient-to-br from-violet-50/50 to-pink-50/50 rounded-xl border border-violet-100">
            <div className="flex items-start justify-between mb-2 gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-200 to-pink-200 flex items-center justify-center text-xs font-bold text-violet-700 flex-shrink-0">
                  {item.passenger.slice(-2)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{item.passenger}</p>
                  <p className="text-xs text-gray-400">{item.flaggedAt}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${rStyle[item.risk as keyof typeof rStyle]}`}>{item.risk}</span>
            </div>
            <p className="text-xs text-gray-600 mb-3 italic bg-white/60 rounded-lg p-2 border border-violet-50">"{item.pattern}"</p>
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(item.avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
              ))}
              <span className="text-xs text-gray-500 ml-1">{item.avgRating} avg · {item.reviews} reviews</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg text-xs font-semibold shadow-sm">Restrict</button>
              <button className="flex-1 py-1.5 bg-gradient-to-r from-violet-500 to-blue-500 text-white rounded-lg text-xs font-semibold shadow-sm">Investigate</button>
              <button onClick={() => setDismissed(d => [...d, item.id])} className="py-1.5 px-3 bg-white border border-gray-200 text-gray-500 rounded-lg text-xs hover:bg-gray-50 transition-colors">Dismiss</button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {visible.length === 0 && (
        <div className="text-center py-10">
          <CheckCircle className="w-10 h-10 mx-auto mb-2 text-emerald-400" />
          <p className="text-sm text-gray-400">All clear — no anomalies detected</p>
        </div>
      )}
    </Card>
  );
}

// ─── FEATURE 4: Passenger Blacklist ──────────────────────────────────────────
function PassengerBlacklist() {
  const [showAdd, setShowAdd] = useState(false);
  const sStyle = {
    active: "bg-rose-100 text-rose-700 border border-rose-200",
    "under review": "bg-violet-100 text-violet-700 border border-violet-200",
  };
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <SectionLabel icon={Ban} text="Passenger Blacklist" gradient="from-rose-500 to-violet-500" />
        <button onClick={() => setShowAdd(s => !s)}
          className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg text-xs font-bold shadow-md shadow-rose-200/50">
          + Report
        </button>
      </div>
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-100 overflow-hidden">
            <p className="text-sm font-bold text-rose-700 mb-3">Report Passenger</p>
            <input className="w-full border border-violet-100 rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-violet-400 bg-white" placeholder="Passenger name or ID" />
            <textarea className="w-full border border-violet-100 rounded-lg px-3 py-2 text-sm mb-2 h-16 resize-none focus:outline-none focus:border-violet-400 bg-white" placeholder="Reason..." />
            <div className="flex items-center gap-2 mb-3">
              <input type="checkbox" id="shareorg" className="accent-violet-500" />
              <label htmlFor="shareorg" className="text-xs text-gray-600">Share with partner women safety orgs</label>
            </div>
            <div className="flex gap-2">
              <GBtn onClick={() => { }} g="from-rose-500 to-pink-500" h="hover:from-rose-600 hover:to-pink-600" className="flex-1 py-2 text-sm">Submit</GBtn>
              <button onClick={() => setShowAdd(false)} className="py-2 px-4 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="space-y-3">
        {BLACKLIST.map(item => (
          <div key={item.id} className="p-3.5 bg-gradient-to-br from-violet-50/40 to-pink-50/40 rounded-xl border border-violet-100">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="font-bold text-gray-900 text-sm">{item.passenger}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sStyle[item.status as keyof typeof sStyle]}`}>{item.status}</span>
                </div>
                <p className="text-xs text-rose-600 font-medium">⚠ {item.reason}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.reportedBy} · {item.date}</p>
              </div>
              {item.shared && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-xs font-bold flex items-center gap-1 flex-shrink-0">
                  <Building className="w-3 h-3" /> Shared
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <button className="flex-1 py-1.5 bg-white border border-violet-200 text-violet-700 rounded-lg text-xs font-semibold hover:bg-violet-50 transition-colors">Review</button>
              {!item.shared && (
                <button className="flex-1 py-1.5 bg-gradient-to-r from-blue-500 to-violet-500 text-white rounded-lg text-xs font-semibold shadow-sm">Share</button>
              )}
              <button className="flex-1 py-1.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-200 transition-colors">Lift Ban</button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── FEATURE 5: Driver Milestones ─────────────────────────────────────────────
function DriverMilestones() {
  const [notified, setNotified] = useState(MILESTONES.filter(m => m.notified).map(m => m.id));
  const bStyle = {
    Diamond: { bg: "from-violet-500 to-blue-500", icon: "💎" },
    Gold: { bg: "from-yellow-400 to-orange-400", icon: "🥇" },
    Silver: { bg: "from-slate-400 to-gray-500", icon: "🥈" },
  };
  return (
    <Card className="p-5 sm:p-6">
      <SectionLabel icon={Trophy} text="Driver Milestone Recognition" gradient="from-violet-500 to-pink-500" />
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "Pending Rewards", value: MILESTONES.filter(m => !m.notified).length, g: "from-violet-500 to-pink-500" },
          { label: "Sent This Month", value: MILESTONES.filter(m => m.notified).length, g: "from-emerald-400 to-teal-500" },
        ].map((s, i) => (
          <div key={i} className={`p-3 rounded-xl bg-gradient-to-br ${s.g} text-white text-center`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs opacity-90 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-2.5">
        {MILESTONES.map(item => {
          const b = bStyle[item.badge as keyof typeof bStyle];
          const done = notified.includes(item.id);
          return (
            <motion.div key={item.id} layout className={`p-3.5 rounded-xl border transition-all ${done ? "border-emerald-100 bg-emerald-50/40 opacity-70" : "border-violet-100 bg-gradient-to-br from-violet-50/50 to-pink-50/50"
              }`}>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 bg-gradient-to-br ${b.bg} rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-lg`}>
                  {b.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="font-bold text-gray-900 text-sm truncate">{item.driver}</p>
                    <Flame className="w-3 h-3 text-orange-400 flex-shrink-0" />
                  </div>
                  <p className="text-xs text-gray-500">{item.rides.toLocaleString()} rides · <span className="font-semibold text-violet-600">{item.milestone} milestone</span></p>
                  <p className="text-xs text-emerald-600 mt-0.5">🎁 {item.reward}</p>
                </div>
                <button
                  onClick={() => setNotified(n => done ? n.filter(id => id !== item.id) : [...n, item.id])}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 transition-all ${done
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-md shadow-violet-200/50"
                    }`}
                >
                  {done ? "✓ Sent" : "Send 🎉"}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export function AdminDashboard() {
  const user = { name: "Admin" };

  const pendingLoans = [
    { id: 1, driver: "Priya Singh", amount: "₹50,000", status: "pending", date: "Feb 24, 2026" },
    { id: 2, driver: "Anjali Kumar", amount: "₹75,000", status: "pending", date: "Feb 23, 2026" },
    { id: 3, driver: "Neha Patel", amount: "₹45,000", status: "approved", date: "Feb 22, 2026" },
  ];
  const safetyReports = [
    { id: 1, type: "SOS Alert", location: "Downtown Market", resolved: true, date: "Feb 24, 2026" },
    { id: 2, type: "Route Deviation", location: "Tech Park Area", resolved: false, date: "Feb 24, 2026" },
    { id: 3, type: "Emergency", location: "Hospital District", resolved: true, date: "Feb 23, 2026" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/40 to-pink-50/30">

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-violet-100/60 shadow-sm shadow-violet-100/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-md shadow-violet-300/40 flex-shrink-0">
              <span className="text-white font-black text-sm">{user.name.charAt(0)}</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-gray-900 text-sm leading-none">Welcome, {user.name}</h1>
              <p className="text-xs text-violet-400 font-medium mt-0.5">Admin Account</p>
            </div>
          </div>

          <span className="hidden md:block font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-500 text-lg tracking-tight">
            SheRide Admin
          </span>

          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-violet-100 rounded-xl text-xs text-gray-600 hover:border-violet-300 transition-all font-medium">
              <Filter className="w-3.5 h-3.5" /> Filter
            </button>
            <GBtn onClick={() => { }} g="from-violet-500 to-pink-500" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs">
              <Download className="w-3.5 h-3.5" /> Export
            </GBtn>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-violet-100 rounded-xl text-xs text-gray-600 hover:border-violet-300 transition-all font-medium">
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">

        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-1">
            Platform Analytics
          </h2>
          <p className="text-sm text-gray-500">Real-time insights &amp; complete platform control</p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {[
            { label: "Total Rides", value: "18,542", change: "+23.5%", icon: Car, g: "from-violet-500 to-blue-500" },
            { label: "Active Drivers", value: "630", change: "+18.2%", icon: Users, g: "from-violet-500 to-pink-500" },
            { label: "Monthly Revenue", value: "₹18.5L", change: "+30.2%", icon: DollarSign, g: "from-pink-500 to-rose-500" },
            { label: "Safety Score", value: "99.8%", change: "+0.3%", icon: Shield, g: "from-blue-500 to-violet-500" },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <Card className="p-4 sm:p-5 hover:shadow-xl hover:shadow-violet-100/60 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br ${kpi.g} rounded-xl flex items-center justify-center shadow-md`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">{kpi.change}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-gray-900 mb-0.5">{kpi.value}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{kpi.label}</div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-5 sm:p-6">
              <SectionLabel icon={Activity} text="Ride Activity Trend" gradient="from-violet-500 to-blue-500" />
              <ResponsiveContainer width="100%" height={230}>
                <AreaChart data={rideActivityData}>
                  <defs>
                    <linearGradient id="gRides" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gDrvs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE9FE" />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EDE9FE", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area type="monotone" dataKey="rides" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#gRides)" dot={false} />
                  <Area type="monotone" dataKey="drivers" stroke="#EC4899" strokeWidth={2} fillOpacity={1} fill="url(#gDrvs)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="p-5 sm:p-6">
              <SectionLabel icon={TrendingUp} text="Revenue vs Expenses" gradient="from-violet-500 to-pink-500" />
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EDE9FE" />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={11} />
                  <YAxis stroke="#9CA3AF" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EDE9FE", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="revenue" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" fill="#EC4899" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* ── New Features divider ── */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-200 to-transparent" />
          <span className="text-xs font-black tracking-widest text-violet-500 uppercase px-4 py-1.5 bg-gradient-to-r from-violet-50 to-pink-50 rounded-full border border-violet-100 shadow-sm">
            ✨ New Features
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-200 to-transparent" />
        </div>

        {/* Live Panic Map */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <LivePanicMap />
        </motion.div>

        {/* Doc Expiry + Rating Anomaly */}
        <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <DocumentExpiryAlerts />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <RatingAnomalyDetector />
          </motion.div>
        </div>

        {/* Blacklist + Milestones */}
        <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <PassengerBlacklist />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <DriverMilestones />
          </motion.div>
        </div>

        {/* ── Platform Management divider ── */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-200 to-transparent" />
          <span className="text-xs font-black tracking-widest text-violet-500 uppercase px-4 py-1.5 bg-gradient-to-r from-violet-50 to-pink-50 rounded-full border border-violet-100 shadow-sm">
            Platform Management
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-violet-200 to-transparent" />
        </div>

        {/* User Mgmt + Safety */}
        <div className="grid lg:grid-cols-2 gap-5 sm:gap-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <Card className="p-5 sm:p-6">
              <SectionLabel icon={Users} text="User Management" gradient="from-violet-500 to-blue-500" />
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5">
                {[
                  { label: "Passengers", value: "12,450", g: "from-violet-50 to-blue-50", t: "text-violet-900" },
                  { label: "Drivers", value: "630", g: "from-violet-50 to-pink-50", t: "text-violet-900" },
                  { label: "Pending", value: "42", g: "from-pink-50 to-rose-50", t: "text-pink-900" },
                ].map((s, i) => (
                  <div key={i} className={`p-3 bg-gradient-to-br ${s.g} rounded-xl border border-violet-100`}>
                    <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                    <p className={`text-xl font-black ${s.t}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <GBtn onClick={() => { }} g="from-violet-500 to-pink-500" className="w-full py-2.5 text-sm flex items-center justify-between px-4">
                  Manage Passengers <ChevronRight className="w-4 h-4" />
                </GBtn>
                <GBtn onClick={() => { }} g="from-violet-500 to-blue-500" h="hover:from-violet-600 hover:to-blue-600" className="w-full py-2.5 text-sm flex items-center justify-between px-4">
                  Manage Drivers <ChevronRight className="w-4 h-4" />
                </GBtn>
                <button className="w-full py-2.5 text-sm flex items-center justify-between px-4 rounded-xl border border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100 transition-colors font-semibold">
                  Review Applications <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
            <Card className="p-5 sm:p-6">
              <SectionLabel icon={AlertOctagon} text="Safety Reports" gradient="from-rose-500 to-pink-500" />
              <div className="space-y-2.5 mb-5">
                {safetyReports.map(r => (
                  <div key={r.id} className="p-3.5 bg-gradient-to-br from-violet-50/40 to-pink-50/40 rounded-xl border border-violet-100">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{r.type}</p>
                        <p className="text-xs text-gray-500">{r.location}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{r.date}</p>
                      </div>
                      {r.resolved
                        ? <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        : <AlertOctagon className="w-5 h-5 text-rose-500 flex-shrink-0" />}
                    </div>
                  </div>
                ))}
              </div>
              <GBtn onClick={() => { }} g="from-rose-500 to-pink-500" h="hover:from-rose-600 hover:to-pink-600" className="w-full py-2.5 text-sm flex items-center justify-between px-4">
                View All Safety Reports <ChevronRight className="w-4 h-4" />
              </GBtn>
            </Card>
          </motion.div>
        </div>

        {/* Loans */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <Card className="p-5 sm:p-6">
            <SectionLabel icon={DollarSign} text="Loan Application Management" gradient="from-violet-500 to-pink-500" />
            <div className="grid gap-3">
              {pendingLoans.map(loan => (
                <div key={loan.id} className="p-4 bg-gradient-to-br from-violet-50/40 to-pink-50/40 rounded-xl border border-violet-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900">{loan.driver}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-sm text-gray-500">{loan.amount}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${loan.status === "approved"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : "bg-violet-100 text-violet-700 border-violet-200"
                        }`}>{loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{loan.date}</p>
                  </div>
                  {loan.status === "pending" && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm">Approve</button>
                      <button className="border border-rose-200 text-rose-600 bg-rose-50 px-4 py-2 rounded-xl text-sm font-bold hover:bg-rose-100 transition-colors">Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Onboarding chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <Card className="p-5 sm:p-6">
            <SectionLabel icon={Award} text="Driver Onboarding Status" gradient="from-violet-500 to-blue-500" />
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={driverOnboardingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EDE9FE" />
                <XAxis dataKey="week" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EDE9FE", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="approved" stackId="a" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pending" stackId="a" fill="#EC4899" />
                <Bar dataKey="rejected" stackId="a" fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Government Integration */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
          <Card className="p-5 sm:p-6">
            <SectionLabel icon={Building} text="Government Integration & Policy Compliance" gradient="from-blue-500 to-violet-500" />
            <div className="grid sm:grid-cols-3 gap-3 mb-5">
              {[
                { name: "Ministry of Women & Child Development", lastSync: "2 hours ago" },
                { name: "National Commission for Women", lastSync: "1 day ago" },
                { name: "State Transport Authority", lastSync: "30 mins ago" },
              ].map((g, i) => (
                <div key={i} className="p-4 bg-gradient-to-br from-violet-50 to-blue-50 rounded-xl border border-violet-100">
                  <p className="font-semibold text-gray-900 text-sm mb-2">{g.name}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-xs text-emerald-700 font-bold">Connected</span>
                  </div>
                  <p className="text-xs text-gray-400">Synced {g.lastSync}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Reports Submitted", value: "142" },
                { label: "Compliance Score", value: "98.5%" },
                { label: "Policy Updates", value: "5 pending" },
                { label: "Data Requests", value: "12 active" },
              ].map((s, i) => (
                <div key={i} className="p-3.5 bg-gradient-to-br from-violet-50 to-pink-50 rounded-xl text-center border border-violet-100">
                  <div className="text-xl font-black text-violet-800 mb-0.5">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="h-6" />
      </main>
    </div>
  );
}