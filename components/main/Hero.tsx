'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    class Plane {
      uniforms: { time: { type: string; value: number } };
      mesh: THREE.Mesh;
      time: number;

      constructor() {
        this.uniforms = { time: { type: 'f', value: 0 } };
        this.mesh = this.createMesh();
        this.time = 0.5;
      }

      createMesh() {
        const size = 256;
        return new THREE.Mesh(
          new THREE.PlaneGeometry(size, size, size, size),
          new THREE.RawShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
              #define GLSLIFY 1
              attribute vec3 position;
              uniform mat4 projectionMatrix;
              uniform mat4 modelViewMatrix;
              uniform float time;
              varying vec3 vPosition;

              mat4 rotateMatrixX(float radian) {
                return mat4(
                  1.0,0.0,0.0,0.0,
                  0.0,cos(radian),-sin(radian),0.0,
                  0.0,sin(radian),cos(radian),0.0,
                  0.0,0.0,0.0,1.0
                );
              }

              vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
              vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
              vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
              vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
              vec3 fade(vec3 t){return t*t*t*(t*(t*6.0-15.0)+10.0);}

              float cnoise(vec3 P){
                vec3 Pi0=floor(P),Pi1=Pi0+vec3(1.0);
                Pi0=mod289(Pi0);Pi1=mod289(Pi1);
                vec3 Pf0=fract(P),Pf1=Pf0-vec3(1.0);
                vec4 ix=vec4(Pi0.x,Pi1.x,Pi0.x,Pi1.x);
                vec4 iy=vec4(Pi0.yy,Pi1.yy);
                vec4 iz0=Pi0.zzzz,iz1=Pi1.zzzz;
                vec4 ixy=permute(permute(ix)+iy);
                vec4 ixy0=permute(ixy+iz0),ixy1=permute(ixy+iz1);
                vec4 gx0=ixy0*(1.0/7.0),gy0=fract(floor(gx0)*(1.0/7.0))-0.5;
                gx0=fract(gx0);
                vec4 gz0=vec4(0.5)-abs(gx0)-abs(gy0),sz0=step(gz0,vec4(0.0));
                gx0-=sz0*(step(0.0,gx0)-0.5);gy0-=sz0*(step(0.0,gy0)-0.5);
                vec4 gx1=ixy1*(1.0/7.0),gy1=fract(floor(gx1)*(1.0/7.0))-0.5;
                gx1=fract(gx1);
                vec4 gz1=vec4(0.5)-abs(gx1)-abs(gy1),sz1=step(gz1,vec4(0.0));
                gx1-=sz1*(step(0.0,gx1)-0.5);gy1-=sz1*(step(0.0,gy1)-0.5);
                vec3 g000=vec3(gx0.x,gy0.x,gz0.x),g100=vec3(gx0.y,gy0.y,gz0.y);
                vec3 g010=vec3(gx0.z,gy0.z,gz0.z),g110=vec3(gx0.w,gy0.w,gz0.w);
                vec3 g001=vec3(gx1.x,gy1.x,gz1.x),g101=vec3(gx1.y,gy1.y,gz1.y);
                vec3 g011=vec3(gx1.z,gy1.z,gz1.z),g111=vec3(gx1.w,gy1.w,gz1.w);
                vec4 norm0=taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
                g000*=norm0.x;g010*=norm0.y;g100*=norm0.z;g110*=norm0.w;
                vec4 norm1=taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
                g001*=norm1.x;g011*=norm1.y;g101*=norm1.z;g111*=norm1.w;
                float n000=dot(g000,Pf0),n100=dot(g100,vec3(Pf1.x,Pf0.yz));
                float n010=dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)),n110=dot(g110,vec3(Pf1.xy,Pf0.z));
                float n001=dot(g001,vec3(Pf0.xy,Pf1.z)),n101=dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z));
                float n011=dot(g011,vec3(Pf0.x,Pf1.yz)),n111=dot(g111,Pf1);
                vec3 fade_xyz=fade(Pf0);
                vec4 n_z=mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
                vec2 n_yz=mix(n_z.xy,n_z.zw,fade_xyz.y);
                return 2.2*mix(n_yz.x,n_yz.y,fade_xyz.x);
              }

              void main(void){
                vec3 up=(rotateMatrixX(radians(90.0))*vec4(position,1.0)).xyz;
                float s=sin(radians(up.x/128.0*90.0));
                vec3 np=up+vec3(0.0,0.0,time*-30.0);
                float n1=cnoise(np*0.08),n2=cnoise(np*0.06),n3=cnoise(np*0.4);
                vec3 lp=up+vec3(0.0,
                  n1*s*8.0+n2*s*8.0+n3*(abs(s)*2.0+0.5)+pow(s,2.0)*40.0,
                  0.0);
                vPosition=lp;
                gl_Position=projectionMatrix*modelViewMatrix*vec4(lp,1.0);
              }
            `,
            fragmentShader: `
              precision highp float;
              #define GLSLIFY 1
              varying vec3 vPosition;
              void main(void){
                float opacity=(96.0-length(vPosition))/256.0*0.6;
                gl_FragColor=vec4(vec3(0.6),opacity);
              }
            `,
            transparent: true,
          })
        );
      }

      render(delta: number) {
        this.uniforms.time.value += delta * this.time;
      }
    }

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current!, antialias: false, alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    const plane = new Plane();
    let animFrameId: number;
    let prevTime = performance.now();

    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const renderLoop = () => {
      const now = performance.now();
      plane.render((now - prevTime) / 1000);
      prevTime = now;
      renderer.render(scene, camera);
      animFrameId = requestAnimationFrame(renderLoop);
    };

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    camera.position.set(0, 16, 125);
    camera.lookAt(new THREE.Vector3(0, 28, 0));
    scene.add(plane.mesh);
    window.addEventListener('resize', resize);
    renderLoop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameId);
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Three.js background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* gradient overlay — bottom fade for readability */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 110%, rgba(10,10,10,0) 0%, rgba(10,10,10,0.6) 70%, rgba(10,10,10,0.95) 100%)',
        }}
      />

      {/* hero content */}
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center"
        style={{ zIndex: 2 }}
      >
        {/* badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <circle cx="4" cy="4" r="4" fill="#4ade80" />
          </svg>
          <span className="text-[11px] text-[#ededed]/60 tracking-wide" style={{ fontFamily: 'var(--font-orbit)' }}>
            AI-Powered Thumbnail Generation
          </span>
        </div>

        {/* headline */}
        <h1
          className="max-w-3xl text-[#ededed] leading-tight mb-5"
          style={{
            fontFamily: 'var(--font-gugi)',
            fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
          }}
        >
          유튜브 썸네일,
          <br />
          <span style={{ opacity: 0.45 }}>이제</span>
          {' '}AI가 만든다
        </h1>

        {/* subheadline */}
        <p
          className="max-w-xl text-[#ededed]/50 mb-10"
          style={{
            fontFamily: 'var(--font-orbit)',
            fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)',
            lineHeight: '1.7',
          }}
        >
          주제와 스타일만 입력하면 클릭을 부르는 썸네일을 즉시 생성합니다.
          <br />
          수천 개의 패턴을 학습한 AI가 조회수를 끌어올려 드립니다.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            className="group flex items-center gap-2 rounded-full px-7 py-3.5 font-medium text-sm text-[#0a0a0a] bg-[#ededed] transition-all hover:bg-white"
            style={{ fontFamily: 'var(--font-orbit)' }}
          >
            무료로 시작하기
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            className="flex items-center gap-2 rounded-full px-7 py-3.5 font-medium text-sm text-[#ededed]/70 border border-white/10 bg-white/5 transition-all hover:bg-white/10"
            style={{ fontFamily: 'var(--font-orbit)' }}
          >
            예시 보기
          </button>
        </div>

        {/* thumbnail preview strip */}
        <div className="mt-16 w-full max-w-4xl">
          <p className="text-[10px] text-[#ededed]/30 tracking-widest uppercase mb-4" style={{ fontFamily: 'var(--font-orbit)' }}>
            Generated thumbnails
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2 justify-center" style={{ scrollbarWidth: 'none' }}>
            {thumbnailMocks.map((t, i) => (
              <div
                key={i}
                className="shrink-0 rounded-lg overflow-hidden border border-white/10"
                style={{ width: 192, height: 108, background: t.bg, position: 'relative' }}
              >
                {/* mock thumbnail SVG scene */}
                <svg width="192" height="108" viewBox="0 0 192 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* background gradient */}
                  <defs>
                    <linearGradient id={`g${i}`} x1="0" y1="0" x2="192" y2="108" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor={t.c1} />
                      <stop offset="100%" stopColor={t.c2} />
                    </linearGradient>
                  </defs>
                  <rect width="192" height="108" fill={`url(#g${i})`} />
                  {/* abstract shape */}
                  <ellipse cx={t.ex} cy={t.ey} rx="60" ry="40" fill="white" fillOpacity="0.06" />
                  {/* title text bar */}
                  <rect x="12" y="72" width={t.tw} height="8" rx="2" fill="white" fillOpacity="0.5" />
                  <rect x="12" y="84" width={t.tw * 0.6} height="5" rx="2" fill="white" fillOpacity="0.25" />
                  {/* play badge */}
                  <rect x="148" y="8" width="34" height="18" rx="4" fill="#FF0000" fillOpacity="0.85" />
                  <path d="M159 14.5L166 17L159 19.5V14.5Z" fill="white" />
                </svg>
                {/* hover shimmer */}
                <div className="absolute inset-0 bg-white/0 hover:bg-white/5 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const thumbnailMocks = [
  { bg: '#1a1a2e', c1: '#1a1a2e', c2: '#16213e', ex: 150, ey: 30, tw: 120 },
  { bg: '#1a0a0a', c1: '#2d1515', c2: '#0a0a0a', ex: 40,  ey: 60, tw: 100 },
  { bg: '#0a1a0a', c1: '#0d2b0d', c2: '#0a0a0a', ex: 160, ey: 80, tw: 130 },
  { bg: '#1a1500', c1: '#2a2200', c2: '#0a0a0a', ex: 80,  ey: 20, tw: 90  },
  { bg: '#0a0a1a', c1: '#10103a', c2: '#0a0a0a', ex: 120, ey: 70, tw: 110 },
];

export default Hero;
