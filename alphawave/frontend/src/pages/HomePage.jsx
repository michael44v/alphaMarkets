import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight, Shield, Zap, Globe, Star, ChevronRight,
  TrendingUp, Check, Play, Award, BarChart2, Users,
  Lock, Clock, ChevronDown, Activity, Wifi
} from "lucide-react";
import PublicLayout from "../components/layout/PublicLayout";
import { spreadsData, earningsChartData, promotions } from "../data/mockData";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";

/* ─── static data ─────────────────────────────────────────────────── */
const trustedBy = [
  { name: "Google",         stars: 4.5 },
  { name: "Trustpilot",     stars: 4.4 },
  { name: "App Store",      stars: 4.6 },
  { name: "ForexBrokers",   stars: 4.3 },
  { name: "WikiFX",         stars: 4.5 },
  { name: "DayTrading",     stars: 4.4 },
  { name: "Google Play",    stars: 4.5 },
  { name: "Finance Review", stars: 5.0 },
];

const pressLogos = ["CNBC","Reuters","CNN","Financial Times","Business Insider","Yahoo Finance"];

const promoAccentMap = {
  accent: { dot: "bg-[#C9A84C]",  ring: "bg-[#C9A84C]/10"  },
  teal:   { dot: "bg-[#00C9B8]",  ring: "bg-[#00C9B8]/10"  },
  gold:   { dot: "bg-[#C9A84C]",  ring: "bg-[#C9A84C]/10"  },
};

const instrumentTabs = [
  { label:"FOREX",        title:"FOREX",        cta:"Learn Forex",    path:"/trading",
    body1:"Trade the world's most popular forex and currency pairs with a trusted forex broker whether you are from South Africa, Kenya, Botswana or Nigeria.",
    body2:"Access 40+ major, minor, and exotic forex pairs with low spreads from 0.0. Start trading the world's leading currencies including EUR/USD, GBP/USD, and USD/JPY." },
  { label:"INDICES",      title:"INDICES",      cta:"Trade Indices",  path:"/trading",
    body1:"Trade global stock market indices and gain exposure to entire economies through a single instrument.",
    body2:"Access the US500, UK100, GER40, JP225, HK50, AUS200 and more with competitive spreads and high liquidity." },
  { label:"GOLD & SILVER",title:"GOLD & SILVER",cta:"Trade Metals",   path:"/trading",
    body1:"Trade precious metals as CFDs without physical delivery. Gold and Silver are among the most actively traded instruments globally.",
    body2:"XAU/USD spreads from just 0.75 pips. Trade safe-haven assets 24 hours a day, five days a week." },
  { label:"ENERGY",       title:"ENERGY",       cta:"Trade Energy",   path:"/trading",
    body1:"Trade oil and energy CFDs including Brent Crude, WTI, and Natural Gas with deep liquidity and tight spreads.",
    body2:"Energy markets move on global supply and demand. Go long or short with full flexibility." },
  { label:"ETFs",         title:"ETFs",         cta:"Trade ETFs",     path:"/trading",
    body1:"Trade Exchange-Traded Fund CFDs for broad, diversified exposure across sectors, commodities, and geographies.",
    body2:"Access SPY, QQQ, GLD, VTI, and 50+ more ETF instruments with competitive pricing." },
  { label:"SHARES",       title:"SHARES",       cta:"Trade Shares",   path:"/trading",
    body1:"Trade CFDs on global company stocks including Apple, Tesla, Amazon, NVIDIA, and 300+ other companies.",
    body2:"Go long or short on the world's most liquid equities. No stamp duty, no physical delivery required." },
];

const platforms = [
  { name:"MetaTrader 4", short:"MT4", color:"#1a73e8" },
  { name:"MetaTrader 5", short:"MT5", color:"#0f9d58" },
  { name:"TradingView",  short:"TV",  color:"#131722" },
  { name:"Google Play",  short:"GP",  color:"#EA4335" },
  { name:"App Store",    short:"AS",  color:"#0070C9" },
  { name:"WebTrader",    short:"WT",  color:"#C9A84C" },
];

const tickerItems = [
  { pair:"EUR/USD", price:"1.0842",    change:"+0.12%", up:true  },
  { pair:"XAU/USD", price:"2,341.50",  change:"+0.75%", up:true  },
  { pair:"BTC/USD", price:"64,320.00", change:"-1.23%", up:false },
  { pair:"US500",   price:"5,234.10",  change:"+0.44%", up:true  },
  { pair:"GBP/USD", price:"1.2651",    change:"-0.08%", up:false },
  { pair:"OIL/USD", price:"83.42",     change:"+1.10%", up:true  },
  { pair:"USD/JPY", price:"154.23",    change:"+0.33%", up:true  },
  { pair:"ETH/USD", price:"3,124.80",  change:"-0.55%", up:false },
];

const awards = [
  { year:"2024", title:"Best CFD Broker",        org:"ForexBrokers.com",    icon:"🏆" },
  { year:"2024", title:"Best Trading Platform",   org:"Finance Magnates",    icon:"🥇" },
  { year:"2023", title:"Most Trusted Broker",     org:"WikiFX",              icon:"🛡️" },
  { year:"2023", title:"Best Mobile Trading",     org:"DayTrading.com",      icon:"📱" },
  { year:"2022", title:"Best Customer Support",   org:"Global Forex Awards", icon:"⭐" },
  { year:"2022", title:"Best Execution Quality",  org:"Investment Trends",   icon:"⚡" },
];

const steps = [
  { n:"01", title:"Create Account",    desc:"Sign up in minutes with just your email. No complex paperwork to start.", icon:<Users className="w-7 h-7"/> },
  { n:"02", title:"Verify Identity",   desc:"Quick KYC process. Upload your ID and proof of address — done in under 5 minutes.", icon:<Lock className="w-7 h-7"/> },
  { n:"03", title:"Fund Your Account", desc:"Deposit via bank transfer, card, or e-wallet. $0 deposit fees, instant credit.", icon:<BarChart2 className="w-7 h-7"/> },
  { n:"04", title:"Start Trading",     desc:"Access 1,000+ instruments from forex to gold, indices, shares, ETFs and more.", icon:<Activity className="w-7 h-7"/> },
];

/* ─── tiny helpers ─────────────────────────────────────────────────── */
function StarRow({ count }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20"
          className={`w-3.5 h-3.5 ${i < Math.floor(count) ? "fill-[#C9A84C]" : "fill-[#2A3A55]"}`}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

function StarRowLight({ count }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20"
          className={`w-3.5 h-3.5 ${i < Math.floor(count) ? "fill-[#C9A84C]" : "fill-[#CBD5E0]"}`}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  );
}

function ChartBars() {
  const bars = [
    { h:"40%",hi:false },{ h:"55%",hi:false },{ h:"45%",hi:false },
    { h:"72%",hi:true  },{ h:"58%",hi:false },{ h:"85%",hi:false },
    { h:"68%",hi:false },
  ];
  return (
    <div className="flex items-end gap-2 mb-5" style={{ height:72 }}>
      {bars.map((b,i) => (
        <div key={i} className="flex-1 rounded-t-[3px]"
          style={{
            height:b.h,
            background: b.hi
              ? "linear-gradient(to top,#C9A84C,rgba(201,168,76,0.2))"
              : "linear-gradient(to top,#00C9B8,rgba(0,201,184,0.15))",
            animation:`growBar 1.1s ease-out ${0.07 * i}s both`,
          }}/>
      ))}
    </div>
  );
}

/* ─── Live Ticker ──────────────────────────────────────────────────── */
function LiveTicker() {
  const [offset, setOffset] = useState(0);
  const speed = 0.55;
  useEffect(() => {
    let raf;
    const tick = () => {
      setOffset(prev => {
        const next = prev - speed;
        return next <= -1800 ? 0 : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const items = [...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <div style={{ background:"#040B17", borderBottom:"1px solid rgba(201,168,76,0.15)", overflow:"hidden", position:"relative", padding:"10px 0" }}>
      {/* fade edges */}
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:80, background:"linear-gradient(to right,#040B17,transparent)", zIndex:2, pointerEvents:"none" }}/>
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:80, background:"linear-gradient(to left,#040B17,transparent)", zIndex:2, pointerEvents:"none" }}/>
      <div style={{ display:"flex", alignItems:"center", transform:`translateX(${offset}px)`, whiteSpace:"nowrap", willChange:"transform" }}>
        {items.map((t, i) => (
          <div key={i} style={{ display:"inline-flex", alignItems:"center", gap:12, padding:"0 28px", borderRight:"1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", color:"rgba(255,255,255,0.35)", textTransform:"uppercase", fontFamily:"'DM Sans',sans-serif" }}>{t.pair}</span>
            <span style={{ fontSize:13, fontWeight:700, color:"white", fontFamily:"'DM Mono','Fira Code',monospace" }}>{t.price}</span>
            <span style={{ fontSize:11, fontWeight:700, color: t.up ? "#4ADE80" : "#F87171", fontFamily:"'DM Mono',monospace" }}>{t.change}</span>
            <div style={{ width:6, height:6, borderRadius:"50%", background: t.up ? "#4ADE80" : "#F87171", animation:"pulse 2s infinite" }}/>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Counter animation hook ───────────────────────────────────────── */
function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const num = parseFloat(target.replace(/[^0-9.]/g,""));
    const raf = (now) => {
      const pct = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setCount(Math.floor(eased * num));
      if (pct < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [start]);
  return count;
}

/* ─── Main Component ───────────────────────────────────────────────── */
export default function HomePage() {
  const [email, setEmail]         = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <PublicLayout>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500;700&display=swap');

        :root {
          --bg-deep:    #060D1A;
          --bg-card:    #0A1628;
          --bg-surface: #0F1E35;
          --bg-lift:    #1A2B45;
          --border:     rgba(255,255,255,0.07);
          --border-gold:rgba(201,168,76,0.25);
          --gold:       #C9A84C;
          --gold-light: #E0C070;
          --gold-dim:   rgba(201,168,76,0.12);
          --teal:       #00C9B8;
          --teal-dim:   rgba(0,201,184,0.10);
          --text-1:     #F0F4FF;
          --text-2:     rgba(240,244,255,0.60);
          --text-3:     rgba(240,244,255,0.35);
        }

        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes floatY {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-9px); }
        }
        @keyframes growBar {
          from { transform:scaleY(0); transform-origin:bottom; }
          to   { transform:scaleY(1); transform-origin:bottom; }
        }
        @keyframes bounce {
          0%,100% { transform:translateX(-50%) translateY(0); }
          50%      { transform:translateX(-50%) translateY(7px); }
        }
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        @keyframes goldPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(201,168,76,0); }
          50%      { box-shadow: 0 0 32px 6px rgba(201,168,76,0.22); }
        }
        @keyframes bonusBadgePop {
          0%   { transform:scale(0.92); opacity:0; }
          60%  { transform:scale(1.04); }
          100% { transform:scale(1); opacity:1; }
        }
        @keyframes countDown {
          from { width:100%; }
          to   { width:0%; }
        }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

        .font-display { font-family:'Playfair Display',serif; }
        .font-body    { font-family:'DM Sans',sans-serif; }
        .font-mono    { font-family:'DM Mono','Fira Code',monospace; }
      `}</style>

      {/* ── LIVE TICKER ── */}
      <LiveTicker />

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", overflow:"hidden", background:"var(--bg-deep)" }}>

        {/* Layered background: abstract financial chart lines */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
          {/* Deep grid */}
          <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(201,168,76,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.03) 1px,transparent 1px)", backgroundSize:"72px 72px" }}/>
          {/* Radial glow — gold right */}
          <div style={{ position:"absolute", top:"30%", right:"0%", width:700, height:700, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(201,168,76,0.10) 0%,transparent 65%)", filter:"blur(30px)" }}/>
          {/* Radial glow — teal left */}
          <div style={{ position:"absolute", bottom:"-10%", left:"5%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(ellipse,rgba(0,201,184,0.08) 0%,transparent 65%)", filter:"blur(40px)" }}/>
          {/* Subtle diagonal line accent */}
          <div style={{ position:"absolute", top:0, right:"38%", width:1, height:"100%", background:"linear-gradient(to bottom,transparent,rgba(201,168,76,0.12),transparent)", transform:"skewX(-20deg)" }}/>
          <div style={{ position:"absolute", top:0, right:"36%", width:1, height:"100%", background:"linear-gradient(to bottom,transparent,rgba(201,168,76,0.06),transparent)", transform:"skewX(-20deg)" }}/>
          {/* Top border light */}
          <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)" }}/>
          {/* Bottom fade */}
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:200, background:"linear-gradient(to top,var(--bg-deep),transparent)" }}/>
        </div>

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"96px 40px", width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center", position:"relative", zIndex:10 }}>

          {/* LEFT */}
          <div style={{ animation:"fadeSlideUp 0.9s cubic-bezier(.22,1,.36,1) both" }}>

            {/* Live badge */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:28, borderRadius:100, padding:"6px 16px", background:"rgba(0,201,184,0.08)", border:"1px solid rgba(0,201,184,0.2)" }}>
              <Wifi style={{ width:13, height:13, color:"var(--teal)" }}/>
              <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--teal)", fontFamily:"'DM Sans',sans-serif" }}>Live Markets · Award-Winning CFD Broker</span>
            </div>

            <h1 className="font-display" style={{ fontSize:"clamp(38px,5.2vw,64px)", lineHeight:1.08, letterSpacing:"-0.02em", color:"var(--text-1)", marginBottom:24 }}>
              AlphaWave Markets<br/>
              <span style={{ background:"linear-gradient(90deg,#C9A84C,#E0C070,#C9A84C)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundSize:"200%" }}>
                Ultimate Trading
              </span><br/>
              Machine
            </h1>

            <p style={{ fontSize:17, color:"var(--text-2)", lineHeight:1.7, marginBottom:32, maxWidth:480, fontFamily:"'DM Sans',sans-serif", animation:"fadeSlideUp 0.9s 0.12s both" }}>
              An award-winning CFD platform trusted by 5,000,000+ traders.
              Trade forex, gold, indices, stocks and more — from 0.0 pips.
            </p>

            {/* ═══ BONUS BANNER — ultra vivid ═══ */}
            <div style={{
              position:"relative",
              marginBottom:28,
              borderRadius:14,
              overflow:"hidden",
              animation:"bonusBadgePop 0.7s 0.3s cubic-bezier(.22,1,.36,1) both, goldPulse 3s 1s ease-in-out infinite",
            }}>
              {/* Base */}
              <div style={{
                background:"linear-gradient(105deg,#1A1000 0%,#2A1A00 30%,#1A1000 100%)",
                border:"1.5px solid rgba(201,168,76,0.55)",
                borderRadius:14,
                padding:"16px 22px",
                position:"relative",
              }}>
                {/* Shimmer sweep */}
                <div style={{
                  position:"absolute", inset:0, borderRadius:14, pointerEvents:"none",
                  background:"linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.06) 45%,rgba(255,255,255,0.12) 50%,rgba(255,255,255,0.06) 55%,transparent 100%)",
                  backgroundSize:"600px 100%",
                  animation:"shimmer 2.8s linear infinite",
                }}/>
                {/* Gold top edge glow */}
                <div style={{ position:"absolute", top:0, left:"10%", right:"10%", height:1, background:"linear-gradient(90deg,transparent,#C9A84C,transparent)" }}/>

                <div style={{ display:"flex", alignItems:"center", gap:16, position:"relative", zIndex:1 }}>
                  {/* Icon */}
                  <div style={{
                    width:48, height:48, borderRadius:12, flexShrink:0,
                    background:"linear-gradient(135deg,#C9A84C,#F5D080)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontSize:22,
                    boxShadow:"0 4px 20px rgba(201,168,76,0.5)",
                  }}>🎁</div>

                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color:"#C9A84C", fontFamily:"'DM Sans',sans-serif" }}>Limited Time Offer</span>
                      <span style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"#060D1A", background:"#C9A84C", padding:"2px 7px", borderRadius:100, fontFamily:"'DM Sans',sans-serif" }}>ACTIVE</span>
                    </div>
                    <div style={{ fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:20, color:"#F5D080", lineHeight:1.2 }}>
                      Get <span style={{ fontSize:26, color:"#FFE08A", textShadow:"0 0 20px rgba(255,220,100,0.6)" }}>$200 Bonus</span> for your first{" "}
                      <span style={{ color:"#FFE08A", textShadow:"0 0 20px rgba(255,220,100,0.5)" }}>$1,000 deposit</span>
                    </div>
                  </div>

                  {/* Arrow CTA */}
                  <div style={{
                    width:40, height:40, borderRadius:10, flexShrink:0,
                    background:"linear-gradient(135deg,#C9A84C,#E0C070)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow:"0 4px 16px rgba(201,168,76,0.4)",
                  }}>
                    <ArrowRight style={{ width:18, height:18, color:"#060D1A" }}/>
                  </div>
                </div>

                {/* Progress bar — urgency strip */}
                <div style={{ marginTop:12, borderRadius:100, height:3, background:"rgba(201,168,76,0.15)", overflow:"hidden", position:"relative", zIndex:1 }}>
                  <div style={{
                    height:"100%", borderRadius:100, width:"62%",
                    background:"linear-gradient(90deg,#C9A84C,#FFE08A)",
                    boxShadow:"0 0 8px rgba(201,168,76,0.6)",
                  }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:5, position:"relative", zIndex:1 }}>
                  <span style={{ fontSize:10, color:"rgba(201,168,76,0.6)", fontFamily:"'DM Sans',sans-serif" }}>62% of bonuses claimed</span>
                  <span style={{ fontSize:10, color:"rgba(201,168,76,0.6)", fontFamily:"'DM Sans',sans-serif" }}>T&Cs apply</span>
                </div>
              </div>
            </div>

            {/* Email + CTA */}
            <div style={{ display:"flex", gap:10, marginBottom:28, flexWrap:"wrap", animation:"fadeSlideUp 0.9s 0.22s both" }}>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                style={{
                  flex:1, minWidth:200, padding:"13px 18px", borderRadius:10, color:"var(--text-1)",
                  background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)",
                  backdropFilter:"blur(10px)", fontSize:14, outline:"none", fontFamily:"'DM Sans',sans-serif",
                  transition:"border-color 0.2s",
                }}
                onFocus={e => (e.target.style.borderColor="rgba(201,168,76,0.55)")}
                onBlur={e => (e.target.style.borderColor="rgba(255,255,255,0.12)")}
              />
              <Link to="/register" style={{
                display:"inline-flex", alignItems:"center", gap:8, padding:"13px 26px", borderRadius:10,
                background:"linear-gradient(135deg,#B8902E,#C9A84C,#E0C070)", color:"#060D1A",
                fontWeight:700, fontSize:14, textDecoration:"none", whiteSpace:"nowrap",
                boxShadow:"0 8px 28px rgba(201,168,76,0.38)", fontFamily:"'DM Sans',sans-serif",
                transition:"transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 36px rgba(201,168,76,0.5)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(201,168,76,0.38)"; }}>
                Sign Up Free <ArrowRight style={{ width:16, height:16 }}/>
              </Link>
            </div>

            {/* Platform strip */}
            <div style={{ animation:"fadeSlideUp 0.9s 0.32s both" }}>
              <p style={{ fontSize:10, color:"var(--text-3)", textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:10, fontFamily:"'DM Sans',sans-serif" }}>Available on</p>
              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                {platforms.map(p => (
                  <div key={p.name} style={{
                    display:"flex", alignItems:"center", gap:8, padding:"7px 12px", borderRadius:8, cursor:"pointer",
                    background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)",
                    transition:"all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(201,168,76,0.07)"; e.currentTarget.style.borderColor="rgba(201,168,76,0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.09)"; }}
                  title={p.name}>
                    <div style={{ width:20, height:20, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:900, color:"white", background:p.color, fontFamily:"'DM Sans',sans-serif" }}>{p.short}</div>
                    <span style={{ fontSize:11, fontWeight:600, color:"var(--text-2)", fontFamily:"'DM Sans',sans-serif" }}>{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats strip */}
            <div style={{ display:"flex", alignItems:"center", gap:36, paddingTop:28, marginTop:28, borderTop:"1px solid rgba(255,255,255,0.07)", flexWrap:"wrap", animation:"fadeSlideUp 0.9s 0.42s both" }}>
              {[["5M+","Registered Users"],["1,000+","Trading Products"],["0.0","Pips From"],["$0","Deposit Fees"]].map(([val,lab]) => (
                <div key={lab}>
                  <div className="font-display" style={{ fontSize:22, fontWeight:800, color:"var(--gold)" }}>{val}</div>
                  <div style={{ fontSize:11, color:"var(--text-3)", marginTop:2, fontFamily:"'DM Sans',sans-serif" }}>{lab}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — trading card */}
          <div style={{ display:"none", position:"relative", animation:"fadeSlideUp 0.9s 0.18s both" }}
            className="lg-show">
            <div style={{ borderRadius:20, padding:28, background:"rgba(255,255,255,0.04)", backdropFilter:"blur(28px)", border:"1px solid rgba(255,255,255,0.09)", boxShadow:"0 32px 80px rgba(0,0,0,0.4)" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
                <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"var(--text-3)", fontFamily:"'DM Sans',sans-serif" }}>Portfolio Performance</div>
                <div style={{ display:"flex", alignItems:"center", gap:6, color:"#4ADE80", fontSize:11, fontWeight:700, fontFamily:"'DM Sans',sans-serif" }}>
                  <div style={{ width:6, height:6, borderRadius:"50%", background:"#4ADE80", animation:"pulse 2s infinite" }}/>LIVE
                </div>
              </div>
              <ChartBars/>
              <div className="font-display" style={{ fontSize:30, fontWeight:800, color:"var(--text-1)" }}>$25,324.23</div>
              <div style={{ fontSize:13, color:"#4ADE80", fontWeight:600, marginTop:4, display:"flex", alignItems:"center", gap:6, fontFamily:"'DM Sans',sans-serif" }}>
                <TrendingUp style={{ width:15, height:15 }}/>+12.4% This Month
              </div>
            </div>

            {/* Floating badges */}
            <div style={{ position:"absolute", top:-20, right:-20, background:"#0A1628", borderRadius:14, padding:"12px 18px", boxShadow:"0 20px 60px rgba(0,0,0,0.5)", border:"1px solid rgba(201,168,76,0.2)", animation:"floatY 4s ease-in-out infinite" }}>
              <div style={{ fontSize:10, color:"var(--text-3)", fontWeight:500, marginBottom:4, fontFamily:"'DM Sans',sans-serif" }}>XAU/USD · Gold</div>
              <div className="font-display" style={{ fontSize:18, fontWeight:700, color:"var(--text-1)" }}>2,341.50</div>
              <div style={{ fontSize:10, color:"var(--teal)", fontWeight:600, marginTop:2, fontFamily:"'DM Sans',sans-serif" }}>↑ 0.75 pips spread</div>
            </div>

            <div style={{ position:"absolute", bottom:-20, left:-20, background:"#0A1628", borderRadius:14, padding:"12px 18px", boxShadow:"0 20px 60px rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.07)", animation:"floatY 4s 2s ease-in-out infinite" }}>
              <div style={{ fontSize:10, color:"var(--text-3)", fontWeight:500, marginBottom:4, fontFamily:"'DM Sans',sans-serif" }}>Customer Support</div>
              <div className="font-display" style={{ fontSize:18, fontWeight:700, color:"var(--text-1)" }}>24 / 7</div>
              <StarRow count={5}/>
            </div>

            <div style={{ position:"absolute", top:"50%", right:-32, transform:"translateY(-50%)", background:"#0A1628", borderRadius:14, padding:"12px 18px", boxShadow:"0 20px 60px rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.07)", animation:"floatY 4s 1s ease-in-out infinite" }}>
              <div style={{ fontSize:10, color:"var(--text-3)", marginBottom:4, fontFamily:"'DM Sans',sans-serif" }}>New Trade Opened</div>
              <div style={{ fontSize:13, fontWeight:700, color:"var(--text-1)", fontFamily:"'DM Sans',sans-serif" }}>EUR/USD ↗ Buy</div>
              <div style={{ fontSize:10, color:"#4ADE80", fontWeight:600, fontFamily:"'DM Sans',sans-serif" }}>+$342.80 profit</div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{ position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)", zIndex:10, color:"rgba(240,244,255,0.25)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, animation:"bounce 2.2s infinite" }}>
          <span style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.12em", fontFamily:"'DM Sans',sans-serif" }}>Scroll</span>
          <ChevronDown style={{ width:18, height:18 }}/>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PROMO STRIP
      ══════════════════════════════════════════════════════════════ */}
      <div style={{ background:"#08111F", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"18px 0", overflowX:"auto" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px", display:"flex", gap:16, minWidth:"max-content" }}>
          {promotions.map(promo => {
            const c = promoAccentMap[promo.color] || promoAccentMap.accent;
            return (
              <div key={promo.id} style={{
                background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12,
                padding:"14px 20px", display:"flex", alignItems:"center", gap:14, minWidth:220,
                transition:"all 0.2s", cursor:"default",
              }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(201,168,76,0.05)"; e.currentTarget.style.borderColor="rgba(201,168,76,0.2)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)"; }}>
                <div style={{ width:40, height:40, borderRadius:10, background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <div style={{ width:12, height:12, borderRadius:3, background:"var(--gold)" }}/>
                </div>
                <div>
                  <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"var(--text-3)", fontFamily:"'DM Sans',sans-serif" }}>{promo.type}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:"var(--text-1)", marginTop:2, fontFamily:"'DM Sans',sans-serif" }}>{promo.title}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding:"112px 0", background:"var(--bg-deep)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(0,201,184,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,201,184,0.025) 1px,transparent 1px)", backgroundSize:"80px 80px", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(0,201,184,0.4),transparent)", pointerEvents:"none" }}/>

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px", position:"relative", zIndex:10 }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--teal)", marginBottom:12, fontFamily:"'DM Sans',sans-serif" }}>Simple Onboarding</p>
            <h2 className="font-display" style={{ fontSize:"clamp(28px,4vw,44px)", lineHeight:1.15, color:"var(--text-1)" }}>
              Start Trading in{" "}
              <span style={{ background:"linear-gradient(90deg,#C9A84C,#E0C070)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>4 Steps</span>
            </h2>
            <p style={{ color:"var(--text-2)", marginTop:16, maxWidth:420, margin:"16px auto 0", fontSize:15, lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" }}>
              From zero to live trading in minutes. No complexity, no hidden barriers.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20, position:"relative" }}>
            {/* connector line */}
            <div style={{ position:"absolute", top:40, left:"12.5%", right:"12.5%", height:1, background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.3),rgba(0,201,184,0.3),transparent)", opacity:0.6 }}/>

            {steps.map((s, i) => (
              <div key={s.n} style={{
                borderRadius:18, padding:"28px 24px", textAlign:"center", cursor:"default",
                background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)",
                transition:"all 0.3s", animation:`fadeSlideUp 0.7s ${0.08 + i * 0.1}s both`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(201,168,76,0.05)"; e.currentTarget.style.borderColor="rgba(201,168,76,0.2)"; e.currentTarget.style.transform="translateY(-6px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.025)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)"; }}>
                <div style={{ width:64, height:64, borderRadius:"50%", margin:"0 auto 20px", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", background:"linear-gradient(135deg,rgba(201,168,76,0.12),rgba(0,201,184,0.12))", border:"1px solid rgba(201,168,76,0.2)" }}>
                  <div style={{ color:"var(--gold)" }}>{s.icon}</div>
                  <div style={{ position:"absolute", top:-8, right:-8, width:24, height:24, borderRadius:"50%", background:"var(--gold)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:900, color:"#060D1A", fontFamily:"'DM Sans',sans-serif" }}>{s.n}</div>
                </div>
                <h3 className="font-display" style={{ fontWeight:700, color:"var(--text-1)", fontSize:16, marginBottom:10 }}>{s.title}</h3>
                <p style={{ fontSize:13, color:"var(--text-2)", lineHeight:1.65, fontFamily:"'DM Sans',sans-serif" }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:48 }}>
            <Link to="/register" style={{
              display:"inline-flex", alignItems:"center", gap:8, padding:"14px 32px", borderRadius:100,
              background:"linear-gradient(135deg,#B8902E,#C9A84C,#E0C070)", color:"#060D1A",
              fontWeight:700, fontSize:14, textDecoration:"none", fontFamily:"'DM Sans',sans-serif",
              boxShadow:"0 8px 28px rgba(201,168,76,0.35)", transition:"all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 36px rgba(201,168,76,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 8px 28px rgba(201,168,76,0.35)"; }}>
              Open Free Account <ArrowRight style={{ width:16, height:16 }}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SPREADS
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding:"96px 0", background:"var(--bg-card)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px" }}>
          <div style={{ marginBottom:48 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--teal)", marginBottom:12, fontFamily:"'DM Sans',sans-serif" }}>Competitive Pricing</p>
            <h2 className="font-display" style={{ fontSize:"clamp(28px,4vw,44px)", lineHeight:1.15, color:"var(--text-1)", marginBottom:16 }}>
              See Our <span style={{ color:"var(--gold)" }}>Competitive Spreads</span>
            </h2>
            <p style={{ fontSize:15, color:"var(--text-2)", lineHeight:1.7, maxWidth:540, fontFamily:"'DM Sans',sans-serif" }}>
              We consistently beat the market average — giving you an edge before you even place a trade.
            </p>
          </div>

          <div style={{ background:"var(--bg-surface)", border:"1px solid var(--border)", borderRadius:18, overflow:"hidden", boxShadow:"0 4px 40px rgba(0,0,0,0.3)" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", background:"rgba(201,168,76,0.06)", borderBottom:"1px solid rgba(201,168,76,0.15)", padding:"16px 28px", alignItems:"center" }}>
              <div style={{ fontSize:12, fontWeight:600, color:"var(--text-3)", fontFamily:"'DM Sans',sans-serif" }}>Instrument</div>
              <div style={{ fontSize:12, fontWeight:600, color:"var(--text-1)", display:"flex", alignItems:"center", gap:8, justifyContent:"center", fontFamily:"'DM Sans',sans-serif" }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:"var(--teal)", display:"inline-block" }}/>AlphaWave Markets
              </div>
              <div style={{ fontSize:12, fontWeight:600, color:"var(--text-3)", textAlign:"right", fontFamily:"'DM Sans',sans-serif" }}>Market Average</div>
            </div>
            {spreadsData.map((row, i) => (
              <div key={row.pair} style={{
                display:"grid", gridTemplateColumns:"1fr 1fr 1fr", padding:"16px 28px", alignItems:"center",
                borderBottom: i < spreadsData.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                transition:"background 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.025)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="transparent"; }}>
                <div>
                  <div style={{ fontWeight:700, color:"var(--text-1)", fontSize:14, fontFamily:"'DM Sans',sans-serif" }}>{row.pair}</div>
                  <div style={{ fontSize:11, color:"var(--text-3)", marginTop:2, fontFamily:"'DM Sans',sans-serif" }}>{row.category}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, justifyContent:"center" }}>
                  <Star style={{ width:14, height:14, fill:"#C9A84C", color:"#C9A84C" }}/>
                  <span className="font-display" style={{ fontWeight:700, fontSize:17, color:"var(--gold)" }}>{row.ours}</span>
                </div>
                <div style={{ textAlign:"right", fontWeight:700, fontSize:15, color:"var(--text-2)", fontFamily:"'DM Sans',sans-serif" }}>{row.market}</div>
              </div>
            ))}
            <div style={{ background:"rgba(255,255,255,0.02)", padding:"10px 28px", fontSize:11, color:"var(--text-3)", fontFamily:"'DM Sans',sans-serif" }}>
              Spreads are in pips. Last updated April 2026. All spreads are for indicative purposes only.
            </div>
          </div>

          <div style={{ textAlign:"center", marginTop:40 }}>
            <Link to="/register" style={{
              display:"inline-flex", alignItems:"center", gap:8, padding:"14px 32px", borderRadius:12,
              background:"linear-gradient(135deg,#B8902E,#C9A84C,#E0C070)", color:"#060D1A",
              fontWeight:700, fontSize:15, textDecoration:"none", fontFamily:"'DM Sans',sans-serif",
              boxShadow:"0 8px 24px rgba(201,168,76,0.35)", transition:"all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; }}>
              Sign Up Now <ArrowRight style={{ width:16, height:16 }}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          AWARDS WALL
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding:"112px 0", background:"var(--bg-deep)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 0%,rgba(201,168,76,0.06),transparent)", pointerEvents:"none" }}/>

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px", position:"relative", zIndex:10 }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12, fontFamily:"'DM Sans',sans-serif" }}>Global Recognition</p>
            <h2 className="font-display" style={{ fontSize:"clamp(28px,4vw,44px)", lineHeight:1.15, color:"var(--text-1)" }}>
              Industry{" "}
              <span style={{ background:"linear-gradient(90deg,#C9A84C,#E0C070)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Awards & Recognition</span>
            </h2>
            <p style={{ color:"var(--text-2)", marginTop:16, maxWidth:420, margin:"16px auto 0", fontSize:15, lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" }}>
              Recognized by the world's most respected financial industry bodies year after year.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
            {awards.map((a, i) => (
              <div key={i} style={{
                borderRadius:18, padding:"24px 28px", display:"flex", alignItems:"flex-start", gap:18, cursor:"default",
                background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
                transition:"all 0.3s", animation:`fadeSlideUp 0.7s ${0.06 * i}s both`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(201,168,76,0.05)"; e.currentTarget.style.borderColor="rgba(201,168,76,0.2)"; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 20px 60px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
                <div style={{ width:52, height:52, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0, background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.18)" }}>{a.icon}</div>
                <div>
                  <div style={{ fontSize:10, color:"var(--gold)", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4, fontFamily:"'DM Sans',sans-serif" }}>{a.year}</div>
                  <div className="font-display" style={{ fontWeight:700, color:"var(--text-1)", fontSize:15, lineHeight:1.3, marginBottom:4 }}>{a.title}</div>
                  <div style={{ fontSize:11, color:"var(--text-3)", fontFamily:"'DM Sans',sans-serif" }}>{a.org}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:56, borderRadius:18, padding:"32px", textAlign:"center", background:"rgba(201,168,76,0.05)", border:"1px solid rgba(201,168,76,0.15)" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12, marginBottom:12 }}>
              <Award style={{ width:22, height:22, color:"var(--gold)" }}/>
              <span className="font-display" style={{ fontWeight:700, color:"var(--text-1)", fontSize:18 }}>30+ Industry Awards Since 2009</span>
            </div>
            <p style={{ color:"var(--text-2)", fontSize:14, maxWidth:500, margin:"0 auto", lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" }}>
              Our consistent excellence in trading technology, customer service, and platform reliability has earned us recognition from leading global financial authorities.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BROKER STATS
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding:"96px 0", background:"var(--bg-card)", position:"relative", overflow:"hidden" }} ref={statsRef}>
        <div style={{ position:"absolute", top:0, right:0, width:500, height:500, borderRadius:"50%", background:"rgba(0,201,184,0.06)", filter:"blur(100px)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px", position:"relative", zIndex:10 }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--teal)", marginBottom:12, fontFamily:"'DM Sans',sans-serif" }}>Why AlphaWave Markets</p>
            <h2 className="font-display" style={{ fontSize:40, fontWeight:800, color:"var(--text-1)" }}>An Award-Winning Broker</h2>
          </div>

          {/* Stat grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", borderRadius:18, overflow:"hidden", marginBottom:60, border:"1px solid rgba(255,255,255,0.07)", gap:1, background:"rgba(255,255,255,0.07)" }}>
            {[["5,000,000+","Registered Users"],["1,000+","Products"],["From 0.0","Pips Spreads"],["$0","Deposit Fees"]].map(([val,lab]) => (
              <div key={lab} style={{ padding:"36px 16px", textAlign:"center", background:"var(--bg-card)" }}>
                <div className="font-display" style={{ fontSize:34, fontWeight:800, color:"var(--gold)", lineHeight:1, marginBottom:8 }}>{val}</div>
                <div style={{ fontSize:13, color:"var(--text-2)", fontFamily:"'DM Sans',sans-serif" }}>{lab}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              { icon:<Shield style={{ width:26, height:26 }}/>, title:"Trusted CFD Broker",   desc:"With over 15 years of experience, AlphaWave Markets has built a reputation as a trusted, award-winning CFD broker. Trade 1,000+ products backed by seamless execution and 24/7 support." },
              { icon:<Zap style={{ width:26, height:26 }}/>,    title:"Secure Funds",          desc:"Client funds are held in segregated trust accounts with top-tier banks, separate from our operational capital. Insurance coverage up to USD 1,000,000 per claimant." },
              { icon:<Globe style={{ width:26, height:26 }}/>,  title:"Competitive Spreads",   desc:"Trade smarter with ultra-tight spreads designed to help you manage costs effectively. Competitive pricing across all products to optimise your trading." },
            ].map(f => (
              <div key={f.title} style={{
                borderRadius:18, padding:"32px 28px", cursor:"default",
                background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
                transition:"all 0.25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(0,201,184,0.05)"; e.currentTarget.style.borderColor="rgba(0,201,184,0.2)"; e.currentTarget.style.transform="translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)"; }}>
                <div style={{ color:"var(--teal)", marginBottom:20 }}>{f.icon}</div>
                <h3 className="font-display" style={{ fontWeight:700, fontSize:17, color:"var(--text-1)", marginBottom:12 }}>{f.title}</h3>
                <p style={{ fontSize:13, color:"var(--text-2)", lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TRUST / RATINGS
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding:"96px 0", background:"var(--bg-surface)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12, fontFamily:"'DM Sans',sans-serif" }}>Ratings and Recognition</p>
            <h2 className="font-display" style={{ fontSize:"clamp(28px,4vw,44px)", lineHeight:1.15, color:"var(--text-1)" }}>
              <span style={{ color:"var(--gold)" }}>Trust</span> We Have Earned
            </h2>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:48 }}>
            {trustedBy.map(t => (
              <div key={t.name} style={{
                background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"20px", textAlign:"center",
                transition:"all 0.2s", cursor:"default",
              }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(201,168,76,0.06)"; e.currentTarget.style.borderColor="rgba(201,168,76,0.2)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)"; }}>
                <div className="font-display" style={{ fontWeight:700, fontSize:13, color:"var(--text-1)", marginBottom:10 }}>{t.name}</div>
                <StarRow count={t.stars}/>
                <div style={{ fontSize:11, color:"var(--text-3)", marginTop:6, fontFamily:"'DM Sans',sans-serif" }}>{t.stars} / 5.0</div>
              </div>
            ))}
          </div>

          <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"center", gap:32, paddingTop:32, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
            {pressLogos.map(p => (
              <span key={p} style={{ fontFamily:"'Playfair Display',serif", fontWeight:800, fontSize:13, color:"var(--text-3)", cursor:"default", letterSpacing:"0.04em", transition:"color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text-1)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}>
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TRADE ANYTIME
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding:"96px 0", background:"var(--bg-card)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center" }}>
            <div>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--teal)", marginBottom:12, fontFamily:"'DM Sans',sans-serif" }}>Access</p>
              <h2 className="font-display" style={{ fontSize:"clamp(28px,4vw,44px)", lineHeight:1.15, color:"var(--text-1)", marginBottom:24 }}>
                Trade <span style={{ color:"var(--gold)" }}>Anytime, Anywhere</span>
              </h2>
              <p style={{ fontSize:15, color:"var(--text-2)", lineHeight:1.7, marginBottom:16, fontFamily:"'DM Sans',sans-serif" }}>
                One of the world's leading CFD brokers with over 15 years of market experience, AlphaWave Markets provides traders with access to 1,000+ CFD products, including forex, indices, commodities, shares, ETFs, and bonds.
              </p>
              <p style={{ fontSize:15, color:"var(--text-2)", lineHeight:1.7, marginBottom:28, fontFamily:"'DM Sans',sans-serif" }}>
                Trade CFDs with ease on desktop or mobile using our variety of advanced trading tools and features from your home country, whether you are from South Africa, Kenya, Botswana or Nigeria.
              </p>
              <ul style={{ marginBottom:36, borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                {["Trade CFDs from South Africa, Kenya, Botswana or Nigeria","Desktop and mobile trading with advanced tools","MetaTrader 4, MetaTrader 5, TradingView","24/7 dedicated customer support","Copy trading — follow expert traders"].map(item => (
                  <li key={item} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 0", fontSize:14, color:"var(--text-2)", borderBottom:"1px solid rgba(255,255,255,0.06)", fontFamily:"'DM Sans',sans-serif" }}>
                    <div style={{ width:22, height:22, borderRadius:"50%", background:"rgba(0,201,184,0.12)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Check style={{ width:12, height:12, color:"var(--teal)" }}/>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <Link to="/register" style={{
                  display:"inline-flex", alignItems:"center", gap:8, padding:"12px 24px", borderRadius:12,
                  background:"linear-gradient(135deg,#B8902E,#C9A84C)", color:"#060D1A",
                  fontWeight:700, fontSize:14, textDecoration:"none", fontFamily:"'DM Sans',sans-serif",
                  transition:"all 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>
                  Open Account <ArrowRight style={{ width:16, height:16 }}/>
                </Link>
                <Link to="/platforms" style={{
                  display:"inline-flex", alignItems:"center", gap:8, padding:"12px 24px", borderRadius:12,
                  border:"1px solid rgba(255,255,255,0.12)", color:"var(--text-1)",
                  fontWeight:700, fontSize:14, textDecoration:"none", fontFamily:"'DM Sans',sans-serif",
                  transition:"all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(201,168,76,0.4)"; e.currentTarget.style.color="var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.12)"; e.currentTarget.style.color="var(--text-1)"; }}>
                  View Platforms
                </Link>
              </div>
            </div>

            <div style={{ position:"relative" }}>
              <div style={{ background:"var(--bg-surface)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"28px", boxShadow:"0 24px 80px rgba(0,0,0,0.4)" }}>
                <div style={{ fontSize:13, color:"var(--text-3)", marginBottom:4, fontFamily:"'DM Sans',sans-serif" }}>Earnings — Trading Performance</div>
                <div className="font-display" style={{ fontWeight:800, fontSize:30, color:"var(--text-1)", marginBottom:24 }}>$25,324.23 USD</div>
                <ResponsiveContainer width="100%" height={80}>
                  <AreaChart data={earningsChartData}>
                    <defs>
                      <linearGradient id="tradeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#C9A84C" stopOpacity={0.4}/>
                        <stop offset="100%" stopColor="#C9A84C" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize:11, fill:"rgba(240,244,255,0.3)", fontFamily:"'DM Sans',sans-serif" }} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{ background:"#0A1628", border:"1px solid rgba(201,168,76,0.2)", borderRadius:10, color:"white", fontSize:12 }}
                      formatter={v => [`$${v.toLocaleString()}`,"Value"]}/>
                    <Area dataKey="value" stroke="#C9A84C" strokeWidth={2} fill="url(#tradeGrad)" dot={false}/>
                  </AreaChart>
                </ResponsiveContainer>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--text-3)", marginTop:8, fontFamily:"'DM Sans',sans-serif" }}>
                  {["APR","MAY","JUN","JUL","AUG","SEP"].map(m => <span key={m}>{m}</span>)}
                </div>
              </div>
              <div style={{
                position:"absolute", bottom:-16, right:-16, background:"var(--bg-surface)", border:"1px solid rgba(201,168,76,0.2)", borderRadius:14, padding:"16px 20px", textAlign:"center",
                boxShadow:"0 12px 40px rgba(0,0,0,0.4)",
              }}>
                <div className="font-display" style={{ fontWeight:800, fontSize:24, color:"var(--text-1)" }}>24/7</div>
                <StarRow count={5}/>
                <div style={{ fontSize:11, fontWeight:600, color:"var(--text-1)", marginTop:4, fontFamily:"'DM Sans',sans-serif" }}>Customer Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          INSTRUMENT TABS
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding:"96px 0", background:"var(--bg-deep)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px" }}>
          <div style={{ marginBottom:32 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12, fontFamily:"'DM Sans',sans-serif" }}>What You Can Trade</p>
            <h2 className="font-display" style={{ fontSize:"clamp(28px,4vw,44px)", lineHeight:1.15, color:"var(--text-1)" }}>
              Driving <span style={{ color:"var(--gold)" }}>Excellence</span> with a Leading CFD Broker
            </h2>
          </div>

          {/* Tabs */}
          <div style={{ display:"flex", gap:4, marginBottom:36, background:"rgba(255,255,255,0.03)", borderRadius:12, padding:4, width:"fit-content", flexWrap:"wrap", border:"1px solid rgba(255,255,255,0.06)" }}>
            {instrumentTabs.map((tab,i) => (
              <button key={tab.label} onClick={() => setActiveTab(i)} style={{
                padding:"9px 18px", borderRadius:9, fontSize:12, fontWeight:700, cursor:"pointer", border:"none",
                transition:"all 0.2s", fontFamily:"'DM Sans',sans-serif",
                background: activeTab === i ? "var(--bg-card)" : "transparent",
                color: activeTab === i ? "var(--gold)" : "var(--text-3)",
                boxShadow: activeTab === i ? "0 2px 12px rgba(0,0,0,0.3)" : "none",
              }}>
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ background:"var(--bg-card)", border:"1px solid rgba(201,168,76,0.12)", borderRadius:20, padding:"40px", boxShadow:"0 4px 40px rgba(0,0,0,0.3)" }}>
            <h3 className="font-display" style={{ fontWeight:800, fontSize:24, color:"var(--text-1)", marginBottom:14 }}>{instrumentTabs[activeTab].title}</h3>
            <p style={{ fontSize:15, color:"var(--text-2)", lineHeight:1.7, marginBottom:14, fontFamily:"'DM Sans',sans-serif" }}>{instrumentTabs[activeTab].body1}</p>
            <p style={{ fontSize:15, color:"var(--text-2)", lineHeight:1.7, marginBottom:28, fontFamily:"'DM Sans',sans-serif" }}>{instrumentTabs[activeTab].body2}</p>
            <Link to={instrumentTabs[activeTab].path} style={{
              display:"inline-flex", alignItems:"center", gap:8, padding:"12px 24px", borderRadius:12,
              background:"linear-gradient(135deg,#B8902E,#C9A84C)", color:"#060D1A",
              fontWeight:700, fontSize:14, textDecoration:"none", fontFamily:"'DM Sans',sans-serif",
              boxShadow:"0 4px 16px rgba(201,168,76,0.3)", transition:"all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 24px rgba(201,168,76,0.45)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 16px rgba(201,168,76,0.3)"; }}>
              {instrumentTabs[activeTab].cta} <ArrowRight style={{ width:16, height:16 }}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          MARKET SNAPSHOT
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding:"112px 0", background:"var(--bg-card)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(0,201,184,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,201,184,0.02) 1px,transparent 1px)", backgroundSize:"80px 80px", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.4),transparent)", pointerEvents:"none" }}/>

        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px", position:"relative", zIndex:10 }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"var(--gold)", marginBottom:12, fontFamily:"'DM Sans',sans-serif" }}>Live Markets</p>
            <h2 className="font-display" style={{ fontSize:"clamp(28px,4vw,44px)", lineHeight:1.15, color:"var(--text-1)" }}>
              Real-Time Market{" "}
              <span style={{ background:"linear-gradient(90deg,#00C9B8,#0070C9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Snapshot</span>
            </h2>
            <p style={{ color:"var(--text-2)", marginTop:16, maxWidth:420, margin:"16px auto 0", fontSize:15, lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" }}>
              Live prices across all major asset classes — always up to date, always competitive.
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
            {tickerItems.map((t, i) => (
              <div key={i} style={{
                borderRadius:16, padding:"20px", cursor:"default",
                background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
                transition:"all 0.3s", animation:`fadeSlideUp 0.6s ${0.06 * i}s both`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = t.up ? "rgba(74,222,128,0.05)" : "rgba(248,113,113,0.05)"; e.currentTarget.style.borderColor = t.up ? "rgba(74,222,128,0.2)" : "rgba(248,113,113,0.2)"; e.currentTarget.style.transform="translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)"; }}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:16 }}>
                  <div>
                    <div style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.12em", color:"var(--text-3)", fontFamily:"'DM Sans',sans-serif" }}>{t.pair}</div>
                    <div className="font-mono" style={{ fontWeight:700, fontSize:22, color:"var(--text-1)", marginTop:4 }}>{t.price}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 10px", borderRadius:100, fontSize:11, fontWeight:700, fontFamily:"'DM Sans',sans-serif", background: t.up ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)", color: t.up ? "#4ADE80" : "#F87171" }}>
                    {t.up ? "▲" : "▼"} {t.change}
                  </div>
                </div>
                {/* Mini sparkline */}
                <div style={{ height:36, display:"flex", alignItems:"flex-end", gap:2, opacity:0.5 }}>
                  {Array.from({ length: 18 }).map((_, j) => {
                    const h = 18 + Math.sin(j * 0.9 + i) * 12 + (j / 18) * 8;
                    return (
                      <div key={j} style={{
                        flex:1, borderRadius:2,
                        height:h,
                        background: t.up
                          ? `rgba(74,222,128,${0.25 + (j / 18) * 0.65})`
                          : `rgba(248,113,113,${0.25 + (j / 18) * 0.65})`,
                      }}/>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:48 }}>
            <Link to="/trading" style={{
              display:"inline-flex", alignItems:"center", gap:8, padding:"14px 32px", borderRadius:100,
              background:"rgba(0,201,184,0.08)", border:"1px solid rgba(0,201,184,0.25)",
              color:"var(--teal)", fontWeight:700, fontSize:14, textDecoration:"none", fontFamily:"'DM Sans',sans-serif",
              transition:"all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(0,201,184,0.15)"; e.currentTarget.style.transform="translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(0,201,184,0.08)"; e.currentTarget.style.transform="translateY(0)"; }}>
              View All Markets <ChevronRight style={{ width:16, height:16 }}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SUPPORT CARDS
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding:"96px 0", background:"var(--bg-deep)" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px" }}>
          <div style={{ textAlign:"center", marginBottom:48 }}>
            <h2 className="font-display" style={{ fontSize:"clamp(28px,4vw,44px)", lineHeight:1.15, color:"var(--text-1)" }}>
              Support and <span style={{ color:"var(--gold)" }}>Resources</span>
            </h2>
            <p style={{ fontSize:15, color:"var(--text-2)", maxWidth:540, margin:"16px auto 0", lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" }}>
              Get the answers, assistance, and education you need to support your trading journey.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {[
              { title:"24/7 Customer Support", action:"Chat Now",  desc:"We provide support and account assistance at every stage of your journey. Our dedicated customer support team is available 24/7 to assist with any trading-related inquiries." },
              { title:"Help Center",           action:"View More", desc:"Find answers to your questions quickly with our comprehensive Help Center. From account setup to trading strategies, our resources provide clear and detailed guidance." },
              { title:"Learn",                 action:"View More", desc:"Access free educational resources to expand your trading knowledge. Whether you are a beginner or an experienced trader, we have articles, webinars, videos, and courses." },
            ].map(c => (
              <div key={c.title} style={{
                border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"32px 28px", textAlign:"center", cursor:"default",
                transition:"all 0.25s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(201,168,76,0.3)"; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow="0 20px 60px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
                <h3 className="font-display" style={{ fontWeight:700, fontSize:17, color:"var(--text-1)", marginBottom:14 }}>{c.title}</h3>
                <p style={{ fontSize:13, color:"var(--text-2)", lineHeight:1.7, marginBottom:24, fontFamily:"'DM Sans',sans-serif" }}>{c.desc}</p>
                <button style={{ fontSize:12, fontWeight:700, color:"var(--gold)", textTransform:"uppercase", letterSpacing:"0.04em", display:"flex", alignItems:"center", gap:6, margin:"0 auto", background:"none", border:"none", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"gap 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.gap = "10px")}
                  onMouseLeave={e => (e.currentTarget.style.gap = "6px")}>
                  {c.action} <ChevronRight style={{ width:14, height:14 }}/>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding:"96px 0", textAlign:"center", position:"relative", overflow:"hidden", background:"linear-gradient(135deg,#060D1A 0%,#0A1628 50%,#06150F 100%)" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 80% at 50% 50%,rgba(201,168,76,0.10),transparent)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1, background:"linear-gradient(90deg,transparent,rgba(201,168,76,0.5),transparent)", pointerEvents:"none" }}/>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 40px", position:"relative", zIndex:10 }}>
          <h2 className="font-display" style={{ fontWeight:900, color:"var(--text-1)", marginBottom:16, fontSize:"clamp(28px,5vw,52px)" }}>
            Start Your Trading Now
          </h2>
          <p style={{ color:"var(--text-2)", fontSize:17, maxWidth:440, margin:"0 auto", fontFamily:"'DM Sans',sans-serif", lineHeight:1.7 }}>
            Join over 5 million traders worldwide. Open an account in minutes.
          </p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:48, margin:"48px 0", borderTop:"1px solid rgba(255,255,255,0.07)", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"36px 0", flexWrap:"wrap" }}>
            {[["5,000,000+","Registered Users"],["1,000+","Products"],["0.0 pips","Spreads From"],["$0","Deposit Fees*"]].map(([val,lab]) => (
              <div key={lab} style={{ textAlign:"center" }}>
                <div className="font-display" style={{ fontWeight:800, fontSize:30, color:"var(--gold)" }}>{val}</div>
                <div style={{ fontSize:13, color:"var(--text-3)", marginTop:4, fontFamily:"'DM Sans',sans-serif" }}>{lab}</div>
              </div>
            ))}
          </div>
          <Link to="/register" style={{
            display:"inline-flex", alignItems:"center", gap:10, padding:"16px 42px", borderRadius:100,
            background:"linear-gradient(135deg,#B8902E,#C9A84C,#E0C070)", color:"#060D1A",
            fontWeight:800, fontSize:16, textDecoration:"none", fontFamily:"'DM Sans',sans-serif",
            boxShadow:"0 16px 48px rgba(201,168,76,0.38)", transition:"all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 22px 56px rgba(201,168,76,0.52)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 16px 48px rgba(201,168,76,0.38)"; }}>
            Start Now <ArrowRight style={{ width:20, height:20 }}/>
          </Link>
        </div>
      </section>

      {/* ── hidden lg show fix ── */}
      <style>{`
        @media(min-width:1024px) { .lg-show { display:block !important; } }
        @media(max-width:1023px) { .lg-show { display:none !important; } }
      `}</style>

    </PublicLayout>
  );
}
