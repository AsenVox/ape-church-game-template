"use client";

import React, { useMemo, useState } from "react";
import { CardCount, CARD_COUNTS, BetStep } from "./multiCardKenoConfig";
import MyGameSetupCard from "./MyGameSetupCard";
import MyGameWindow from "./MyGameWindow";
import { drawNumbers, countMatches, payoutForCard, randomCardPicks } from "./utils/kenoMath";

export type KenoCard = {
  id: number;
  picks: number[]; // length=10
  bet: BetStep;
};

export type CardResult = {
  id: number;
  matches: number;
  payout: number;
};

export type KenoGameState = {
  cardCount: CardCount;
  cards: KenoCard[];
  activeCardIndex: number;
  speed: 0 | 1 | 2; // 0 slow, 1 med, 2 fast
  drawn: number[];
  revealedCount: number; // animation progress
  results: CardResult[];
  totalBet: number;
  totalPayout: number;
};

const DEFAULT_BET: BetStep = 1;

function makeCards(count: CardCount): KenoCard[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    picks: [],
    bet: DEFAULT_BET,
  }));
}

const MyGame: React.FC = () => {
  const [currentView, setCurrentView] = useState<0 | 1 | 2>(0); // 0 setup, 1 draw/ongoing, 2 game over

  // Local-only test bankroll (fake money)
  const [bankroll, setBankroll] = useState<number>(10000);

  const [state, setState] = useState<KenoGameState>(() => ({
    cardCount: 4,
    cards: makeCards(4),
    activeCardIndex: 0,
    speed: 1,
    drawn: [],
    revealedCount: 0,
    results: [],
    totalBet: 0,
    totalPayout: 0,
  }));

  const overlaps = useMemo(() => {
    const freq = new Map<number, number>();
    for (const c of state.cards) {
      for (const n of c.picks) freq.set(n, (freq.get(n) ?? 0) + 1);
    }
    return freq;
  }, [state.cards]);

  const totalBet = useMemo(() => state.cards.reduce((s, c) => s + (c.bet ?? 0), 0), [state.cards]);

  const setCardCount = (count: CardCount) => {
    setState((prev) => ({
      ...prev,
      cardCount: count,
      cards: makeCards(count),
      activeCardIndex: 0,
      drawn: [],
      revealedCount: 0,
      results: [],
      totalBet: 0,
      totalPayout: 0,
    }));
    setCurrentView(0);
  };

  const setSpeed = (speed: 0 | 1 | 2) => setState((p) => ({ ...p, speed }));

  const setActiveCardIndex = (idx: number) => setState((p) => ({ ...p, activeCardIndex: idx }));

  const updateActiveCardPicks = (nextPicks: number[]) => {
    setState((prev) => {
      const cards = [...prev.cards];
      cards[prev.activeCardIndex] = { ...cards[prev.activeCardIndex], picks: nextPicks };
      return { ...prev, cards };
    });
  };

  const updateActiveCardBet = (bet: BetStep) => {
    setState((prev) => {
      const cards = [...prev.cards];
      cards[prev.activeCardIndex] = { ...cards[prev.activeCardIndex], bet };
      return { ...prev, cards };
    });
  };

  const copyBetToAll = () => {
    setState((prev) => {
      const bet = prev.cards[prev.activeCardIndex].bet;
      return { ...prev, cards: prev.cards.map((c) => ({ ...c, bet })) };
    });
  };

  const autoPickActive = () => updateActiveCardPicks(randomCardPicks());

  const clearActive = () => updateActiveCardPicks([]);

  // Direct play: setup -> draw (no separate overview screen)
  const playGame = () => {
    placeBetAndDraw();
  };

  const placeBetAndDraw = () => {
    // Allow 0–10 picks per card. Only "active" cards (>=1 pick) participate.
    const activeCards = state.cards.filter((c) => c.picks.length >= 1);
    if (activeCards.length === 0) {
      alert("Pick at least 1 number on at least 1 card.");
      return;
    }

    const drawn = drawNumbers();
    const results: CardResult[] = state.cards.map((c) => {
      const m = countMatches(c.picks, drawn);
      const payout = payoutForCard(c.picks.length, m, c.bet);
      return { id: c.id, matches: m, payout };
    });
    const totalPayout = results.reduce((s, r) => s + r.payout, 0);

    setState((prev) => ({
      ...prev,
      drawn,
      revealedCount: 0,
      results,
      totalBet,
      totalPayout,
    }));

    // Update local fake bankroll
    setBankroll((b) => b - totalBet + totalPayout);

    setCurrentView(1);
  };

  const handleReset = () => {
    setState((prev) => ({
      ...prev,
      cards: makeCards(prev.cardCount),
      activeCardIndex: 0,
      drawn: [],
      revealedCount: 0,
      results: [],
      totalBet: 0,
      totalPayout: 0,
    }));
    setCurrentView(0);
  };

  const handlePlayAgain = () => {
    // keep cards as-is, just redraw
    placeBetAndDraw();
  };

  return (
    <div className="w-full h-full p-4 text-white">
      {currentView === 0 && (
        <MyGameSetupCard
          cardCount={state.cardCount}
          cardCounts={CARD_COUNTS as unknown as CardCount[]}
          cards={state.cards}
          activeCardIndex={state.activeCardIndex}
          overlaps={overlaps}
          totalBet={totalBet}
          onSetCardCount={setCardCount}
          onSetActiveCardIndex={setActiveCardIndex}
          onUpdateActiveCardPicks={updateActiveCardPicks}
          onUpdateActiveCardBet={updateActiveCardBet}
          onCopyBetToAll={copyBetToAll}
          onAutoPickActive={autoPickActive}
          onClearActive={clearActive}
          bankroll={bankroll}
          onAddBankroll={() => setBankroll((b) => b + 10000)}
          onResetBankroll={() => setBankroll(10000)}
          speed={state.speed}
          onChangeSpeed={setSpeed}
          onPlay={playGame}
        />
      )}

      {currentView === 1 && (
        <MyGameWindow
          mode="draw"
          cards={state.cards}
          overlaps={overlaps}
          totalBet={state.totalBet}
          drawn={state.drawn}
          results={state.results}
          totalPayout={state.totalPayout}
          onBack={() => setCurrentView(0)}
          onReset={handleReset}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </div>
  );
};

export default MyGame;
