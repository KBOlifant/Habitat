/**
 * BonsaiGrower.js
 * -----------------------------------------------------------------------
 * A generative bonsai-growing mechanic for React Native.
 */

import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Svg, { Line, Ellipse, Circle, Path } from 'react-native-svg';
import Slider from '@react-native-community/slider';
import { Typography } from '../constants/typography';

/* ------------------------------------------------------------------ */
/* Math helpers                                                       */
/* ------------------------------------------------------------------ */

// Deterministic PRNG (mulberry32) so a given seed always draws the same tree.
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const smoothstep = (edge0, edge1, x) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

function polylineLength(pts) {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  return len;
}

function pointAlongPolyline(pts, fraction) {
  const total = polylineLength(pts);
  const target = total * clamp01(fraction);
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const segLen = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (acc + segLen >= target || i === pts.length - 1) {
      const t = segLen === 0 ? 0 : clamp01((target - acc) / segLen);
      return { x: lerp(pts[i - 1].x, pts[i].x, t), y: lerp(pts[i - 1].y, pts[i].y, t) };
    }
    acc += segLen;
  }
  return pts[pts.length - 1];
}

function partialPolyline(pts, fraction) {
  if (fraction <= 0) return [pts[0]];
  const total = polylineLength(pts);
  const target = total * clamp01(fraction);
  let acc = 0;
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const segLen = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (acc + segLen >= target) {
      const t = segLen === 0 ? 0 : (target - acc) / segLen;
      out.push({ x: lerp(pts[i - 1].x, pts[i].x, t), y: lerp(pts[i - 1].y, pts[i].y, t) });
      return out;
    }
    acc += segLen;
    out.push(pts[i]);
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Generative tree model                                              */
/* ------------------------------------------------------------------ */

const BASE = { x: 150, y: 358 };

// Builds the FULL-GROWN geometry of one bonsai from a seed and parameters.
function buildTree(seed, leavesPot, flowersPot, heightPot) {
  const rng = mulberry32(seed);

  // Height is dynamically scaled based on the height slider
  const TRUNK_HEIGHT = lerp(130, 280, heightPot);

  const trunkPts = [BASE];
  const segments = 5;
  let curX = BASE.x;
  let dir = rng() > 0.5 ? 1 : -1;
  for (let i = 1; i <= segments; i++) {
    const stepY = TRUNK_HEIGHT / segments;
    const swing = lerp(20, 8, i / segments);
    curX += dir * (swing * (0.5 + rng() * 0.5));
    dir *= -1;
    trunkPts.push({ x: curX, y: BASE.y - stepY * i });
  }

  // Branch count scales based on the leaves slider
  const baseBranchCount = Math.floor(lerp(2, 9, leavesPot));
  const branchCount = baseBranchCount + Math.floor(rng() * 3);
  const branches = [];
  let side = rng() > 0.5 ? 1 : -1;

  for (let i = 0; i < branchCount; i++) {
    const attachT = clamp01(lerp(0.32, 0.92, (i + 0.5) / Math.max(1, branchCount)) + (rng() - 0.5) * 0.06);
    const attachPoint = pointAlongPolyline(trunkPts, attachT);
    side *= -1;
    const angleDeg = side * lerp(50, 75, rng());
    const length = lerp(70, 40, attachT) * (0.85 + rng() * 0.3) * lerp(0.8, 1.2, heightPot);
    const rad = (angleDeg * Math.PI) / 180;
    const endPoint = {
      x: attachPoint.x + Math.sin(rad) * length,
      y: attachPoint.y - Math.cos(rad) * length,
    };
    
    const appearAt = 0.4 + i * (0.32 / Math.max(1, branchCount)) + rng() * 0.03;

    const branch = {
      id: `b${i}`,
      attachPoint,
      endPoint,
      width: lerp(7, 4, attachT),
      appearAt,
      children: [],
    };

    // Sub-branches scale based on the leaves slider as well
    const subBaseCount = Math.floor(lerp(1, 4, leavesPot));
    const subCount = subBaseCount + Math.floor(rng() * 2);
    
    for (let j = 0; j < subCount; j++) {
      const subT = lerp(0.55, 0.9, subCount === 1 ? 0.7 : j / (subCount - 1));
      const subAttach = {
        x: lerp(attachPoint.x, endPoint.x, subT),
        y: lerp(attachPoint.y, endPoint.y, subT),
      };
      const subSide = j % 2 === 0 ? side : -side;
      const subAngleDeg = angleDeg + subSide * lerp(20, 40, rng());
      const subLength = length * lerp(0.45, 0.65, rng());
      const subRad = (subAngleDeg * Math.PI) / 180;
      const subEnd = {
        x: subAttach.x + Math.sin(subRad) * subLength,
        y: subAttach.y - Math.cos(subRad) * subLength,
      };
      branch.children.push({
        id: `${branch.id}s${j}`,
        attachPoint: subAttach,
        endPoint: subEnd,
        width: branch.width * 0.55,
        appearAt: branch.appearAt + 0.12 + rng() * 0.04,
        children: [],
      });
    }
    branches.push(branch);
  }

  const nebariCount = 4 + Math.floor(rng() * 3);
  const nebari = [];
  for (let i = 0; i < nebariCount; i++) {
    const angle = (i / nebariCount) * Math.PI + (rng() - 0.5) * 0.3 + Math.PI * 0.15;
    const len = lerp(14, 24, rng());
    nebari.push({
      x2: BASE.x + Math.cos(angle) * len,
      y2: BASE.y + Math.sin(angle) * len * 0.3 + 4,
    });
  }

  const terminals = [];
  branches.forEach((b) => {
    if (b.children.length === 0) terminals.push(b);
    else b.children.forEach((c) => terminals.push(c));
  });
  
  // Blossom site count scales based on the flowers slider
  const blossoms = [];
  const maxBlossoms = terminals.length * 2.5;
  const blossomSiteCount = Math.floor(lerp(0, maxBlossoms, flowersPot) * (0.5 + rng() * 0.5));
  
  for (let i = 0; i < blossomSiteCount; i++) {
    // Only place on available terminals, wrapping around if needed
    if (terminals.length === 0) break;
    const t = terminals[Math.floor(rng() * terminals.length)];
    blossoms.push({ x: t.endPoint.x + (rng() - 0.5) * 12, y: t.endPoint.y + (rng() - 0.5) * 10 });
  }

  return { trunkPts, branches, nebari, blossoms, seed };
}

function flattenBranches(branches) {
  const out = [];
  branches.forEach((b) => {
    out.push(b);
    b.children.forEach((c) => out.push(c));
  });
  return out;
}

function getStage(g) {
  if (g < 0.06) return { label: 'Seed', emoji: '\u25CF' };
  if (g < 0.18) return { label: 'Sprout', emoji: '\u2701' };
  if (g < 0.4) return { label: 'Seedling', emoji: '\u2698' };
  if (g < 0.62) return { label: 'Young Tree', emoji: '\u2698' };
  if (g < 0.85) return { label: 'Juvenile Bonsai', emoji: '\u2698' };
  return { label: 'Mature Bonsai', emoji: '\u2698' };
}

/* ------------------------------------------------------------------ */
/* SVG illustration                                                   */
/* ------------------------------------------------------------------ */

const COLORS = {
  pot: '#9a5b34',
  potDark: '#7a4423',
  potRim: '#b56d40',
  soil: '#4a3728',
  soilDark: '#392a1e',
  seed: '#6b4226',
  seedHighlight: '#8a5a35',
  trunk: '#6b4a35',
  trunkDark: '#5a3d2c',
  leafA: '#4f7942',
  leafB: '#6b8e4e',
  leafC: '#3d6b35',
  cotyledon: '#7fae5c',
  blossom: '#e8a0bd',
  blossomCenter: '#c96f92',
};

function BonsaiSvg({ tree, growth }) {
  const g = growth;

  const thicknessScale = smoothstep(0.05, 0.3, g) * 0.75 + smoothstep(0.3, 1.0, g) * 0.25;
  const heightFraction = smoothstep(0.05, 0.45, g);
  const trunkPartial = partialPolyline(tree.trunkPts, heightFraction);
  const baseWidth = 15 * thicknessScale;
  const topWidth = 3.5 * thicknessScale;
  
  const trunkSegments = [];
  for (let i = 1; i < trunkPartial.length; i++) {
    const wFrom = lerp(baseWidth, topWidth, (i - 1) / (tree.trunkPts.length - 1));
    const wTo = lerp(baseWidth, topWidth, i / (tree.trunkPts.length - 1));
    trunkSegments.push({
      x1: trunkPartial[i - 1].x,
      y1: trunkPartial[i - 1].y,
      x2: trunkPartial[i].x,
      y2: trunkPartial[i].y,
      width: (wFrom + wTo) / 2,
      key: `trunk-${i}`,
    });
  }

  const flat = flattenBranches(tree.branches);
  const branchDraws = flat.map((br) => {
    const progress = smoothstep(br.appearAt, br.appearAt + 0.15, g);
    const curEnd = {
      x: lerp(br.attachPoint.x, br.endPoint.x, progress),
      y: lerp(br.attachPoint.y, br.endPoint.y, progress),
    };
    const width = br.width * (0.25 + 0.75 * progress) * thicknessScale;

    const padAppearAt = br.appearAt + 0.08;
    const padProgress =
      smoothstep(padAppearAt, padAppearAt + 0.18, g) * 0.7 +
      smoothstep(padAppearAt + 0.18, 1.0, g) * 0.3;
      
    const isTerminal = br.children.length === 0;
    const baseRx = isTerminal ? 27 : 19;
    const baseRy = isTerminal ? 17 : 13;

    return {
      id: br.id,
      x1: br.attachPoint.x,
      y1: br.attachPoint.y,
      x2: curEnd.x,
      y2: curEnd.y,
      width,
      progress,
      pad: {
        cx: curEnd.x,
        cy: curEnd.y,
        rx: baseRx * padProgress,
        ry: baseRy * padProgress,
        opacity: clamp01(padProgress * 1.3),
      },
    };
  });

  const seedOpacity = 1 - smoothstep(0.02, 0.07, g);
  const cotyledonOpacity = smoothstep(0.05, 0.1, g) * (1 - smoothstep(0.22, 0.32, g));
  const nebariOpacity = smoothstep(0.62, 0.78, g);
  const blossomOpacity = smoothstep(0.92, 1.0, g);

  return (
    <Svg width="100%" height="100%" viewBox="0 0 300 420" preserveAspectRatio="xMidYMid meet">
      {/* Pot */}
      <Path
        d="M85 358 L215 358 L205 402 Q150 410 95 402 Z"
        fill={COLORS.pot}
        stroke={COLORS.potDark}
        strokeWidth={2}
      />
      <Path d="M78 350 L222 350 L215 360 L85 360 Z" fill={COLORS.potRim} />

      {/* Soil */}
      <Ellipse cx={150} cy={354} rx={72} ry={9} fill={COLORS.soil} />
      <Ellipse cx={150} cy={352.5} rx={72} ry={7.5} fill={COLORS.soilDark} opacity={0.5} />

      {/* Nebari / surface roots - Unmount completely if 0% to prevent artifacts */}
      {nebariOpacity > 0.01 && tree.nebari.map((n, i) => (
        <Line
          key={`nebari-${i}`}
          x1={BASE.x}
          y1={BASE.y}
          x2={n.x2}
          y2={n.y2}
          stroke={COLORS.trunkDark}
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={nebariOpacity}
        />
      ))}

      {/* Seed */}
      <G_Seed opacity={seedOpacity} />

      {/* Cotyledon (first) leaves - Unmount completely if 0% to prevent artifacts */}
      {cotyledonOpacity > 0.01 && (
        <React.Fragment>
          <Ellipse cx={141} cy={344} rx={7} ry={4} fill={COLORS.cotyledon} opacity={cotyledonOpacity} transform="rotate(-25 141 344)" />
          <Ellipse cx={159} cy={344} rx={7} ry={4} fill={COLORS.cotyledon} opacity={cotyledonOpacity} transform="rotate(25 159 344)" />
        </React.Fragment>
      )}

      {/* Trunk */}
      {trunkSegments.map((s) => (
        <Line
          key={s.key}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          stroke={COLORS.trunk}
          strokeWidth={s.width}
          strokeLinecap="round"
        />
      ))}

      {/* Branches */}
      {branchDraws.map((b) =>
        b.progress > 0.01 ? (
          <Line
            key={b.id}
            x1={b.x1}
            y1={b.y1}
            x2={b.x2}
            y2={b.y2}
            stroke={COLORS.trunk}
            strokeWidth={Math.max(b.width, 1)}
            strokeLinecap="round"
          />
        ) : null
      )}

      {/* Foliage pads */}
      {branchDraws.map((b) =>
        b.pad.opacity > 0.01 ? (
          <React.Fragment key={`pad-${b.id}`}>
            <Ellipse cx={b.pad.cx} cy={b.pad.cy + 2} rx={b.pad.rx} ry={b.pad.ry} fill={COLORS.leafC} opacity={b.pad.opacity * 0.9} />
            <Ellipse cx={b.pad.cx - b.pad.rx * 0.25} cy={b.pad.cy} rx={b.pad.rx * 0.85} ry={b.pad.ry * 0.85} fill={COLORS.leafA} opacity={b.pad.opacity} />
            <Ellipse cx={b.pad.cx + b.pad.rx * 0.3} cy={b.pad.cy - b.pad.ry * 0.3} rx={b.pad.rx * 0.55} ry={b.pad.ry * 0.55} fill={COLORS.leafB} opacity={b.pad.opacity} />
          </React.Fragment>
        ) : null
      )}

      {/* Blossoms - Unmount completely if 0% to prevent artifacts */}
      {blossomOpacity > 0.01 && tree.blossoms.map((bl, i) => (
        <React.Fragment key={`blossom-${i}`}>
          <Circle cx={bl.x} cy={bl.y} r={3} fill={COLORS.blossom} opacity={blossomOpacity} />
          <Circle cx={bl.x} cy={bl.y} r={1.2} fill={COLORS.blossomCenter} opacity={blossomOpacity} />
        </React.Fragment>
      ))}
    </Svg>
  );
}

export function BonsaiCanvas({ growth }) {
  const [seed, setSeed] = useState(20260824);

  // New Adjustments (0.0 to 1.0)
  const [leavesPot, setLeavesPot] = useState(0.5);
  const [flowersPot, setFlowersPot] = useState(0.5);
  const [heightPot, setHeightPot] = useState(0.5);
  
  const tree = useMemo(() => buildTree(seed, leavesPot, flowersPot, heightPot), [seed, leavesPot, flowersPot, heightPot]);
  const stage = getStage(growth);
  
  return(
    <>
      <View className="mx-6 mt-4 rounded-3xl bg-sky-50 border border-stone-200 items-center justify-center py-4 shadow-sm" style={{ height: 380 }}>
        <BonsaiSvg tree={tree} growth={growth} />
      </View>

      <View className="items-center mt-4">
        <Text className="text-lg font-semibold text-emerald-800">{stage.label}</Text>
        <Text className="text-stone-400 text-sm mt-1">{Math.round(growth * 100)}% grown</Text>
      </View>
    </>
  );
  
}

function G_Seed({ opacity }) {
  if (opacity <= 0.01) return null;
  return (
    <React.Fragment>
      <Ellipse cx={150} cy={349} rx={6.5} ry={9} fill={COLORS.seed} opacity={opacity} transform="rotate(8 150 349)" />
      <Ellipse cx={148} cy={345} rx={2.2} ry={3.5} fill={COLORS.seedHighlight} opacity={opacity} transform="rotate(8 148 345)" />
    </React.Fragment>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */

export default function BonsaiGrower() {
  const [seed, setSeed] = useState(20260824);
  const [growth, setGrowth] = useState(0);
  
  // New Adjustments (0.0 to 1.0)
  const [leavesPot, setLeavesPot] = useState(0.5);
  const [flowersPot, setFlowersPot] = useState(0.5);
  const [heightPot, setHeightPot] = useState(0.5);

  const tree = useMemo(() => buildTree(seed, leavesPot, flowersPot, heightPot), [seed, leavesPot, flowersPot, heightPot]);
  const stage = getStage(growth);

  const handleNewBonsai = useCallback(() => {
    setSeed(Math.floor(Math.random() * 1_000_000));
    setGrowth(0);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-stone-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-6 pb-2 items-center">
          <Text className="text-stone-800" style={Typography.title}>Bonsai Grower</Text>
          <Text className="text-stone-500 text-base mt-1">Scrub the slider to watch it grow</Text>
        </View>

        {/* Canvas */}
        <View className="mx-6 mt-4 rounded-3xl bg-sky-50 border border-stone-200 items-center justify-center py-4 shadow-sm" style={{ height: 380 }}>
          <BonsaiSvg tree={tree} growth={growth} />
        </View>

        {/* Stage label */}
        <View className="items-center mt-4">
          <Text className="text-lg font-semibold text-emerald-800">{stage.label}</Text>
          <Text className="text-stone-400 text-sm mt-1">{Math.round(growth * 100)}% grown</Text>
        </View>

        {/* Growth Slider */}
        <View className="px-8 mt-4 flex-row items-center">
          <Text className="text-xl mr-3">🌱</Text>
          <Slider
            style={{ flex: 1, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={growth}
            onValueChange={setGrowth}
            minimumTrackTintColor="#15803d"
            maximumTrackTintColor="#d6d3d1"
            thumbTintColor="#166534"
          />
          <Text className="text-xl ml-3">🌳</Text>
        </View>

        {/* Adjustments Section */}
        <View className="px-8 mt-6">
          <Text className="text-base font-bold text-stone-500 mb-4 uppercase tracking-wider">Adjustments</Text>
          
          {/* Leaves */}
          <View className="flex-row items-center mb-1">
            <Text className="text-stone-700 w-16">Leaves</Text>
            <Slider
              style={{ flex: 1, height: 40 }}
              minimumValue={0}
              maximumValue={1}
              value={leavesPot}
              onValueChange={setLeavesPot}
              minimumTrackTintColor="#6b8e4e"
              maximumTrackTintColor="#e5e5e4"
              thumbTintColor="#4f7942"
            />
          </View>

          {/* Flowers */}
          <View className="flex-row items-center mb-1">
            <Text className="text-stone-700 w-16">Flowers</Text>
            <Slider
              style={{ flex: 1, height: 40 }}
              minimumValue={0}
              maximumValue={1}
              value={flowersPot}
              onValueChange={setFlowersPot}
              minimumTrackTintColor="#e8a0bd"
              maximumTrackTintColor="#e5e5e4"
              thumbTintColor="#c96f92"
            />
          </View>

          {/* Height */}
          <View className="flex-row items-center mb-1">
            <Text className="text-stone-700 w-16">Height</Text>
            <Slider
              style={{ flex: 1, height: 40 }}
              minimumValue={0}
              maximumValue={1}
              value={heightPot}
              onValueChange={setHeightPot}
              minimumTrackTintColor="#6b4a35"
              maximumTrackTintColor="#e5e5e4"
              thumbTintColor="#5a3d2c"
            />
          </View>
        </View>

        {/* Regenerate button */}
        <View className="items-center mt-6">
          <TouchableOpacity
            onPress={handleNewBonsai}
            className="bg-emerald-700 px-6 py-3 rounded-full active:bg-emerald-800 shadow-sm"
          >
            <Text className="text-white font-semibold">New Bonsai</Text>
          </TouchableOpacity>
          <Text className="text-stone-400 text-sm mt-2">seed #{seed}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}