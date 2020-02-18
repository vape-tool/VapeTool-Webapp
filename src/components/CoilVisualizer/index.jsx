import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from 'react-three-fibre';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import { Card, Skeleton, Typography } from 'antd';
import FirebaseImage from '@/components/StorageAvatar';
import { ItemView, ItemViewProps, ItemViewState } from '../ItemView';
import styles from './index.less';
import { ItemName } from '@/types/Item';
import { Coil } from '@/types';
import { getCoilUrl } from '@/services/storage';

interface CoilVisualizerState {
  coilImageUrl: string;
}

function Box(prop) {
  const mesh = useRef();

  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));

  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={e => setActive(!active)}
      onPointerOver={e => setHover(true)}
      onPointerOut={e => setHover(false)}
    >
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}

function CoilVisualizer(props) {}

export default CoilVisualizer;
