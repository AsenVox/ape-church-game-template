"use client";

import React, { useState, useEffect } from "react";
import MultiCardKenoCard from "./MultiCardKenoCard";
import { CARD_DISPLAY_MODES } from "./multiCardKenoConfig";

interface CardResult {
  cardId: number;
  selectedNumbers: number[];
  matches: number[];
  matchCount: number;
  payout: number;
}

interface GameState {
  selectedNumbers: number[] | null;
  sameAcrossAllCards: boolean;
  numCards: number;
  betPerCard: number;
  drawnNumbers: number[] | null;
  cardResults: CardResult[] | null;
  totalPayout: number;
}

interface Props {
  gameState: GameState;
  currentView: number; // 1: spinning, 2: results, 3: game-over
  isLoading: boolean;
  onPlayAgain: () => void;
  onRewatch: () => void;
  walletBalance: number;
}

const MultiCardKenoWindow: React.FC<Props> = ({
  gameState,
  currentView,
  isLoading,
  onPlayAgain,
  onRewatch,
  walletBalance,
}) => {
  const [visibleCards, setVisibleCards] = useState<number>(0);

  // Stagger card reveal
  useEffect(() => {
    if (currentView === 2 && gameState.cardResults) {
      setVisibleCards(0);
      let cardIndex = 0;
      const staggerDelay = gameState.numCards > 10 ? 100 : 150; // Faster stagger for many cards
      const interval = setInterval(() => {
        cardIndex++;
        if (cardIndex <= gameState.numCards) {
          setVisibleCards(cardIndex);
        } else {
          clearInterval(interval);
        }
      }, staggerDelay);
      return () => clearInterval(interval);
    }
  }, [currentView, gameState.cardResults, gameState.numCards]);

  if (!gameState.cardResults || !gameState.drawnNumbers) {
    return <div>Loading...</div>;
  }

  const totalNewBalance = walletBalance + gameState.totalPayout - gameState.betPerCard * gameState.numCards;
  const isWin = gameState.totalPayout > 0;
  const gridClass = CARD_DISPLAY_MODES[gameState.numCards as keyof typeof CARD_DISPLAY_MODES] || "grid-cols-5";
  
  // Count winning cards
  const winningCards = gameState.cardResults.filter((c) => c.payout > 0).length;

  return (
    <div className="w-full max-w-6xl bg-slate-800 rounded-lg shadow-2xl border border-purple-500 p-6 overflow-auto">
      {/* SPINNING VIEW */}
      {currentView === 1 && (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6 text-purple-300">Drawing Numbers...</h3>
          <div className="grid grid-cols-20 gap-2 mb-6 bg-slate-900 p-4 rounded justify-center">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="h-12 w-12 bg-purple-500 rounded flex items-center justify-center font-bold text-white animate-pulse"
              >
                {gameState.drawnNumbers?.[i] || "?"}
              </div>
            ))}
          </div>
          <p className="text-slate-300">Spinning...</p>
        </div>
      )}

      {/* RESULTS VIEW */}
      {(currentView === 2 || currentView === 3) && (
        <div>
          {/* Drawn Numbers */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Drawn Numbers (20/80)</h4>
            <div className="grid grid-cols-10 gap-1 bg-slate-900 p-3 rounded text-xs max-h-32 overflow-y-auto">
              {gameState.drawnNumbers.map((num) => (
                <div key={num} className="h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold">
                  {num}
                </div>
              ))}
            </div>
          </div>

          {/* Card Grid - Responsive based on card count */}
          <div className={`grid ${gridClass} gap-4 mb-6`}>
            {gameState.cardResults.slice(0, visibleCards).map((cardResult) => (
              <MultiCardKenoCard
                key={cardResult.cardId}
                cardResult={cardResult}
                drawnNumbers={gameState.drawnNumbers}
                isCompact={gameState.numCards > 4}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="bg-slate-900 rounded p-4 border border-slate-700 mb-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <span className="text-slate-400 text-xs">Total Bet</span>
                <p className="font-semibold text-slate-200">${(gameState.betPerCard * gameState.numCards).toFixed(2)}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Total Payout</span>
                <p className={`font-semibold ${isWin ? "text-green-400" : "text-red-400"}`}>
                  ${gameState.totalPayout.toFixed(2)}
                </p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Winning Cards</span>
                <p className="font-semibold text-slate-200">{winningCards}/{gameState.numCards}</p>
              </div>
              <div>
                <span className="text-slate-400 text-xs">Net Result</span>
                <p className={`text-lg font-bold ${totalNewBalance > walletBalance ? "text-green-400" : "text-red-400"}`}>
                  {totalNewBalance > walletBalance ? "+" : ""}${(totalNewBalance - walletBalance).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onRewatch}
              className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded transition"
            >
              Rewatch Draw
            </button>
            <button
              onClick={onPlayAgain}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded transition disabled:opacity-50"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiCardKenoWindow;
