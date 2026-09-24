import {
  CampaignRounded,
  SecurityRounded,
  LockRounded,
  HubRounded,
  SignalCellularAltRounded,
  MenuBookRounded,
  AutoStoriesRounded,
  StarRounded,
  ForumRounded,
  ChevronRightRounded,
  CheckCircleRounded,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { useSystemProxyState } from '@/hooks/use-system-proxy-state'
import { useVerge } from '@/hooks/use-verge'
import { showNotice } from '@/services/notice-service'

export const MarxismHomeDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { indicator: isConnected, toggleSystemProxy } = useSystemProxyState()
  const { verge } = useVerge()

  // Connection timer simulation
  const [seconds, setSeconds] = useState(156) // default ~00:02:36
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
        !isConnected ? '已成功接入马克思主义网络' : '已断开马克思主义VPN连接',
      )
    } catch (err: any) {
      showNotice.error(err?.message || '操作失败')
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 840, mx: 'auto', p: { xs: 1.5, md: 2.5 } }}>
      {/* 1. 顶部公告横幅 */}
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1.25,
          mb: 2.5,
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
          p: { xs: 3, md: 4 },
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
            my: 2,
          }}
        >
          <Box
            sx={{
              position: 'relative',
              width: 170,
              height: 170,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isConnected
                ? 'radial-gradient(circle, rgba(200,16,46,0.06) 0%, rgba(200,16,46,0.18) 100%)'
                : 'radial-gradient(circle, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.06) 100%)',
              border: isConnected ? '8px solid #C8102E' : '8px solid #D1D5DB',
              boxShadow: isConnected
                ? '0 0 35px rgba(200, 16, 46, 0.28), inset 0 0 15px rgba(200, 16, 46, 0.15)'
                : 'none',
              transition: 'all 0.4s ease-in-out',
            }}
          >
            <Box
              component="img"
              src="/src/assets/image/soviet-hammer-and-sickle.svg"
              alt="Soviet Hammer and Sickle"
              sx={{
                width: 90,
                height: 90,
                filter: isConnected
                  ? 'drop-shadow(0 4px 10px rgba(200, 16, 46, 0.4))'
                  : 'grayscale(100%) opacity(0.4)',
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
            mt: 2,
            mb: 0.8,
          }}
        >
          {isConnected ? '已连接' : '未连接'}
        </Typography>

        <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>
          {isConnected
            ? '您已通过马克思主义VPN安全连接'
            : '点击下方按钮接入马克思主义安全网络'}
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            color: '#1F2937',
            letterSpacing: 2,
            mb: 3,
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
            maxWidth: 360,
            py: 1.4,
            fontSize: '16px',
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
      </Paper>

      {/* 3. 三联规格指标小卡片 */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                p: 1.2,
                borderRadius: 2,
                bgcolor: 'rgba(200, 16, 46, 0.08)',
                color: '#C8102E',
                display: 'flex',
              }}
            >
              <SecurityRounded fontSize="small" />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#6B7280' }}>
                连接协议
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1F2937' }}>
                Marxism Protocol
              </Typography>
              <Typography variant="caption" sx={{ color: '#16A34A', display: 'block' }}>
                安全可靠
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                p: 1.2,
                borderRadius: 2,
                bgcolor: 'rgba(200, 16, 46, 0.08)',
                color: '#C8102E',
                display: 'flex',
              }}
            >
              <LockRounded fontSize="small" />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#6B7280' }}>
                加密级别
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1F2937' }}>
                AES-256
              </Typography>
              <Typography variant="caption" sx={{ color: '#16A34A', display: 'block' }}>
                最高级别
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              borderRadius: 2.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                p: 1.2,
                borderRadius: 2,
                bgcolor: 'rgba(200, 16, 46, 0.08)',
                color: '#C8102E',
                display: 'flex',
              }}
            >
              <HubRounded fontSize="small" />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#6B7280' }}>
                连接模式
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1F2937' }}>
                智能模式
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B7280', display: 'block' }}>
                自动选择最优线路
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 4. 当前服务器卡片 (带世界地图背景点缀) */}
      <Box sx={{ mb: 2.5 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1.5,
            px: 0.5,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1F2937' }}>
            当前服务器
          </Typography>
          <Button
            size="small"
            endIcon={<ChevronRightRounded sx={{ fontSize: 16 }} />}
            onClick={() => navigate('/proxies')}
            sx={{
              color: '#8B1018',
              fontSize: '13px',
              fontWeight: 600,
              textTransform: 'none',
            }}
          >
            更换服务器
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            bgcolor: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 服务器条目详情 */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1.8,
              bgcolor: '#F9FAFB',
              borderRadius: 2,
              border: '1px solid #F3F4F6',
              mb: 2.5,
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 38,
                  height: 26,
                  bgcolor: '#C8102E',
                  borderRadius: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                }}
              >
                <Box
                  component="img"
                  src="/src/assets/image/soviet-hammer-and-sickle.svg"
                  sx={{ width: 18, height: 18 }}
                />
              </Box>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1F2937' }}>
                    中国 · 北京
                  </Typography>
                  <Box
                    sx={{
                      px: 0.8,
                      py: 0.2,
                      fontSize: '11px',
                      fontWeight: 700,
                      borderRadius: 1,
                      bgcolor: 'rgba(200, 16, 46, 0.1)',
                      color: '#C8102E',
                    }}
                  >
                    推荐
                  </Box>
                </Stack>
                <Typography variant="caption" sx={{ color: '#6B7280' }}>
                  延迟 28ms &nbsp;|&nbsp; 负载 23%
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <SignalCellularAltRounded sx={{ color: '#16A34A', fontSize: 24 }} />
              <ChevronRightRounded sx={{ color: '#9CA3AF' }} />
            </Stack>
          </Box>

          {/* 世界地图与红点雷达脉冲点缀 */}
          <Box
            sx={{
              position: 'relative',
              height: 140,
              width: '100%',
              bgcolor: '#FAFAFA',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* 抽象地图网格与大陆背景 */}
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                opacity: 0.15,
                backgroundImage:
                  'radial-gradient(#9CA3AF 1px, transparent 1px), radial-gradient(#9CA3AF 1px, #FAFAFA 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* 北京核心节点脉冲星 */}
            <Box
              sx={{
                position: 'absolute',
                right: '25%',
                top: '40%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: 'rgba(200, 16, 46, 0.2)',
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(0.8)', opacity: 0.8 },
                    '100%': { transform: 'scale(2.2)', opacity: 0 },
                  },
                }}
              />
              <Box
                sx={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  bgcolor: '#C8102E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px #C8102E',
                  zIndex: 2,
                }}
              >
                <Box
                  component="img"
                  src="/src/assets/image/soviet-hammer-and-sickle.svg"
                  sx={{ width: 12, height: 12 }}
                />
              </Box>
            </Box>

            {/* 辅助连线节点 */}
            <Box
              sx={{
                position: 'absolute',
                left: '20%',
                top: '45%',
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: '#C8102E',
                opacity: 0.7,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                left: '52%',
                top: '35%',
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: '#C8102E',
                opacity: 0.7,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                left: '42%',
                top: '70%',
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: '#C8102E',
                opacity: 0.7,
              }}
            />
          </Box>
        </Paper>
      </Box>

      {/* 5. 快捷工具 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1F2937', mb: 1.5, px: 0.5 }}>
          快捷工具
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 6, sm: 3 }}>
            <Paper
              elevation={0}
              onClick={() => showNotice.info('正在载入马克思主义基础理论学习平台...')}
              sx={{
                p: 2,
                bgcolor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 2.5,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#C8102E',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(200, 16, 46, 0.08)',
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <MenuBookRounded sx={{ color: '#C8102E', fontSize: 24 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1F2937' }}>
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
                p: 2,
                bgcolor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 2.5,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#C8102E',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(200, 16, 46, 0.08)',
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <AutoStoriesRounded sx={{ color: '#C8102E', fontSize: 24 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1F2937' }}>
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
                p: 2,
                bgcolor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 2.5,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#C8102E',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(200, 16, 46, 0.08)',
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <StarRounded sx={{ color: '#FFD700', fontSize: 24 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1F2937' }}>
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
                p: 2,
                bgcolor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: 2.5,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#C8102E',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(200, 16, 46, 0.08)',
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <ForumRounded sx={{ color: '#C8102E', fontSize: 24 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1F2937' }}>
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

      {/* 6. 底部状态与版权栏 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pt: 2,
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
