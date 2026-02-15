"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Grid3x3,
  Shuffle,
  Settings,
  CheckCircle2,
  ArrowRight,
  Shield,
  Check,
} from "lucide-react"
import { signIn } from "next-auth/react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center text-xl">
              🍊
            </div>
            <span className="text-xl font-semibold">Seatrus</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              기능
            </a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              사용방법
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              가격
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => signIn()} className="hidden md:inline-flex">
              로그인
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            뱃지 내용
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-balance">
            한 번에 완성하는 <span className="text-primary">교실 자리 배치</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty leading-relaxed">
            Seatrus로 매일 새로운 좌석 배치를 경험하세요. 상큼한 아이디어로 학급을 관리하고, 똑똑한 규칙으로 최적의 학습
            환경을 만들어보세요.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto">
              무료 체험 시작하기
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-6">신용카드 불필요 • 14일 무료 체험</p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">신선한 기능으로 가득한 Seatrus</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            상큼하고 강력한 기능들로 교실 관리를 더 쉽게
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Users className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">학생 관리</h3>
            <p className="text-muted-foreground leading-relaxed">
              번호와 이름으로 학생을 추가하세요. 수동으로 입력하거나 명단을 가져올 수 있습니다.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Settings className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">규칙 설정</h3>
            <p className="text-muted-foreground leading-relaxed">
              같은 자리 방지, 같은 짝 방지, 맨 뒷자리 연속 배정 방지 등의 규칙을 설정할 수 있습니다.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shuffle className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">무작위 배치</h3>
            <p className="text-muted-foreground leading-relaxed">
              공정한 자리 배치를 바로 생성하세요. 한 번의 클릭으로 규칙에 맞는 배치가 무작위로 완성됩니다.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Grid3x3 className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">맞춤형 레이아웃</h3>
            <p className="text-muted-foreground leading-relaxed">
              실제 교실에 맞게 행과 열을 설정하세요.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="size-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">히스토리 및 추적</h3>
            <p className="text-muted-foreground leading-relaxed">
              과거 배치를 추적하세요. 학생들이 어디에 앉았는지 확인하세요. 데이터 기반 좌석 결정을 내리세요.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20 border-t border-border bg-muted/30">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">단 3단계로 신선한 좌석 배치 완성</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">Seatrus는 간단하고 직관적입니다</p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-2">학급 설정하기</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                학생을 추가하고 교실 레이아웃을 정의하세요. 실제 교실 구성에 맞게 행과 열의 수를 설정하세요.
              </p>
              <Card className="p-4 bg-card">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="size-5 text-primary shrink-0" />
                  <span>스프레드시트에서 가져오거나 수동으로 입력</span>
                </div>
              </Card>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-2">규칙 구성하기</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                교육 전략에 맞는 지능형 제약 조건을 설정하세요. 알고리즘이 선호도를 존중하면서 최적의 배치를 만듭니다.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                <Card className="p-3 bg-card">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                    <span>같은 자리 방지</span>
                  </div>
                </Card>
                <Card className="p-3 bg-card">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                    <span>같은 짝 방지</span>
                  </div>
                </Card>
                <Card className="p-3 bg-card">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                    <span>연속 뒷자리 방지</span>
                  </div>
                </Card>
                <Card className="p-3 bg-card">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-4 text-primary shrink-0" />
                    <span>학생 분리</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shrink-0">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-2">생성 및 내보내기</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                클릭하여 모든 규칙을 따르는 새로운 좌석 배치를 생성하세요. 즉시 인쇄하거나 학생들과 공유하세요. 시간을
                절약하고 갈등을 줄이세요.
              </p>
              <Card className="p-4 bg-card">
                <div className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="size-5 text-primary shrink-0" />
                  <span>PDF로 내보내거나 디지털 좌석 배치도 공유</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="container mx-auto px-4 py-20 border-t border-border">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">모든 교사를 위한 합리적인 가격</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            학급 규모에 관계없이 동일한 강력한 기능을 제공합니다
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">무료</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">₩0</span>
                <span className="text-muted-foreground">/월</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">시작하기에 완벽한 플랜</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">학급 1개</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">학생 30명까지</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">기본 규칙 설정</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">월 10개 배치 생성</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">PDF 내보내기</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full bg-transparent">
              무료로 시작하기
            </Button>
          </Card>

          {/* Pro Plan - Most Popular */}
          <Card className="p-8 flex flex-col border-2 border-primary shadow-lg relative">
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">가장 인기있는</Badge>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">프로</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">₩9,900</span>
                <span className="text-muted-foreground">/월</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">대부분의 교사에게 적합</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">학급 5개까지</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">학생 무제한</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">모든 지능형 규칙</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">무제한 배치 생성</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">히스토리 추적</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">우선 지원</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">Excel 가져오기/내보내기</span>
              </li>
            </ul>
            <Button className="w-full">프로 시작하기</Button>
          </Card>

          {/* School Plan */}
          <Card className="p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">학교</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold">₩49,000</span>
                <span className="text-muted-foreground">/월</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">전체 학교 또는 학년을 위한</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">교사 10명까지</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">학급 무제한</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">학생 무제한</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">모든 프로 기능</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">관리자 대시보드</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">학교 전체 분석</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">전담 지원</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="size-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">맞춤형 교육</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full bg-transparent">
              학교 플랜 문의
            </Button>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            모든 플랜은 14일 무료 체험 포함 • 신용카드 불필요 • 언제든지 취소 가능
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-4 py-20 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-balance">전국 교사들의 신뢰</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">활성 교사</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">200만+</div>
              <div className="text-muted-foreground">생성된 좌석 배치</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">교사 만족도</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 border-t border-border bg-muted/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">교실에 신선한 변화를 시작하세요</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Seatrus로 시간을 절약하고 더 활기찬 학습 환경을 만드는 수천 명의 교사와 함께하세요.
          </p>
          <Button size="lg" className="text-lg px-8">
            무료 체험 시작하기
            <ArrowRight className="ml-2 size-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-6">신용카드 불필요 • 언제든지 취소 가능</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="size-6 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center text-base">
                  🍊
                </div>
                <span className="font-semibold">Seatrus</span>
              </div>
              <p className="text-sm text-muted-foreground">교실에 신선함을 더하는 좌석 배치 솔루션</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">제품</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    기능
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    가격
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    자주 묻는 질문
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    소개
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    블로그
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    문의
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">법률</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    개인정보처리방침
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition-colors">
                    이용약관
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            © 2025 Seatrus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
