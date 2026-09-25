import { DragDropProvider, KeyboardSensor, PointerSensor } from '@dnd-kit/react'
import { Box, List, Menu, MenuItem } from '@mui/material'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

import marxismMarkUrl from '@/assets/image/marxism-mark.svg'
import portraitsUrl from '@/assets/image/portraits.svg'
import { useVerge } from '@/hooks/use-verge'
import { useNavMenuOrder } from '@/pages/_layout/hooks'
import { navItems } from '@/pages/_navigation'

import { SortableItem } from '../base'

import { LayoutItem } from './layout-item'
import { LayoutTraffic } from './layout-traffic'
import { UpdateButton } from './update-button'

type MenuContextPosition = { top: number; left: number }

interface LayoutSidebarProps {
  isDark: boolean
  isCollapsed: boolean
}

const SENSORS = [PointerSensor, KeyboardSensor]

export const LayoutSidebar = (props: LayoutSidebarProps) => {
  const { isDark: _isDark, isCollapsed } = props
  const { t } = useTranslation()
  const { verge, mutateVerge, patchVerge } = useVerge()
  const [menuUnlocked, setMenuUnlocked] = useState(false)
  const [menuContextPosition, setMenuContextPosition] =
    useState<MenuContextPosition | null>(null)

  const handleMenuOrderOptimisticUpdate = useCallback(
    (order: string[]) => {
      mutateVerge(
        (prev) => (prev ? { ...prev, menu_order: order } : prev),
        false,
      )
    },
    [mutateVerge],
  )

  const handleMenuOrderPersist = useCallback(
    (order: string[]) => patchVerge({ menu_order: order }),
    [patchVerge],
  )

  const {
    menuOrder,
    navItemMap,
    handleMenuDragEnd,
    isDefaultOrder,
    resetMenuOrder,
  } = useNavMenuOrder({
    enabled: menuUnlocked,
    items: navItems,
    storedOrder: verge?.menu_order,
    onOptimisticUpdate: handleMenuOrderOptimisticUpdate,
    onPersist: handleMenuOrderPersist,
  })

  const handleMenuContextMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setMenuContextPosition({ top: event.clientY, left: event.clientX })
    },
    [],
  )

  const handleMenuContextClose = useCallback(() => {
    setMenuContextPosition(null)
  }, [])

  const handleResetMenuOrder = useCallback(() => {
    setMenuContextPosition(null)
    void resetMenuOrder()
  }, [resetMenuOrder])

  const handleUnlockMenu = useCallback(() => {
    setMenuUnlocked(true)
    setMenuContextPosition(null)
  }, [])

  const handleLockMenu = useCallback(() => {
    setMenuUnlocked(false)
    setMenuContextPosition(null)
  }, [])

  const handleToggleNavCollapsed = useCallback(() => {
    setMenuContextPosition(null)
    void patchVerge({ collapse_navbar: !isCollapsed })
  }, [isCollapsed, patchVerge])

  // Navigation menu items
  const navMenuItems = menuOrder.map((path, index) => {
    const item = navItemMap.get(path)
    if (!item) return null

    return (
      <SortableItem
        key={item.path}
        id={item.path}
        index={index}
        disabled={!menuUnlocked}
      >
        {(sortable) => (
          <LayoutItem to={item.path} icon={item.icon} sortable={sortable}>
            {t(item.label)}
          </LayoutItem>
        )}
      </SortableItem>
    )
  })

  return (
    <div className="layout-content__left">
      {/* Logo: Marxism VPN */}
      <div
        className="the-logo"
        data-tauri-drag-region="false"
        style={{
          // layout.scss gives .the-logo height: 100%. With the extra brand
          // lines that fills the sidebar and the overflow:hidden parent clips
          // the navigation that follows.
          flex: '0 0 auto',
          height: 'auto',
          padding: isCollapsed ? '16px 4px 10px' : '16px 12px 12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div
          data-tauri-drag-region="true"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <img
            src={marxismMarkUrl}
            alt="Marxism VPN"
            style={{
              width: isCollapsed ? '34px' : '52px',
              height: isCollapsed ? '34px' : '52px',
              filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.35))',
            }}
          />
          {!isCollapsed && (
            <>
              <div
                style={{
                  marginTop: '10px',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  letterSpacing: '1px',
                  textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
                }}
              >
                马克思主义VPN
              </div>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'rgba(247, 244, 238, 0.85)',
                  letterSpacing: '0.8px',
                }}
              >
                Marxism VPN
              </div>
              <div
                style={{
                  marginTop: '8px',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#FFD700',
                  letterSpacing: '0.5px',
                  opacity: 0.95,
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.15)',
                }}
              >
                全世界无产者，联合起来！
              </div>
            </>
          )}
        </div>
        <UpdateButton className="the-newbtn" />
      </div>

      {/* Edit navigation menu badge */}
      {menuUnlocked && (
        <Box
          sx={(theme) => ({
            px: 1.5,
            py: 0.75,
            mx: 'auto',
            mb: 1,
            maxWidth: 250,
            borderRadius: 1.5,
            fontSize: 12,
            fontWeight: 600,
            textAlign: 'center',
            color: theme.palette.warning.contrastText,
            bgcolor:
              theme.palette.mode === 'light'
                ? theme.palette.warning.main
                : theme.palette.warning.dark,
          })}
        >
          {t('layout.components.navigation.menu.reorderMode')}
        </Box>
      )}

      {/* Navigation menu */}
      <List className="the-menu" onContextMenu={handleMenuContextMenu}>
        <DragDropProvider sensors={SENSORS} onDragEnd={handleMenuDragEnd}>
          {navMenuItems}
        </DragDropProvider>
      </List>

      {/* Context menu */}
      <Menu
        open={Boolean(menuContextPosition)}
        onClose={handleMenuContextClose}
        anchorReference="anchorPosition"
        anchorPosition={
          menuContextPosition
            ? {
                top: menuContextPosition.top,
                left: menuContextPosition.left,
              }
            : undefined
        }
        transitionDuration={200}
        slotProps={{
          list: {
            sx: { py: 0.5 },
          },
        }}
      >
        <MenuItem onClick={handleToggleNavCollapsed} dense>
          {isCollapsed
            ? t('layout.components.navigation.menu.expandNavBar')
            : t('layout.components.navigation.menu.collapseNavBar')}
        </MenuItem>
        <MenuItem
          onClick={menuUnlocked ? handleLockMenu : handleUnlockMenu}
          dense
        >
          {menuUnlocked
            ? t('layout.components.navigation.menu.lock')
            : t('layout.components.navigation.menu.unlock')}
        </MenuItem>
        <MenuItem
          onClick={handleResetMenuOrder}
          dense
          disabled={isDefaultOrder}
        >
          {t('layout.components.navigation.menu.restoreDefaultOrder')}
        </MenuItem>
      </Menu>

      {/* Traffic & Bottom Quote */}
      <div className="the-traffic" style={{ flex: '0 0 auto' }}>
        <LayoutTraffic />
      </div>

      {/* Marx Quote & Great Leaders Watermark */}
      {!isCollapsed && (
        <div
          style={{
            position: 'relative',
            marginTop: 'auto',
            padding: '16px 16px 20px',
            fontSize: '11px',
            color: 'rgba(247, 244, 238, 0.85)',
            lineHeight: 1.6,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: '-10px',
              left: 0,
              right: 0,
              height: '130px',
              backgroundImage: `url(${portraitsUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom center',
              backgroundSize: '180px auto',
              opacity: 0.12,
              pointerEvents: 'none',
              filter: 'contrast(1.5)',
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p
              style={{
                margin: '0 0 6px',
                fontWeight: 500,
                fontStyle: 'italic',
                letterSpacing: '0.3px',
              }}
            >
              “哲学家们只是用不同的方式解释世界，问题在于改变世界。”
            </p>
            <p
              style={{
                margin: 0,
                textAlign: 'right',
                color: '#FFD700',
                fontSize: '10.5px',
                fontWeight: 600,
              }}
            >
              —— 卡尔·马克思
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
