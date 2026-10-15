"use client";
import { useEffect, useState } from "react";
import { getRaceStatus, todayInKigali, type Race } from "@/data/races";
const MN = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const TV = [{v:"all",l:"All teams"},{v:"men",l:"Men"},{v:"women",l:"Women"},{v:"junior",l:"Junior (U-19)"}];
function fmt(s: string, e?: string): string {
  const a = s.split("-").map(Number);
  if (!e) return MN[a[1]-1]+" "+a[2]+", "+a[0];
  const b = e.split("-").map(Number);
  if (a[0]===b[0]) return MN[a[1]-1]+" "+a[2]+" \u2013 "+MN[b[1]-1]+" "+b[2]+", "+a[0];
  return MN[a[1]-1]+" "+a[2]+", "+a[0]+" \u2013 "+MN[b[1]-1]+" "+b[2]+", "+b[0];
}
export default function UpcomingRaces({ races, todayIso }: { races: Race[]; todayIso: string }) {
  const [today,setToday]=useState(todayIso);
  useEffect(()=>{const id=todayInKigali();queueMicrotask(()=>setToday(id));},[]);
  const [team,setTeam]=useState("all");
  const [month,setMonth]=useState("Month");
  const [year,setYear]=useState("Year");
  const months:number[]=[];
  races.forEach((r)=>{const m=Number(r.startDate.slice(5,7));if(!months.includes(m))months.push(m);});
  months.sort((a,b)=>a-b);
  const years:string[]=[];
  races.forEach((r)=>{const y=r.startDate.slice(0,4);if(!years.includes(y))years.push(y);});
  years.sort();
  const f=races.filter((r)=>{
    if(team!=="all"&&r.team!==team&&r.team!=="all")return false;
    if(month!=="Month"&&MN[Number(r.startDate.slice(5,7))-1]!==month)return false;
    if(year!=="Year"&&r.startDate.slice(0,4)!==year)return false;
    return true;
  });
  const ord={ongoing:0,upcoming:1,completed:2};
  const s=f.slice().sort((a,b)=>{
    const sa=getRaceStatus(a,today);const sb=getRaceStatus(b,today);
    if(sa!==sb)return ord[sa]-ord[sb];
    if(sa==="completed")return a.startDate<b.startDate?1:a.startDate>b.startDate?-1:0;
    return a.startDate<b.startDate?-1:a.startDate>b.startDate?1:0;
  });
  const sc="appearance-none rounded-sm border border-white/20 bg-brand-navy px-4 py-2.5 pr-10 text-sm text-white outline-none hover:border-white/40 focus:ring-2 focus:ring-brand-lime focus:ring-offset-2 focus:ring-offset-brand-navy";
  return(<section className="py-12 md:py-16"><h2 className="font-display text-3xl font-bold uppercase tracking-wide text-white md:text-4xl">UPCOMING RACES</h2><div className="mt-6 flex flex-wrap gap-3"><div className="relative"><label className="sr-only" htmlFor="filter-team">Filter by team</label><select id="filter-team" value={team} onChange={(e)=>setTeam(e.target.value)} className={sc}>{TV.map((t)=>(<option key={t.v} value={t.v}>{t.l}</option>))}</select><Chev className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /></div><div className="relative"><label className="sr-only" htmlFor="filter-month">Filter by month</label><select id="filter-month" value={month} onChange={(e)=>setMonth(e.target.value)} className={sc}><option value="Month">Month</option>{months.map((m)=>(<option key={m} value={MN[m-1]}>{MN[m-1]}</option>))}</select><Chev className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /></div><div className="relative"><label className="sr-only" htmlFor="filter-year">Filter by year</label><select id="filter-year" value={year} onChange={(e)=>setYear(e.target.value)} className={sc}><option value="Year">Year</option>{years.map((y)=>(<option key={y} value={y}>{y}</option>))}</select><Chev className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /></div></div><div className="mt-6 overflow-x-auto rounded-sm border border-blue-900/50 bg-[#0c1626]"><table className="w-full min-w-[640px] text-left"><caption className="sr-only">Races</caption><thead className="bg-white/5"><tr><th scope="col" className="px-4 py-3 text-sm font-semibold text-gray-200">Race Name</th><th scope="col" className="px-4 py-3 text-sm font-semibold text-gray-200">Date</th><th scope="col" className="px-4 py-3 text-sm font-semibold text-gray-200">Location</th><th scope="col" className="px-4 py-3 text-sm font-semibold text-gray-200">Status</th></tr></thead><tbody>{s.length===0?(<tr className="border-t border-blue-900/50"><td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">No races match your filters.</td></tr>):(s.map((race,idx)=>{const st=getRaceStatus(race,today);return(<tr key={race.id} className={idx%2===1?"border-t border-blue-900/50 bg-white/[0.03] text-sm text-gray-200":"border-t border-blue-900/50 text-sm text-gray-200"}><td className="px-4 py-3 font-medium text-white">{race.name}</td><td className="px-4 py-3 text-sm text-gray-200">{fmt(race.startDate,race.endDate)}</td><td className="px-4 py-3 text-sm text-gray-200">{race.location}</td><td className="px-4 py-3">{st==="ongoing"?(<span className="inline-flex items-center gap-1.5 rounded-full bg-brand-lime px-3 py-1 text-xs font-medium text-black"><span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-black motion-reduce:hidden" />Ongoing</span>):st==="upcoming"?(<span className="inline-flex items-center gap-1.5 rounded-full border border-brand-lime/60 px-3 py-1 text-xs font-medium text-brand-lime">Upcoming</span>):(<span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-gray-400">Completed</span>)}</td></tr>);}))}</tbody></table></div><div className="sr-only" role="status" aria-live="polite">{s.length} races shown</div></section>);
}
function Chev({ className }: { className?: string }) {
  return(<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>);
}
