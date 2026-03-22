'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import * as THREE from 'three'

export default function AuthPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && user) {
      router.replace('/dashboard')
    }
  }, [user, loading, router])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    class Plane {
      uniforms: { time: { type: string; value: number } }
      mesh: THREE.Mesh
      time: number

      constructor() {
        this.uniforms = { time: { type: 'f', value: 0 } }
        this.mesh = this.createMesh()
        this.time = 0.5
      }

      createMesh() {
        const size = 256
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
                return mat4(1.0,0.0,0.0,0.0,0.0,cos(radian),-sin(radian),0.0,0.0,sin(radian),cos(radian),0.0,0.0,0.0,0.0,1.0);
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
                vec3 lp=up+vec3(0.0,n1*s*8.0+n2*s*8.0+n3*(abs(s)*2.0+0.5)+pow(s,2.0)*40.0,0.0);
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
        )
      }

      render(delta: number) {
        this.uniforms.time.value += delta * this.time
      }
    }

    const w = container.clientWidth
    const h = container.clientHeight

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true })
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 1, 10000)
    const plane = new Plane()
    let animFrameId: number
    let prevTime = performance.now()

    const resize = () => {
      const nw = container.clientWidth
      const nh = container.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }

    const renderLoop = () => {
      const now = performance.now()
      plane.render((now - prevTime) / 1000)
      prevTime = now
      renderer.render(scene, camera)
      animFrameId = requestAnimationFrame(renderLoop)
    }

    renderer.setSize(w, h)
    renderer.setClearColor(0x000000, 0)
    camera.position.set(0, 16, 125)
    camera.lookAt(new THREE.Vector3(0, 28, 0))
    scene.add(plane.mesh)
    window.addEventListener('resize', resize)
    renderLoop()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animFrameId)
      renderer.dispose()
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', background: '#0a0a0a' }}>

      {/* ── LEFT 3/5 ── */}
      <div style={{ flex: 3, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 48px 40px' }}>

        {/* dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 0 }} />

        {/* YouTube video — top */}
        <div style={{ position: 'relative', zIndex: 1, width: '75%', borderRadius: 16, overflow: 'hidden', aspectRatio: '16/9', flexShrink: 0 }}>
          <iframe
            src="https://www.youtube.com/embed/srSY_OSxwNg?si=xhaU5rZCHVI9RrZa&autoplay=1&mute=1&loop=1&playlist=srSY_OSxwNg&controls=0&showinfo=0&rel=0&modestbranding=1"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </div>

        {/* NAILART — oversized bottom */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{
            fontFamily: 'var(--font-gugi)',
            fontSize: 'clamp(72px, 10vw, 140px)',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 0.9,
            letterSpacing: '-0.03em',
            margin: 0,
            userSelect: 'none',
          }}>
            NAIL<br />ART
          </p>
          <p style={{ fontFamily: 'var(--font-orbit)', fontSize: 13, color: 'rgba(255,255,255,0.4)', margin: '12px 0 0', letterSpacing: '0.08em' }}>
            AI-Powered YouTube Thumbnail Generator
          </p>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div style={{ width: 1, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />

      {/* ── RIGHT 2/5 ── */}
      <div
        ref={containerRef}
        style={{
          flex: 2,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 40px',
          background: '#0a0a0a',
          overflow: 'hidden',
        }}
      >
        {/* Three.js canvas background */}
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
        />

        {/* gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse 80% 60% at 50% 110%, rgba(10,10,10,0) 0%, rgba(10,10,10,0.5) 70%, rgba(10,10,10,0.9) 100%)',
        }} />

        {/* ← Back */}
        <a
          href="/"
          style={{
            position: 'absolute', top: 20, left: 24, zIndex: 2,
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: 'rgba(237,237,237,0.35)',
            textDecoration: 'none', fontFamily: 'var(--font-orbit)',
          }}
        >
          ← Back
        </a>

        {/* login card */}
        <div
          style={{
            position: 'relative', zIndex: 2,
            width: '100%', maxWidth: 340,
            background: 'rgba(22,22,26,0.85)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: '36px 32px',
            display: 'flex', flexDirection: 'column', gap: 20,
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#ededed', fontSize: 22, fontWeight: 600, fontFamily: 'var(--font-gugi)', margin: '0 0 8px' }}>
              시작하기
            </h1>
            <p style={{ color: 'rgba(237,237,237,0.45)', fontSize: 13, fontFamily: 'var(--font-orbit)', margin: 0 }}>
              썸네일 생성을 시작하려면 로그인하세요
            </p>
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '11px 20px',
              background: '#e8e8e8', borderRadius: 15, border: 'none', cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(0.93)')}
            onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.13 4.13 0 0 1-1.79 2.71v2.26h2.9C16.66 14.1 17.64 11.84 17.64 9.2Z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26a5.4 5.4 0 0 1-8.06-2.85H1.01v2.33A9 9 0 0 0 9 18Z" fill="#34A853" />
              <path d="M4 10.71A5.41 5.41 0 0 1 3.72 9c0-.59.1-1.17.28-1.71V4.96H1.01A9 9 0 0 0 0 9c0 1.45.35 2.83 1.01 4.04L4 10.71Z" fill="#FBBC05" />
              <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 1.01 4.96L4 7.29A5.37 5.37 0 0 1 9 3.58Z" fill="#EA4335" />
            </svg>
            <span style={{ color: '#111', fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-orbit)' }}>
              구글로 계속하기
            </span>
          </button>

          <p style={{ textAlign: 'center', fontSize: 10, color: 'rgba(237,237,237,0.2)', fontFamily: 'var(--font-orbit)', lineHeight: 1.8, margin: 0 }}>
            계속 진행하면{' '}
            <a href="#" style={{ color: 'rgba(237,237,237,0.4)', textDecoration: 'underline' }}>이용약관</a>
            {' '}및{' '}
            <a href="#" style={{ color: 'rgba(237,237,237,0.4)', textDecoration: 'underline' }}>개인정보처리방침</a>
            에 동의합니다
          </p>
        </div>
      </div>

    </div>
  )
}
