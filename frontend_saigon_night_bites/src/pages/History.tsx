import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { FiClock } from 'react-icons/fi'
import Header from '../components/layout/Header'
import BottomNav from '../components/layout/BottomNav'
import { getHistory } from '../api/history'
import { formatMood, formatBudget } from '../utils/formatCurrency'
import type { SearchHistoryItem } from '../types'
import { formatRadiusKm, formatViDate } from '../utils'
export default function History() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory()
      .then((res) => setHistory(res.data.data.history || []))
      .catch(() => toast.error('Không thể tải lịch sử tìm kiếm'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 md:pb-10">
        <div className="flex items-center gap-2 mb-6">
          <FiClock className="w-5 h-5 text-zinc-500" />
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Lịch sử tìm kiếm
          </h1>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 skeleton rounded-2xl" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl block mb-4">📭</span>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium">
              Chưa có lịch sử tìm kiếm nào.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {history.map((item) => {
              const keywords = Array.isArray(item.ai_keywords) ? item.ai_keywords : []

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-zinc-800 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-700"
                >
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-2">
                    {formatViDate(item.created_at)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {formatMood(item.mood)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                      {formatBudget(item.budget)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      tìm trong {formatRadiusKm(item.radius)}
                    </span>
                  </div>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {keywords.map((kw) => (
                        <span
                          key={kw}
                          className="inline-block px-2 py-0.5 rounded-full text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
