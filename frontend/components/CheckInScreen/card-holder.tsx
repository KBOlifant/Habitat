import React, { useState } from 'react';
import CheckInCard from './check-in-card';
import SwipeableCard from '../General/swipeable-card';

const steps = [
  { title: 'Urge Check', question: 'Are you feeling an urge to engage in your habit right now?' },
  { title: 'Mood Check', question: 'How are you feeling right now?' },
];

export default function CardHolder() {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => Math.min(i + 1, steps.length - 1));

  if (index >= steps.length) return null;
  const current = steps[index];

  return (
    <SwipeableCard onSwipeLeft={next} onSwipeRight={next}>
      <CheckInCard
        step={index + 1}
        totalSteps={steps.length}
        title={current.title}
        question={current.question}
      />
    </SwipeableCard>
  );
}