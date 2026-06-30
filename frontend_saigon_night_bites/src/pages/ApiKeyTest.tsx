import { useState } from 'react'
import { FiCheckCircle, FiXCircle, FiLoader, FiZap, FiMap, type IconType } from 'react-icons/fi'
import { testApiKeys } from '../api/test'

type Status = 'idle' | 'loading' | 'done'

interface KeyResult {
  ok: boolean
  message: string
  latencyMs: number | null
}

interface KeyCardProps {
  name: string
  icon: IconType
  result: KeyResult | null
  loading: boolean
}

function KeyCard({ name, icon: Icon, result, loading }: KeyCardProps) {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-500">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{name}</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">Backend → External API</p>
        </div>

        <div className="ml-auto">
          {loading && <FiLoader className="w-5 h-5 text-orange-400 animate-spin" />}
          {!loading && result === null && (
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600 inline-block" />
          )}
          {!loading && result?.ok === true && (
            <FiCheckCircle className="w-5 h-5 text-green-500" />
          )}
          {!loading && result?.ok === false && (
            <FiXCircle className="w-5 h-5 text-red-500" />
          )}
        </div>
      </div>

      {result && (
        <div
          className={`rounded-xl px-4 py-3 text-xs font-mono leading-relaxed break-all ${
            result.ok
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
          }`}
        >
          {result.message}
          {result.latencyMs !== null && (
            <span className="ml-2 opacity-60">({result.latencyMs} ms)</span>
          )}
        </div>
      )}

      {!result && !loading && (
        <p className="text-xs text-zinc-400 dark:text-zinc-500 italic">Chưa chạy test</p>
      )}
    </div>
  )
}

export default function ApiKeyTest() {
  const [status, setStatus] = useState<Status>('idle')
  const [results, setResults] = useState<{ gemini: KeyResult | null; places: KeyResult | null }>({
    gemini: null,
    places: null,
  })

  const runTest = async () => {
    setStatus('loading')
    setResults({ gemini: null, places: null })
    try {
      const res = await testApiKeys()
      setResults(res.data.data)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } }; message?: string })
          .response?.data?.error ||
        (err as { message?: string }).message ||
        'Không thể kết nối backend'
      setResults({
        gemini: { ok: false, message: msg, latencyMs: null },
        places: { ok: false, message: msg, latencyMs: null },
      })
    } finally {
      setStatus('done')
    }
  }

  const allOk = status === 'done' && results.gemini?.ok && results.places?.ok

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-start px-4 pt-12 pb-16">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            Kiểm tra API Keys
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Xác nhận Gemini và Google Places API đang hoạt động
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <KeyCard
            name="Gemini API Key"
            icon={FiZap}
            result={results.gemini}
            loading={status === 'loading'}
          />
          <KeyCard
            name="Google Places API Key"
            icon={FiMap}
            result={results.places}
            loading={status === 'loading'}
          />
        </div>

        <button
          onClick={runTest}
          disabled={status === 'loading'}
          className="w-full py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base transition-colors shadow-lg shadow-orange-200 dark:shadow-orange-900/30"
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang kiểm tra...
            </span>
          ) : status === 'done' ? (
            'Chạy lại'
          ) : (
            'Chạy test'
          )}
        </button>

        {status === 'done' && (
          <p
            className={`text-center text-sm font-medium mt-4 ${
              allOk ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {allOk ? 'Tất cả API keys hoạt động tốt' : 'Một hoặc nhiều key có vấn đề'}
          </p>
        )}
      </div>
    </div>
  )
}
