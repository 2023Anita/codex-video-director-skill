import React from "react";
import {Composition, registerRoot} from "remotion";
import story from "../timeline.story.json";
import {TimelineVideo} from "./TimelineVideo";

const Root: React.FC = () => (
  <Composition
    id="spacex-ascent"
    component={TimelineVideo}
    durationInFrames={story.durationSeconds * story.fps}
    fps={story.fps}
    width={1920}
    height={1080}
  />
);

registerRoot(Root);
