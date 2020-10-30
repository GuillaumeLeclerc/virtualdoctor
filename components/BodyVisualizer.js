import React, { useRef, useState, Suspense, useEffect } from 'react'
import { MeshPhysicalMaterial, TextureLoader } from 'three'
import { useThree, extend, Canvas, useFrame, useLoader } from 'react-three-fiber'
import { makeObservable, action, computed, observable, makeAutoObservable } from "mobx"
import { Image, Card, List, Modal, Button, Tooltip } from 'antd';
import { observer } from "mobx-react-lite"
import GLTFLoader from 'three-gltf-loader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { SearchOutlined } from '@ant-design/icons';

let LAST_DRAGGING = 0;

const trueClick = (handler) => {
  return (...args) => {
    const now = Date.now();
    const diff = now - LAST_DRAGGING;
    if (diff > 300) {
      handler(...args);
    }
  }
}

class ImagePreviewState {
  image = null

  constructor() {
    makeAutoObservable(this)
  }
}

extend({ OrbitControls })

export function Controls() {
  const ref = useRef()
  const { camera, gl } = useThree()
  let change = false;
  useFrame(() => ref.current.update())
  useEffect(() => {
    ref.current.addEventListener('start', () => {
      change = false;
    })
    ref.current.addEventListener('change', () => {
      change = true;
    });

    ref.current.addEventListener('end', () => {
      if (change) {
        LAST_DRAGGING = Date.now();
      }
    });
  }, []);
  const a = (<orbitControls ref={ref} args={[camera, gl.domElement]} enableDamping dampingFactor={0.1} rotateSpeed={0.5} />);
  return a
}

function HumanBody({ cursor }) {
  const gltf = useLoader(GLTFLoader, "/meshes/male.glb");
  const textures = useLoader(TextureLoader, [
    '/textures/Skin_Human_002_COLOR.png',
    '/textures/Skin_Human_002_DISP.png',
    '/textures/Skin_Human_002_NRM.png'])
  textures.forEach((x) => x.repeat.set(100, 100));
  const [color_map, disp_map, normal_map] = textures

  return (
    <mesh
      geometry={gltf.nodes.human.geometry}
      onClick={trueClick((e) => {
        e.stopPropagation();
        const coords = e.intersections[0].point;
        cursor.setCoords(coords)
      })}
    >
      <meshPhysicalMaterial
        map={color_map}
        transparent={true}
        opacity={0.7}
        clearcoat={1}
      />
    </mesh>
  );
}

const CursorRender = observer(({ cursor }) => {
  if(cursor.isSet) {
    return (
      <mesh
        position={cursor.coords}
      >
        <sphereGeometry args={[0.03, 32, 32, 0, Math.PI * 2, 0, Math.PI]}/>
        <meshPhysicalMaterial
          color="blue"
          clearcoat={1}
        />
      </mesh>
    );
  }
  return null;
})

const ImageVisualizer = observer(({ image, preview_state }) => {
  const [ texture ] = useLoader(TextureLoader, [ image.content ]);
  return (<>
      <sprite
        scale={[0.1, 0.1, 0.1]}
        position={image.coords}
        onClick={action(() => {
          preview_state.image=image;
        })}
      >
        <spriteMaterial
          map={texture}
          depthTest={false}
        />
      </sprite>
    </>
  );
});

const COLOR_MAP = {
  'lime': '#a0d911',
  'volcano': '#fa541c',
  'red': '#f5222d',
  'orange': '#fa8c16',
  'gold': '#faad14',
  'green': '#52c41a',
  'cyan': '#13c2c2'
}

const PainPointVisualizer = observer(({ painPoint }) => {
  return (<>
      <mesh
        position={painPoint.coords}
      >
        <sphereGeometry args={[0.03, 32, 32, 0, Math.PI * 2, 0, Math.PI]}/>
        <meshPhysicalMaterial
          color={COLOR_MAP[painPoint.colorMap]}
          clearcoat={1}
        />
      </mesh>
    </>
  );
});

const ImagesVisualizer = observer(({ images, preview_state}) => {
  return images.pictures.map(x => <ImageVisualizer image={x} preview_state={preview_state} key={x.date}/>)
});

const PainPointsVisualizer = observer(({ painPoints }) => {
  return painPoints.painPoints.map(x => <PainPointVisualizer painPoint={x} key={x.date}/>)
});

function Visualizer({ cursor, images, preview_state, mode, painPoints }) {

  let overlay = null;
  if(mode == 'images') {
    overlay = <ImagesVisualizer images={images} preview_state={preview_state}/>;
  }

  if(mode == 'pain') {
    overlay = <PainPointsVisualizer painPoints={painPoints} />
  }

  return <>
    <HumanBody cursor={cursor} />
    <CursorRender cursor={cursor} />
    {overlay}
    </>;
}

function Box(props) {
  return null;
}

const style = {
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent'
};

const ImagePreview = observer(( { preview_state }) => {
  if (preview_state.image != null) {
    return (
              <Image
                style={{display: 'none'}}
                width={0}
                preview={{
                  visible: true,
                  onVisibleChange: action(() => {
                    preview_state.image = null;
                  })
                }}
                src={preview_state.image.content}
              />
    );
  }
  return null;
})


export default function Viz({ cursor, images, mode, painPoints}) {
  const preview_state = new ImagePreviewState()
  return (
    <div style={style}>
      <ImagePreview preview_state={preview_state} />
      <Canvas>
        <Controls />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={<Box position={[1.2, 0, 0]} /> }>
        <Visualizer
          cursor={cursor}
          images={images}
          painPoints={painPoints}
          preview_state={preview_state}
          mode={mode}
        />
      </Suspense>
      </Canvas>
    </div>
  )
}
