"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { saveClassRules } from "@/app/main/actions/rules"
import posthog from "posthog-js"

interface RuleSettingsProps {
  classId: string | null
  initialPreventSameSeat: boolean
  initialPreventSamePair: boolean
  initialPreventBackToBack: boolean
}

export default function RuleSettings({
  classId,
  initialPreventSameSeat,
  initialPreventSamePair,
  initialPreventBackToBack,
}: RuleSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [preventSameSeat, setPreventSameSeat] = useState(initialPreventSameSeat)
  const [preventSamePair, setPreventSamePair] = useState(initialPreventSamePair)
  const [preventBackToBack, setPreventBackToBack] = useState(initialPreventBackToBack)

  const handleToggleRule = async (
    key: "prevent_same_seat" | "prevent_same_pair" | "prevent_back_to_back"
  ) => {
    if (isLoading || !classId) {
      return
    }

    const nextRules = {
      prevent_same_seat: key === "prevent_same_seat" ? !preventSameSeat : preventSameSeat,
      prevent_same_pair: key === "prevent_same_pair" ? !preventSamePair : preventSamePair,
      prevent_back_to_back: key === "prevent_back_to_back" ? !preventBackToBack : preventBackToBack,
    }

    setIsLoading(true)
    setError("")

    const result = await saveClassRules(classId, nextRules)

    if (result.success) {
      posthog.capture("class_rule_changed", {
        class_id: classId,
        changed_rule: key,
        prevent_same_seat: result.prevent_same_seat,
        prevent_same_pair: result.prevent_same_pair,
        prevent_back_to_back: result.prevent_back_to_back,
      })
      setPreventSameSeat(result.prevent_same_seat)
      setPreventSamePair(result.prevent_same_pair)
      setPreventBackToBack(result.prevent_back_to_back)
    } else {
      posthog.capture("class_rule_change_failed", {
        class_id: classId,
        changed_rule: key,
        error: result.error || "unknown_error",
      })
      setError(result.error || "규칙 저장에 실패했습니다.")
    }

    setIsLoading(false)
  }

  if (!classId) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">학급을 먼저 생성해주세요.</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>배치 설정</CardTitle>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="rounded-lg border bg-card p-3">
          <div className="grid grid-cols-[1fr_auto] items-center gap-3">
            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">같은 자리 방지</p>
              <p className="text-sm text-muted-foreground">이전 배치와 같은 자리에 같은 학생이 다시 배정되는 것을 막습니다.</p>
            </div>
            <Switch
              checked={preventSameSeat}
              onCheckedChange={() => handleToggleRule("prevent_same_seat")}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-3">
          <div className="grid grid-cols-[1fr_auto] items-center gap-3">
            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">같은 짝 방지</p>
              <p className="text-sm text-muted-foreground">이전 배치에서 짝이었던 학생들이 다시 짝이 되지 않도록 합니다.</p>
            </div>
            <Switch
              checked={preventSamePair}
              onCheckedChange={() => handleToggleRule("prevent_same_pair")}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-3">
          <div className="grid grid-cols-[1fr_auto] items-center gap-3">
            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">연속 맨 뒷자리 방지</p>
              <p className="text-sm text-muted-foreground">연속으로 맨 뒷자리에 배정되는 학생이 없도록 합니다.</p>
            </div>
            <Switch
              checked={preventBackToBack}
              onCheckedChange={() => handleToggleRule("prevent_back_to_back")}
              disabled={isLoading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
