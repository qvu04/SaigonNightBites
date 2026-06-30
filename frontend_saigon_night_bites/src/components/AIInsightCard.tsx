import { motion } from 'framer-motion'

interface Props {
  reason: string
  keywords: string[]
}

export const AIInsightCard = ({ reason, keywords }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800/40"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 mt-0.5">🤖</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 mb-1">
            AI gợi ý cho bạn
          </p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
            {reason}
          </p>
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500 text-white"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
