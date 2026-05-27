"use client";

import React from "react";

interface CardResult {
  cardId: number;
  selectedNumbers: number[];
  matches: number[];
  matchCount: number;
  payout: number;
}

interface Props {
  cardIndex: number; // 0-based index in the grid (stable for avatar cycling)
  cardResult: CardResult;
  drawnNumbers: number[];
  isCompact?: boolean;
}

const MultiCardKenoCard: React.FC<Props> = ({ cardIndex, cardResult, drawnNumbers, isCompact = false }) => {
  const avatarNum = ((cardIndex % 12) + 1).toString().padStart(2, "0");
  const avatarSrc = `/gimboz/cutout/gimbo_${avatarNum}.png`;
  const isMatch = (num: number) => cardResult.matches.includes(num);
  const wasDrawn = (num: number) => drawnNumbers.includes(num);

  // Determine card styling based on payout
  let borderColor = "border-slate-600";
  let statusBg = "bg-slate-900";
  let statusText = "text-slate-400";

  if (cardResult.payout > 0) {
    borderColor = "border-green-500";
    statusBg = "bg-green-900";
    statusText = "text-green-200";
  } else if (cardResult.matchCount > 0) {
    borderColor = "border-blue-500";
    statusBg = "bg-blue-900";
    statusText = "text-blue-200";
  } else {
    borderColor = "border-slate-600";
    statusBg = "bg-red-900";
    statusText = "text-red-200";
  }

  return (
    <div className={`bg-slate-900 border-2 ${borderColor} rounded-lg p-3 transition`}>
      {/* Card Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <img
            src={avatarSrc}
            alt={`Gimbo ${avatarNum}`}
            className="w-7 h-7 object-contain"
            draggable={false}
          />
          <h5 className="text-xs font-bold text-purple-300">Card {cardResult.cardId}</h5>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${statusBg} ${statusText}`}>
          {cardResult.matchCount}M
        </span>
      </div>

      {/* Selected Numbers Grid */}
      <div className={`grid gap-1 mb-2 ${isCompact ? "grid-cols-5" : "grid-cols-5"}`}>
        {cardResult.selectedNumbers.map((num) => (
          <div
            key={num}
            className={`h-6 rounded flex items-center justify-center text-xs font-bold transition ${
              isMatch(num)
                ? "bg-green-500 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            {num}
          </div>
        ))}
      </div>

      {/* Payout */}
      <div className="text-center bg-slate-800 rounded p-1">
        <p className="text-xs text-slate-400">Payout</p>
        <p className={`text-sm font-bold ${cardResult.payout > 0 ? "text-green-400" : "text-slate-400"}`}>
          ${cardResult.payout.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default MultiCardKenoCard;
