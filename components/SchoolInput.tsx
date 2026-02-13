"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface SchoolResult {
  SCHUL_NM: string
  ORG_RDNMA: string
}

interface SchoolInputProps {
  value: string
  onChange: (value: string) => void
}

export default function SchoolInput({ value, onChange }: SchoolInputProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SchoolResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    setError("")
    setResults([])

    try {
      const params = new URLSearchParams({
        KEY: process.env.NEIS_API_KEY || "",
        Type: "json",
        pIndex: "1",
        pSize: "20",
        SCHUL_NM: query.trim(),
      })

      const response = await fetch(
        `https://open.neis.go.kr/hub/schoolInfo?${params.toString()}`
      )

      if (!response.ok) {
        throw new Error("Failed to fetch schools")
      }

      const data = await response.json()

      // Parse the response according to the API structure
      if (data.schoolInfo && data.schoolInfo[1] && data.schoolInfo[1].row) {
        setResults(data.schoolInfo[1].row)
      } else {
        setResults([])
        setError("검색 결과가 없습니다.")
      }
    } catch (err) {
      console.error("School search error:", err)
      setError("학교 검색 중 오류가 발생했습니다.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelect = (school: SchoolResult) => {
    onChange(school.SCHUL_NM)
    setResults([])
    setQuery("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground" htmlFor="school">
        학교
      </label>

      {value ? (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-11 rounded-md border border-border bg-background px-3 flex items-center text-sm">
            {value}
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onChange("")
              setQuery("")
            }}
          >
            변경
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              id="school"
              name="school"
              type="text"
              placeholder="학교명을 입력하세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-11 flex-1 rounded-md border border-border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary/40"
            />
            <Button
              type="button"
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
            >
              {isSearching ? "검색 중..." : "검색"}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {results.length > 0 && (
            <Card className="max-h-64 overflow-y-auto p-0">
              <div className="divide-y">
                {results.map((school, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelect(school)}
                    className="w-full p-3 text-left hover:bg-accent transition"
                  >
                    <div className="font-medium text-sm">{school.SCHUL_NM}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {school.ORG_RDNMA}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
