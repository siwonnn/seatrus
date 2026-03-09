"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { submitOnboarding } from "./actions"
import SchoolInput from "@/components/SchoolInput"

interface OnboardingProps {
	fixedSchoolName: string | null
}

export default function Onboarding({ fixedSchoolName }: OnboardingProps) {
	const router = useRouter()
	const [school, setSchool] = useState(fixedSchoolName ?? "")
	const [grade, setGrade] = useState<number | "">("")
	const [className, setClassName] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState("")

	const isValid =
		school.trim().length > 0 &&
		className.trim().length > 0 &&
		typeof grade === "number" &&
		grade > 0

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		if (!isValid || isSubmitting) return

		setIsSubmitting(true)
		setError("")

		try {
			const result = await submitOnboarding({
				organizationName: school.trim(),
				grade: grade as number,
				className: className.trim(),
			})

			if (result.ok) {
				router.replace("/main")
			} else {
				setError("설정 중 오류가 발생했습니다. " + result.message)
				setIsSubmitting(false)
			}
		} catch (err) {
			console.error("Onboarding error:", err)
			setError("설정 중 오류가 발생했습니다.")
			setIsSubmitting(false)
		}
	}

	return (
		<div className="min-h-screen bg-linear-to-br from-background via-secondary/30 to-accent/20 px-6 py-12">
			<div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-foreground">시작하기</h1>
				</div>

				<Card className="border-border/60 bg-card/90 shadow-lg backdrop-blur">
					<CardHeader>
						<CardTitle>기본 정보</CardTitle>
						<CardDescription>학교, 학년, 반을 입력해 주세요.</CardDescription>
					</CardHeader>
					<CardContent>
						<form className="space-y-6" onSubmit={handleSubmit}>
							{fixedSchoolName ? (
								<div className="space-y-2">
									<label className="text-sm font-medium text-foreground" htmlFor="school-fixed">
										학교
									</label>
									<div
										id="school-fixed"
										className="h-11 w-full rounded-md border border-border bg-muted/30 px-3 text-sm text-foreground flex items-center"
									>
										{fixedSchoolName}
									</div>
									<p className="text-xs text-muted-foreground">
										학교 이메일 도메인으로 자동 설정되었습니다.
									</p>
								</div>
							) : (
								<SchoolInput value={school} onChange={setSchool} />
							)}

							<div className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<label className="text-sm font-medium text-foreground" htmlFor="grade">
										학년
									</label>
									<input
										id="grade"
										name="grade"
										type="number"
										min={1}
										max={6}
										placeholder="2"
										value={grade}
										onChange={(event) =>
											setGrade(event.target.value ? Number(event.target.value) : "")
										}
										className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40"
										required
									/>
								</div>

								<div className="space-y-2">
									<label className="text-sm font-medium text-foreground" htmlFor="class">
										반
									</label>
									<input
										id="class"
										name="class"
										type="text"
										placeholder="3"
										value={className}
										onChange={(event) => setClassName(event.target.value)}
										className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40"
										required
									/>
								</div>
							</div>

							{error && (
								<div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
									{error}
								</div>
							)}

							<Button 
								className="w-full" 
								type="submit" 
								disabled={!isValid || isSubmitting}
							>
								{isSubmitting ? "처리 중..." : "완료하고 시작하기"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}