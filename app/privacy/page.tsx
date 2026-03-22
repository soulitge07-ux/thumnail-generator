import Navbar from '@/components/main/Navbar'

export const metadata = {
  title: 'Privacy Policy — NAILART AI',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 48 }}>
    <h2 style={{
      fontFamily: 'var(--font-gugi)',
      fontSize: 16,
      color: '#a78bfa',
      letterSpacing: '0.06em',
      marginBottom: 16,
      marginTop: 0,
    }}>
      {title}
    </h2>
    <div style={{
      fontFamily: 'var(--font-orbit)',
      fontSize: 14,
      color: 'rgba(237,237,237,0.65)',
      lineHeight: 1.9,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      {children}
    </div>
  </section>
)

const P = ({ children }: { children: React.ReactNode }) => (
  <p style={{ margin: 0 }}>{children}</p>
)

const Ul = ({ items }: { items: string[] }) => (
  <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
)

export default function PrivacyPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
    }}>
      <Navbar />

      <div style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: '120px 24px 96px',
      }}>

        {/* Header */}
        <div style={{ marginBottom: 64 }}>
          <p style={{
            fontFamily: 'var(--font-orbit)',
            fontSize: 11,
            color: 'rgba(167,139,250,0.7)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 16,
            margin: '0 0 16px',
          }}>
            Legal
          </p>
          <h1 style={{
            fontFamily: 'var(--font-gugi)',
            fontSize: 'clamp(28px, 4vw, 42px)',
            color: '#ededed',
            margin: '0 0 20px',
            letterSpacing: '0.02em',
          }}>
            Privacy Policy
          </h1>
          <p style={{
            fontFamily: 'var(--font-orbit)',
            fontSize: 13,
            color: 'rgba(237,237,237,0.35)',
            margin: 0,
          }}>
            최종 업데이트: 2025년 3월
          </p>
          <div style={{
            marginTop: 32,
            padding: '16px 20px',
            background: 'rgba(167,139,250,0.07)',
            border: '1px solid rgba(167,139,250,0.15)',
            borderRadius: 12,
            fontFamily: 'var(--font-orbit)',
            fontSize: 13,
            color: 'rgba(237,237,237,0.55)',
            lineHeight: 1.7,
          }}>
            NAILART AI(이하 "서비스")는 사용자의 개인정보를 소중히 여깁니다. 본 개인정보 처리방침은 서비스 이용 과정에서 수집·이용·보관되는 정보와 그 처리 방식을 안내합니다.
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 48 }} />

        <Section title="1. 수집하는 정보">
          <P>서비스는 다음과 같은 정보를 수집합니다.</P>
          <Ul items={[
            '계정 정보: Google 소셜 로그인을 통해 제공되는 이름, 이메일 주소, 프로필 사진',
            '생성 콘텐츠: 사용자가 입력한 프롬프트 및 AI가 생성한 썸네일 이미지',
            '결제 정보: 구독 플랜, 결제 상태 (카드 번호 등 민감한 결제 정보는 Polar가 처리하며 당사는 수집하지 않습니다)',
            '이용 기록: 크레딧 사용 내역, 생성 요청 시각',
            '기술 정보: 서비스 운영에 필요한 세션 정보',
          ]} />
        </Section>

        <Section title="2. 정보 이용 목적">
          <P>수집한 정보는 다음 목적으로만 이용됩니다.</P>
          <Ul items={[
            '서비스 제공 및 계정 인증',
            '이미지 생성 기능 운영 (Google Gemini API 활용)',
            '구독 및 크레딧 관리',
            '서비스 개선 및 오류 분석',
            '이용약관·정책 변경 등 중요 공지 발송',
          ]} />
        </Section>

        <Section title="3. 제3자 서비스">
          <P>서비스는 다음 제3자 플랫폼을 통해 일부 데이터를 처리합니다.</P>
          <Ul items={[
            'Supabase: 사용자 인증 및 데이터베이스 저장 (미국 서버)',
            'Google Gemini API: 프롬프트를 바탕으로 이미지 생성',
            'Polar: 구독 결제 처리 및 청구서 발행',
          ]} />
          <P>각 서비스는 자체 개인정보 처리방침을 따릅니다. 생성 이미지를 Gemini API로 전송 시, Google의 API 이용약관이 함께 적용됩니다.</P>
        </Section>

        <Section title="4. 데이터 보관">
          <Ul items={[
            '계정 정보: 계정 삭제 요청 시까지 보관',
            '생성된 썸네일: 계정 유지 기간 동안 보관, 계정 삭제 시 함께 삭제',
            '결제 기록: 관련 법령에 따라 최대 5년 보관',
          ]} />
        </Section>

        <Section title="5. 사용자 권리">
          <P>사용자는 언제든지 다음 권리를 행사할 수 있습니다.</P>
          <Ul items={[
            '개인정보 열람 및 수정 요청',
            '계정 및 데이터 삭제 요청',
            '마케팅 수신 거부',
          ]} />
          <P>요청은 아래 이메일로 문의해 주세요.</P>
        </Section>

        <Section title="6. 쿠키 및 로컬 스토리지">
          <P>서비스는 로그인 세션 유지를 위해 Supabase에서 발급하는 인증 토큰을 로컬 스토리지에 저장합니다. 별도의 광고·추적 쿠키는 사용하지 않습니다.</P>
        </Section>

        <Section title="7. 아동 개인정보">
          <P>서비스는 만 14세 미만 아동을 대상으로 하지 않으며, 아동의 개인정보를 의도적으로 수집하지 않습니다. 만 14세 미만임을 확인한 경우 해당 정보는 즉시 삭제됩니다.</P>
        </Section>

        <Section title="8. 정책 변경">
          <P>본 방침이 변경될 경우, 변경 내용을 서비스 내 공지 또는 등록된 이메일로 사전 안내합니다. 변경 후 서비스를 계속 이용하면 변경된 방침에 동의한 것으로 간주합니다.</P>
        </Section>

        <Section title="9. 문의">
          <P>개인정보 관련 문의 사항은 아래 이메일로 연락해 주세요.</P>
          <P>
            <a
              href="mailto:privacy@nailartai.com"
              style={{ color: '#a78bfa', textDecoration: 'none' }}
            >
              privacy@nailartai.com
            </a>
          </P>
        </Section>

        {/* Footer line */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginTop: 16 }} />
        <div style={{ marginTop: 24, display: 'flex', gap: 24 }}>
          <a href="/terms" style={{ fontFamily: 'var(--font-orbit)', fontSize: 12, color: 'rgba(237,237,237,0.3)', textDecoration: 'none' }}>
            이용약관
          </a>
          <a href="/" style={{ fontFamily: 'var(--font-orbit)', fontSize: 12, color: 'rgba(237,237,237,0.3)', textDecoration: 'none' }}>
            홈으로
          </a>
        </div>

      </div>
    </main>
  )
}
