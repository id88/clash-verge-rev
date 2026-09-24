import {
  CampaignRounded,
  SecurityRounded,
  LockRounded,
  HubRounded,
  MenuBookRounded,
  AutoStoriesRounded,
  StarRounded,
  ForumRounded,
  ChevronRightRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'

import { useSystemProxyState } from '@/hooks/use-system-proxy-state'
import { showNotice } from '@/services/notice-service'

interface MarxismHomeDashboardProps {
  children?: React.ReactNode
}

export const MarxismHomeDashboard: React.FC<MarxismHomeDashboardProps> = ({ children }) => {
  const { indicator: isConnected, toggleSystemProxy } = useSystemProxyState()

  // Live timer for connection
  const [seconds, setSeconds] = useState(0)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    let interval: any
    if (isConnected) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      setSeconds(0)
    }
    return () => clearInterval(interval)
  }, [isConnected])

  const formatTimer = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600)
    const mins = Math.floor((totalSec % 3600) / 60)
    const secs = totalSec % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleToggleConnection = async () => {
    setIsToggling(true)
    try {
      await toggleSystemProxy(!isConnected)
      showNotice.success(
        !isConnected ? '已成功接入马克思主义安全网络' : '已断开系统代理连接',
      )
    } catch (err: any) {
      showNotice.error(err?.message || '操作失败')
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 960, mx: 'auto' }}>
      {/* 1. 顶部公告横幅 */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.2,
          mb: 2,
          bgcolor: '#FFF1F0',
          border: '1px solid #FFA39E',
          borderRadius: 2,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CampaignRounded sx={{ color: '#C8102E', fontSize: 22 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: '#8B1018', letterSpacing: 0.5 }}
          >
            坚持马克思主义指导地位，建设网络强国！
          </Typography>
        </Stack>
        <Button
          size="small"
          endIcon={<ChevronRightRounded sx={{ fontSize: 16 }} />}
          onClick={() =>
            showNotice.info('最新公告：牢牢把握意识形态工作领导权，筑牢网络安全防线！')
          }
          sx={{
            color: '#8B1018',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': { bgcolor: 'rgba(200, 16, 46, 0.08)' },
          }}
        >
          查看公告
        </Button>
      </Paper>

      {/* 2. 核心连接状态主卡片 */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          mb: 2.5,
          bgcolor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 3,
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        }}
      >
        {/* 中心镰刀锤头与动态光环 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            my: 1.5,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: 150,
              height: 150,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isConnected
                ? 'radial-gradient(circle, rgba(200,16,46,0.06) 0%, rgba(200,16,46,0.18) 100%)'
                : 'radial-gradient(circle, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.06) 100%)',
              border: isConnected ? '7px solid #C8102E' : '7px solid #D1D5DB',
              boxShadow: isConnected
                ? '0 0 30px rgba(200, 16, 46, 0.25), inset 0 0 12px rgba(200, 16, 46, 0.12)'
                : 'none',
              transition: 'all 0.4s ease-in-out',
            }}
          >
            <Box
              component="img"
              src="/src/assets/image/soviet-hammer-and-sickle.svg"
              alt="Soviet Hammer and Sickle"
              sx={{
                width: 80,
                height: 80,
                filter: isConnected
                  ? 'drop-shadow(0 4px 10px rgba(200, 16, 46, 0.4))'
                  : 'grayscale(100%) opacity(0.35)',
                transition: 'all 0.3s ease',
              }}
            />
          </Box>
        </Box>

        {/* 状态文案 */}
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: isConnected ? '#C8102E' : '#6B7280',
            letterSpacing: 1,
            mt: 1.5,
            mb: 0.5,
          }}
        >
          {isConnected ? '已连接' : '未连接'}
        </Typography>

        <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
          {isConnected
            ? '您已通过马克思主义VPN安全连接'
            : '点击下方按钮一键接入安全网络'}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            color: '#1F2937',
            letterSpacing: 2,
            mb: 2.5,
          }}
        >
          {formatTimer(seconds)}
        </Typography>

        {/* 宽幅操作按钮 */}
        <Button
          variant="contained"
          size="large"
          disabled={isToggling}
          onClick={handleToggleConnection}
          sx={{
            width: '100%',
            maxWidth: 340,
            py: 1.3,
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: 1,
            borderRadius: 2,
            bgcolor: isConnected ? '#C8102E' : '#B31B1B',
            boxShadow: '0 4px 14px rgba(200, 16, 46, 0.35)',
            '&:hover': {
              bgcolor: isConnected ? '#9A1616' : '#8B1018',
              boxShadow: '0 6px 20px rgba(200, 16, 46, 0.45)',
            },
          }}
        >
          {isToggling
            ? '处理中...'
            : isConnected
              ? '断开连接'
              : '立即连接'}
        </Button>

        {/* 三联指标卡片嵌入 */}
        <Grid container spacing={2} sx={{ mt: 2.5, pt: 2, borderTop: '1px solid #F3F4F6' }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.2 }}>
              <SecurityRounded sx={{ color: '#C8102E', fontSize: 20 }} />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="caption" sx={{ color: '#6B7280', display: 'block', fontSize: '11px' }}>
                  连接协议
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '12.5px' }}>
                  Marxism Protocol
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.2 }}>
              <LockRounded sx={{ color: '#C8102E', fontSize: 20 }} />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="caption" sx={{ color: '#6B7280', display: 'block', fontSize: '11px' }}>
                  加密级别
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '12.5px' }}>
                  AES-256 (最高级别)
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.2 }}>
              <HubRounded sx={{ color: '#C8102E', fontSize: 20 }} />
              <Box sx={{ textAlign: 'left' }}>
                <Typography variant="caption" sx={{ color: '#6B7280', display: 'block', fontSize: '11px' }}>
                  连接模式
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '12.5px' }}>
                  智能模式 (自动选优)
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* 3. 原版完整功能模块卡片区域 (100% 保留全部原有功能卡片与设置) */}
      <Box sx={{ mb: 2.5 }}>
        {children}
      </Box>

      {/* 4. 快捷工具栏 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1F2937', mb: 1.5, px: 0.5 }}>
          快捷工具
        </Typography>

        <Grid container spacing={1.5}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              elevation={0}
              onClick={() => showNotice.info('正在载入马克思主义基础理论学习平台...')}
              sx={{
                p: 1.8,
                bgcolor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#C8102E',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(200, 16, 46, 0.08)',
                },
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                <MenuBookRounded sx={{ color: '#C8102E', fontSize: 22 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '13px' }}>
                    理论学习
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '11px' }}>
                    学习经典理论
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              elevation={0}
              onClick={() => showNotice.info('正在载入《资本论》《共产党宣言》等重要文献库...')}
              sx={{
                p: 1.8,
                bgcolor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#C8102E',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(200, 16, 46, 0.08)',
                },
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                <AutoStoriesRounded sx={{ color: '#C8102E', fontSize: 22 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '13px' }}>
                    重要文献
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '11px' }}>
                    阅读经典著作
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              elevation={0}
              onClick={() => showNotice.info('正在更新时政要闻专线...')}
              sx={{
                p: 1.8,
                bgcolor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#C8102E',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(200, 16, 46, 0.08)',
                },
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                <StarRounded sx={{ color: '#FFD700', fontSize: 22 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '13px' }}>
                    时政要闻
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '11px' }}>
                    了解最新动态
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              elevation={0}
              onClick={() => showNotice.info('正在连接思想交流社区...')}
              sx={{
                p: 1.8,
                bgcolor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#C8102E',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(200, 16, 46, 0.08)',
                },
              }}
            >
              <Stack direction="row" spacing={1.2} alignItems="center">
                <ForumRounded sx={{ color: '#C8102E', fontSize: 22 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1F2937', fontSize: '13px' }}>
                    交流社区
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '11px' }}>
                    思想交流与探讨
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* 5. 底部状态与版权栏 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 2,
          pb: 1,
          borderTop: '1px solid #E5E7EB',
          color: '#6B7280',
          fontSize: '12px',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <SecurityRounded sx={{ fontSize: 16, color: '#C8102E' }} />
          <Typography variant="caption" sx={{ color: '#6B7280', fontWeight: 500 }}>
            马克思主义VPN保护您的网络自由与思想安全
          </Typography>
        </Stack>
        <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
          版本 1.0.0
        </Typography>
      </Box>
    </Box>
  )
}
