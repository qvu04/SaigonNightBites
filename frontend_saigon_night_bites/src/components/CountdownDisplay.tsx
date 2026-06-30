import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { formatTime } from '../utils'

const Box = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 14px 20px;
  text-align: center;
`

const Label = styled.p`
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7280;
`

const Time = styled.p`
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #f97316;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
`

export const CountdownDisplay = ({ expiresAt }: { expiresAt: string }) => {
  const [remaining, setRemaining] = useState(() => new Date(expiresAt).getTime() - Date.now())

  useEffect(() => {
    const id = setInterval(() => setRemaining(new Date(expiresAt).getTime() - Date.now()), 1000)
    return () => clearInterval(id)
  }, [expiresAt])

  return (
    <Box>
      <Label>Hết hạn sau</Label>
      <Time>{formatTime(remaining)}</Time>
    </Box>
  )
}
