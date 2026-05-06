import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import story from "../timeline.story.json";

export const TimelineVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const sceneLength = story.durationSeconds / story.milestones.length;
  const index = Math.min(story.milestones.length - 1, Math.floor(t / sceneLength));
  const item = story.milestones[index];
  const progress = interpolate(t - index * sceneLength, [0, sceneLength], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

  return (
    <AbsoluteFill style={{background: story.palette.background, color: story.palette.text, fontFamily: "Inter, Arial, sans-serif", padding: 120}}>
      <div style={{fontSize: 24, color: story.palette.secondary, letterSpacing: 4}}>MISSION TIMELINE</div>
      <div style={{fontSize: 84, fontWeight: 850, marginTop: 24}}>{story.title}</div>
      <div style={{marginTop: 110, opacity: progress}}>
        <div style={{fontSize: 96, color: story.palette.accent, fontWeight: 900}}>{item.year}</div>
        <div style={{fontSize: 58, fontWeight: 850}}>{item.label}</div>
        <div style={{fontSize: 34, maxWidth: 820, marginTop: 24, lineHeight: 1.3}}>{item.meaning}</div>
      </div>
    </AbsoluteFill>
  );
};
