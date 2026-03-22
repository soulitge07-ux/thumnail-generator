import Navbar from '@/components/main/Navbar'

export const metadata = {
  title: 'Terms of Service — NAILART AI',
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

const PlanCard = ({ name, price, credits, color }: { name: string; price: string; credits: string; color: string }) => (
  <div style={{
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontFamily: 'var(--font-orbit)', fontSize: 13, color: '#ededed', letterSpacing: '0.06em' }}>
        {name}
      </span>
    </div>
    <div style={{ display: 'flex', gap: 24 }}>
      <span style={{ fontFamily: 'var(--font-orbit)', fontSize: 13, color: 'rgba(237,237,237,0.45)' }}>{price}</span>
      <span style={{ fontFamily: 'var(--font-orbit)', fontSize: 13, color: 'rgba(237,237,237,0.45)' }}>{credits}</span>
    </div>
  </div>
)

export default function TermsPage() {
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
            Terms of Service
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
            NAILART AI 서비스를 이용함으로써 본 이용약관에 동의하는 것으로 간주합니다. 서비스를 이용하기 전에 본 약관을 주의 깊게 읽어 주세요.
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 48 }} />

        <Section title="1. 서비스 소개">
          <P>NAILART AI는 Google Gemini AI를 활용하여 유튜브 썸네일 이미지를 자동 생성하는 SaaS 서비스입니다. 사용자는 텍스트 프롬프트와 참조 이미지를 입력하면 고품질 썸네일을 즉시 생성할 수 있습니다.</P>
        </Section>

        <Section title="2. 계정 및 자격">
          <Ul items={[
            '서비스 이용을 위해 Google 계정으로 로그인해야 합니다.',
            '만 14세 이상만 계정을 생성할 수 있습니다.',
            '계정 보안 유지의 책임은 사용자 본인에게 있습니다.',
            '타인의 계정을 무단으로 사용하거나 공유하는 행위는 금지됩니다.',
          ]} />
        </Section>

        <Section title="3. 요금제 및 크레딧">
          <P>서비스는 크레딧 기반 과금 방식을 적용합니다. 이미지 1회 생성 시 크레딧 1개가 차감됩니다.</P>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            <PlanCard name="FREE" price="무료" credits="크레딧 없음" color="rgba(237,237,237,0.3)" />
            <PlanCard name="PRO" price="$20 / 월" credits="100 크레딧 / 월" color="#a78bfa" />
            <PlanCard name="ULTRA" price="$45 / 월" credits="300 크레딧 / 월" color="#facc15" />
          </div>
          <Ul items={[
            '월정액 구독 시 매 결제 주기마다 크레딧이 지급됩니다.',
            '미사용 크레딧은 다음 결제 주기로 이월되지 않습니다.',
            '생성 중 오류 발생 시 차감된 크레딧은 자동으로 복원됩니다.',
            '크레딧 소진 시 추가 생성을 위해 요금제 업그레이드가 필요합니다.',
          ]} />
        </Section>

        <Section title="4. 결제 및 환불">
          <Ul items={[
            '결제는 Polar 플랫폼을 통해 처리됩니다.',
            '구독은 매 결제 주기마다 자동 갱신됩니다.',
            '구독 취소는 언제든 가능하며, 취소 시 현재 결제 기간 만료일까지 서비스를 이용할 수 있습니다.',
            '원칙적으로 결제 완료 후 환불은 제공되지 않습니다. 단, 서비스 장애 등 귀책사유가 당사에 있는 경우 협의를 통해 처리합니다.',
            '업그레이드 시 나머지 기간에 대한 차액이 비례 적용됩니다.',
          ]} />
        </Section>

        <Section title="5. 콘텐츠 및 지식재산권">
          <P><strong style={{ color: '#ededed' }}>사용자 생성 콘텐츠</strong></P>
          <Ul items={[
            '사용자가 생성한 썸네일 이미지의 권리는 해당 사용자에게 귀속됩니다.',
            '사용자는 생성물을 상업적 목적을 포함하여 자유롭게 사용할 수 있습니다.',
            '단, AI 생성 이미지의 저작권 귀속에 관한 법적 해석은 국가마다 상이할 수 있습니다.',
          ]} />
          <P><strong style={{ color: '#ededed' }}>서비스 지식재산권</strong></P>
          <Ul items={[
            'NAILART AI의 로고, 디자인, 소프트웨어, 프롬프트 시스템은 당사의 지식재산입니다.',
            '서비스의 소스코드를 무단 복제·역설계하는 행위는 금지됩니다.',
          ]} />
        </Section>

        <Section title="6. 금지 행위">
          <P>다음 행위는 엄격히 금지됩니다.</P>
          <Ul items={[
            '타인의 권리를 침해하거나 불법적인 목적의 이미지 생성',
            '혐오, 폭력, 성적 콘텐츠 생성',
            '서비스의 API를 무단으로 크롤링·자동화하여 대량 요청',
            '크레딧 시스템을 우회하거나 악용하는 행위',
            '서비스 인프라에 과도한 부하를 유발하는 행위',
          ]} />
          <P>위반 시 사전 통보 없이 계정이 정지 또는 삭제될 수 있습니다.</P>
        </Section>

        <Section title="7. 서비스 가용성">
          <P>서비스는 최대한 안정적인 운영을 목표로 하나, 다음 사항에 대해 보증하지 않습니다.</P>
          <Ul items={[
            '24/7 무중단 서비스 (정기 점검·긴급 장애 등으로 일시 중단될 수 있습니다)',
            '생성 이미지의 특정 품질 수준 보장',
            '제3자 API(Gemini, Supabase, Polar) 장애에 따른 서비스 영향',
          ]} />
        </Section>

        <Section title="8. 책임 제한">
          <P>관련 법령이 허용하는 최대 범위 내에서, NAILART AI는 서비스 이용으로 발생하는 간접적·부수적 손해에 대해 책임을 지지 않습니다. 당사의 최대 책임은 해당 월 결제 금액을 초과하지 않습니다.</P>
        </Section>

        <Section title="9. 약관 변경">
          <P>약관이 변경될 경우 최소 7일 전에 서비스 내 공지 또는 이메일로 안내합니다. 변경 후 서비스를 계속 이용하면 변경된 약관에 동의한 것으로 간주합니다.</P>
        </Section>

        <Section title="10. 준거법 및 분쟁 해결">
          <P>본 약관은 대한민국 법률에 따라 해석됩니다. 서비스 이용과 관련한 분쟁은 서울중앙지방법원을 제1심 관할 법원으로 합니다.</P>
        </Section>

        <Section title="11. 문의">
          <P>약관 관련 문의는 아래 이메일로 연락해 주세요.</P>
          <P>
            <a
              href="mailto:support@nailartai.com"
              style={{ color: '#a78bfa', textDecoration: 'none' }}
            >
              support@nailartai.com
            </a>
          </P>
        </Section>

        {/* Footer line */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginTop: 16 }} />
        <div style={{ marginTop: 24, display: 'flex', gap: 24 }}>
          <a href="/privacy" style={{ fontFamily: 'var(--font-orbit)', fontSize: 12, color: 'rgba(237,237,237,0.3)', textDecoration: 'none' }}>
            개인정보 처리방침
          </a>
          <a href="/" style={{ fontFamily: 'var(--font-orbit)', fontSize: 12, color: 'rgba(237,237,237,0.3)', textDecoration: 'none' }}>
            홈으로
          </a>
        </div>

      </div>
    </main>
  )
}
