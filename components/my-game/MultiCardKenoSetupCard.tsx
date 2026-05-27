"use client";

import React, { useState } from "react";
import { CARD_COUNTS } from "./multiCardKenoConfig";

interface Props {
  selectedNumbers: number[];
  numCards: number;
  betPerCard: number;
  totalCost: number;
  walletBalance: number;
  onSelectNumbers: (numbers: number[], sameAcrossAllCards: boolean) => void;
  onCardCountChange: (numCards: number) => void;
  onBetChange: (bet: number) => void;
  onPlayGame: () => void;
  isLoading: boolean;
}

const MultiCardKenoSetupCard: React.FC<Props> = ({
  selectedNumbers,
  numCards,
  betPerCard,
  totalCost,
  walletBalance,
  onSelectNumbers,
  onCardCountChange,
  onBetChange,
  onPlayGame,
  isLoading,
}) => {
  const [tempNumbers, setTempNumbers] = useState<number[]>(selectedNumbers);
  const [sameAcrossAll, setSameAcrossAll] = useState(true);

  const toggleNumber = (num: number) => {
    if (tempNumbers.includes(num)) {
      setTempNumbers(tempNumbers.filter((n) => n !== num));
    } else {
      if (tempNumbers.length < 10) {
        setTempNumbers([...tempNumbers, num].sort((a, b) => a - b));
      }
    }
  };

  const handleConfirm = () => {
    if (tempNumbers.length < 2) {
      alert("Select at least 2 numbers");
      return;
    }
    if (totalCost > walletBalance) {
      alert("Insufficient balance");
      return;
    }
    onSelectNumbers(tempNumbers, sameAcrossAll);
  };

  const clearSelection = () => {
    setTempNumbers([]);
  };

  const canPlay = tempNumbers.length >= 2 && totalCost <= walletBalance;

  return (
    <div className="w-full max-w-3xl bg-slate-800 rounded-lg shadow-2xl border border-purple-500 p-6">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-300">Multi-Card Keno</h2>

      {/* Instructions */}
      <p className="text-sm text-slate-300 mb-6 text-center">
        Select 2-10 numbers. Your selection will play on all cards simultaneously.
      </p>

      {/* Card Count Selector */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-200 mb-3">Number of Cards</label>
        <div className="flex gap-3">
          {CARD_COUNTS.map((count) => (
            <button
              key={count}
              onClick={() => onCardCountChange(count)}
              className={`flex-1 px-4 py-2 font-semibold rounded transition ${
                numCards === count
                  ? "bg-purple-600 text-white border-2 border-purple-300"
                  : "bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600"
              }`}
            >
              {count}-Card
            </button>
          ))}
        </div>
      </div>

      {/* Number Grid */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-200 mb-3">Select Numbers (1-80)</label>
        <div className="grid grid-cols-10 gap-2 bg-slate-900 p-4 rounded max-h-96 overflow-y-auto">
          {Array.from({ length: 80 }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => toggleNumber(num)}
              className={`h-8 text-xs font-bold rounded transition ${
                tempNumbers.includes(num)
                  ? "bg-purple-500 text-white border-2 border-purple-300"
                  : "bg-slate-700 text-slate-300 border border-slate-600 hover:bg-slate-600"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">Selected: {tempNumbers.length}/10</p>
      </div>

      {/* Bet Amount */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-200 mb-2">Bet Per Card</label>
        <input
          type="number"
          value={betPerCard}
          onChange={(e) => onBetChange(parseFloat(e.target.value) || 0)}
          min="0.1"
          max="100"
          step="0.1"
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white"
        />
        <p className="text-xs text-slate-400 mt-1">Total cost for {numCards} cards: ${totalCost.toFixed(2)}</p>
      </div>

      {/* Same Across All Cards Toggle */}
      <div className="mb-6 flex items-center">
        <input
          type="checkbox"
          id="sameAcrossAll"
          checked={sameAcrossAll}
          onChange={(e) => setSameAcrossAll(e.target.checked)}
          className="w-4 h-4 accent-purple-500"
        />
        <label htmlFor="sameAcrossAll" className="ml-3 text-sm text-slate-300">
          Use same numbers on all {numCards} cards
        </label>
      </div>

      {/* Balance & Cost Summary */}
      <div className="mb-6 bg-slate-900 rounded p-4 border border-slate-700">
        <div className="flex justify-between mb-2">
          <span className="text-slate-400">Wallet Balance:</span>
          <span className="font-semibold text-slate-200">${walletBalance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-slate-400">Total Cost ({numCards} cards):</span>
          <span className={`font-semibold ${totalCost <= walletBalance ? "text-green-400" : "text-red-400"}`}>
            ${totalCost.toFixed(2)}
          </span>
        </div>
        {totalCost > walletBalance && (
          <p className="text-xs text-red-400 mt-2">⚠ Insufficient funds</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={clearSelection}
          className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded transition"
        >
          Clear
        </button>
        <button
          onClick={handleConfirm}
          disabled={!canPlay || isLoading}
          className={`flex-1 px-4 py-3 font-semibold rounded transition ${
            canPlay
              ? "bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
              : "bg-slate-600 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? "Playing..." : "Play"}
        </button>
      </div>

      {/* Payout Info */}
      <div className="mt-6 text-xs text-slate-400">
        <p className="font-semibold text-slate-300 mb-2">Sample Payouts (10-Spot):</p>
        <div className="grid grid-cols-3 gap-2">
          <div>3 Match = 1x</div>
          <div>5 Match = 3x</div>
          <div>10 Match = 10000x</div>
        </div>
        <p className="mt-3 font-semibold text-slate-300">Strategy Tip:</p>
        <p>Higher card count = more chances to win, but higher total bet. All {numCards} cards use the same {tempNumbers.length}-number set.</p>
      </div>
    </div>
  );
};

export default MultiCardKenoSetupCard;
