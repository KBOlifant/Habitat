import React, { useState } from 'react';
import CheckInCard from './check-in-card';
import SwipeableCard from '../General/swipeable-card';

const steps = [
  { title: 'Mood Check', question: 'Are you feeling an urge to engage in your habit right now?' },
  { title: 'Urge Check', question: 'How are you feeling right now?' },
  { title: 'Minfullness Check', question: 'How are you feeling right now?' },
  { title: 'Gratitude Check', question: 'How are you feeling right now?' },
  { title: 'Relapse Check', question: 'How are you feeling right now?' },
];

export default function CardHolder() {
  const [index, setIndex] = useState(0);
  const next = () => setIndex((i) => Math.min(i + 1, steps.length - 1));

  if (index >= steps.length) return null;
  const current = steps[index];

  return (
    <SwipeableCard onSwipeLeft={next} onSwipeRight={next} animationSpeed={1.4}>
      <CheckInCard
        step={index + 1}
        totalSteps={steps.length}
        title={current.title}
        question={current.question}
      />
    </SwipeableCard>
  );
}