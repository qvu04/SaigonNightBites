import { type ReactNode } from 'react'
import { Modal } from 'antd'
import styled, { keyframes } from 'styled-components'
import { FiX } from 'react-icons/fi'

export type ModalVariant = 'logout' | 'session' | 'delete' | 'location' | 'error' | 'success'

interface VariantStyle {
  iconBg: string
  iconColor: string
  confirmBg: string
  confirmHoverBg: string
}

const VARIANTS: Record<ModalVariant, VariantStyle> = {
  logout: { iconBg: 'rgba(239,68,68,0.15)', iconColor: '#f87171', confirmBg: '#ef4444', confirmHoverBg: '#dc2626' },
  session: { iconBg: 'rgba(249,115,22,0.15)', iconColor: '#f97316', confirmBg: '#f97316', confirmHoverBg: '#ea6c0a' },
  delete: { iconBg: 'rgba(239,68,68,0.15)', iconColor: '#f87171', confirmBg: '#ef4444', confirmHoverBg: '#dc2626' },
  location: { iconBg: 'rgba(249,115,22,0.15)', iconColor: '#f97316', confirmBg: '#f97316', confirmHoverBg: '#ea6c0a' },
  error: { iconBg: 'rgba(239,68,68,0.15)', iconColor: '#f87171', confirmBg: '#ef4444', confirmHoverBg: '#dc2626' },
  success: { iconBg: 'rgba(34,197,94,0.15)', iconColor: '#22c55e', confirmBg: '#22c55e', confirmHoverBg: '#16a34a' },
}

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const StyledModal = styled(Modal)`
  .ant-modal-container {
    background: #1c1c1e !important;
    border-radius: 24px !important;
    padding: 0 !important;
    overflow: hidden !important;
    position: relative !important;
  }
`

const CloseBtn = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.14);
    color: #fff;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

const IconWrapper = styled.div<{ $bg: string; $color: string }>`
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
`

const Title = styled.h3`
  margin: 0 0 8px;
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  line-height: 1.3;
`

const Description = styled.p`
  margin: 0 0 20px;
  color: #9ca3af;
  font-size: 14px;
  line-height: 1.65;
  text-align: center;
`

const ExtraSlot = styled.div`
  margin-bottom: 20px;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`

const CancelBtn = styled.button`
  flex: 1;
  height: 52px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.11);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

const ConfirmBtn = styled.button<{ $bg: string; $hoverBg: string }>`
  flex: 1;
  height: 52px;
  border-radius: 16px;
  background: ${({ $bg }) => $bg};
  border: none;
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s, opacity 0.15s;

  &:hover:not(:disabled) {
    background: ${({ $hoverBg }) => $hoverBg};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  flex-shrink: 0;
  animation: ${spin} 0.6s linear infinite;
`
export interface ConfirmModalProps {
  open: boolean
  variant: ModalVariant
  icon: ReactNode
  title: string
  description: string
  cancelText?: string
  confirmText: string
  /** Slot tùy chọn — dùng cho countdown timer, ghi chú thêm, v.v. */
  extra?: ReactNode
  confirmLoading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ConfirmModal = ({
  open,
  variant,
  icon,
  title,
  description,
  cancelText = 'Hủy',
  confirmText,
  extra,
  confirmLoading = false,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  const v = VARIANTS[variant]

  return (
    <StyledModal
      open={open}
      onCancel={() => { if (!confirmLoading) onClose() }}
      footer={null}
      title={null}
      closable={false}
      centered
      width={400}
      styles={{
        body: { padding: '32px 24px 24px' },
        mask: { backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.65)' },
      }}
    >
      <CloseBtn onClick={onClose} aria-label="Đóng" disabled={confirmLoading}>
        <FiX size={18} />
      </CloseBtn>

      <IconWrapper $bg={v.iconBg} $color={v.iconColor}>
        {icon}
      </IconWrapper>

      <Title>{title}</Title>
      <Description>{description}</Description>

      {extra && <ExtraSlot>{extra}</ExtraSlot>}

      <ButtonRow>
        <CancelBtn onClick={onClose} disabled={confirmLoading}>
          {cancelText}
        </CancelBtn>
        <ConfirmBtn
          $bg={v.confirmBg}
          $hoverBg={v.confirmHoverBg}
          onClick={onConfirm}
          disabled={confirmLoading}
        >
          {confirmLoading && <Spinner />}
          {confirmText}
        </ConfirmBtn>
      </ButtonRow>
    </StyledModal>
  )
}
