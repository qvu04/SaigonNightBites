import { useNavigate } from 'react-router-dom'
import { FiHome, FiCompass } from 'react-icons/fi'
import styled from 'styled-components'
import { useAuthStore } from '../stores'

const Page = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #0f0f0f;
  text-align: center;
`

const Code = styled.p`
  font-size: 96px;
  font-weight: 800;
  line-height: 1;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #f97316, #ef4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -4px;
`

const Title = styled.h1`
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
`

const Subtitle = styled.p`
  margin: 0 0 40px;
  font-size: 15px;
  color: #6b7280;
  line-height: 1.6;
  max-width: 280px;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`

const PrimaryBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 24px;
  border-radius: 14px;
  background: #f97316;
  border: none;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #ea6c0a; }
`

const SecondaryBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 24px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.06);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: rgba(255, 255, 255, 0.11); }
`

export default function NotFound() {
  const navigate = useNavigate()
  const token = useAuthStore((s) => s.token);
  return (
    <Page>
      <Code>404</Code>
      <Title>Trang không tồn tại</Title>
      <Subtitle>
        Đường dẫn bạn truy cập không tồn tại hoặc đã bị di chuyển sang nơi khác.
      </Subtitle>
      <ButtonRow>
        <PrimaryBtn onClick={() => navigate('/home')}>
          <FiHome size={18} />
          Về trang chủ
        </PrimaryBtn>
        <SecondaryBtn onClick={() => navigate('/discovery')}>
          <FiCompass size={18} />
          Khám phá
        </SecondaryBtn>
      </ButtonRow>
    </Page>
  )
}
