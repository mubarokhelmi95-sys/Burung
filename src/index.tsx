import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Scene} from './Scene';

const Root: React.FC = () => (
  <Composition
    id="Bird"
    component={Scene}
    durationInFrames={300}
    fps={30}
    width={1080}
    height={1920}
  />
);

registerRoot(Root);
