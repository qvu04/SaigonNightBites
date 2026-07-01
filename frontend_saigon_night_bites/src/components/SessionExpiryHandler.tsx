import { FiClock } from 'react-icons/fi'
import { ConfirmModal, CountdownDisplay } from '../components'
import { useAuthStore } from '../stores'
export function SessionExpiryHandler() {
  const showSessionModal = useAuthStore((s) => s.showSessionModal)
  const sessionExpireAt = useAuthStore((s) => s.sessionExpireAt)
  const renewLoading = useAuthStore((s) => s.renewLoading)
  const handleRenewSession = useAuthStore((s) => s.handleRenewSession)
  const handleDismissSession = useAuthStore((s) => s.handleDismissSession)

  return (
    <ConfirmModal
      open={showSessionModal}
      variant="session"
      icon={<FiClock size={28} />}
      title="Phiên đăng nhập sắp hết hạn"
      description="Phiên làm việc của bạn sắp hết hạn. Bạn có muốn gia hạn không?"
      cancelText="Để sau"
      confirmText="Gia hạn ngay"
      extra={sessionExpireAt ? <CountdownDisplay expiresAt={sessionExpireAt} /> : undefined}
      confirmLoading={renewLoading}
      onClose={handleDismissSession}
      onConfirm={handleRenewSession}
    />
  )
}
