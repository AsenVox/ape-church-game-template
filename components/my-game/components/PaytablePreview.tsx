"use client";

import React, { useMemo } from "react";
import { payoutMultiplier } from "../utils/kenoPaytables";

type Props = {
  spotsPicked: number;
  bet: number;
};

export default function PaytablePreview({ spotsPicked, bet }: Props) {
  const rows = useMemo(() => {
    if (spotsPicked <= 0) return [];
    const out: Array<{ hits: number; mult: number; win: number; full: boolean }> = [];
    for (let hits = 1; hits <= spotsPicked; hits++) {
      const mult = payoutMultiplier(spotsPicked, hits);
      if (mult > 0) {
        out.push({
          hits,
          mult,
          win: mult * bet,
          full: hits === spotsPicked,
        });
      }
    }
    // show highest wins first (Vegas-ish attention)
    out.sort((a, b) => b.win - a.win);
    return out.slice(0, 8);
  }, [spotsPicked, bet]);

  return (
    <div className="mt-4 bg-slate-900/60 border border-slate-700 rounded p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-slate-200">Paytable (this card)</div>
        <div className="text-xs text-slate-400">spots: {spotsPicked || 0}</div>
      </div>

      {spotsPicked <= 0 ? (
        <div className="text-xs text-slate-400">Pick some numbers to see payouts.</div>
      ) : rows.length === 0 ? (
        <div className="text-xs text-slate-400">No win tiers for this spot count (placeholder table).</div>
      ) : (
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-slate-400 font-semibold">HIT</div>
          <div className="text-slate-400 font-semibold text-right">WIN</div>
          {rows.map((r) => (
            <React.Fragment key={r.hits}>
              <div className={r.full ? "text-amber-200 font-bold" : "text-slate-200"}>
                {r.hits}/{spotsPicked} {r.full ? "(FULL)" : ""}
              </div>
              <div className={r.win > 0 ? (r.full ? "text-amber-200 font-bold text-right" : "text-green-300 font-semibold text-right") : "text-slate-400 text-right"}>
                {r.win}
              </div>
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="mt-2 text-[11px] text-slate-500">
        Placeholder payouts (for UX). We’ll swap in audited Vegas tables later.
      </div>
    </div>
  );
}
