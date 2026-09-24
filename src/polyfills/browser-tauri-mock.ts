/**
 * Browser preview mock for Tauri v2 runtime.
 * Allows running and previewing the Clash Verge UI in standard web browsers.
 */

if (typeof window !== 'undefined') {
  if (!(window as any).__TAURI_EVENT_PLUGIN_INTERNALS__) {
    ;(window as any).__TAURI_EVENT_PLUGIN_INTERNALS__ = {
      unregisterListener: () => {},
    }
  }

  if (!(window as any).__TAURI_INTERNALS__) {
    const callbacks = new Map<number, (res: any) => void>()
    const previewPort = 7890
    const vergeConfig: Record<string, any> = {
      theme_mode: 'light',
      theme_setting: {
        primary_color: '#B31B1B',
        secondary_color: '#FFD700',
        background_color: '#F8F9FA',
      },
      language: 'zh',
      collapse_navbar: false,
      menu_icon: 'monochrome',
      enable_system_proxy: false,
      enable_tun_mode: false,
      proxy_auto_config: false,
      proxy_host: '127.0.0.1',
      verge_mixed_port: previewPort,
    }
    const sysProxy = { enable: false, server: '', bypass: '' }
    const autoProxy = { enable: false, url: '' }

    const syncObservedProxy = () => {
      const host = vergeConfig.proxy_host || '127.0.0.1'
      const port = vergeConfig.verge_mixed_port || previewPort
      if (vergeConfig.proxy_auto_config) {
        sysProxy.enable = false
        sysProxy.server = ''
        autoProxy.enable = Boolean(vergeConfig.enable_system_proxy)
        autoProxy.url = autoProxy.enable
          ? `http://${host}:${previewPort}/commands/pac`
          : ''
        return
      }
      autoProxy.enable = false
      autoProxy.url = ''
      sysProxy.enable = Boolean(vergeConfig.enable_system_proxy)
      sysProxy.server = sysProxy.enable ? `${host}:${port}` : ''
    }

    ;(window as any).__TAURI_INTERNALS__ = {
      metadata: {
        currentWindow: { label: 'main' },
        currentWebview: { label: 'main' },
        windows: [{ label: 'main' }],
        webviews: [{ label: 'main' }],
      },

      invoke: async (cmd: string, args?: any) => {
        // Return sensible defaults for frontend display in browser preview
        switch (cmd) {
          case 'get_verge_config':
            return {
              ...vergeConfig,
              theme_setting: { ...vergeConfig.theme_setting },
            }

          case 'patch_verge_config': {
            const payload = args?.payload ?? {}
            if (payload.theme_setting) {
              vergeConfig.theme_setting = {
                ...vergeConfig.theme_setting,
                ...payload.theme_setting,
              }
            }
            Object.assign(vergeConfig, payload, {
              theme_setting: vergeConfig.theme_setting,
            })
            syncObservedProxy()
            return null
          }

          case 'get_profiles':
            return {
              items: [
                {
                  id: 'marxism-sub',
                  name: '马克思主义核心节点订阅',
                  type: 'remote',
                  url: 'https://example.com/marxism.yaml',
                  updated: Date.now(),
                },
              ],
              current: 'marxism-sub',
            }

          case 'get_runtime_state':
            return {
              mode: 'NotRunning',
              service: 'unknown',
              serviceUnavailableReason: null,
              pendingAction: null,
              sidecarAllowed: false,
              isAdmin: false,
              opInFlight: false,
              serviceUsable: false,
              tunCapable: false,
              serviceNeedsAttention: false,
            }

          case 'get_pending_failures':
            return []

          case 'get_system_info':
            return {
              os: 'macos',
              arch: 'arm64',
            }

          case 'get_proxy_view':
            return {
              groups: [],
              proxies: {},
            }

          case 'get_runtime_config':
            return {
              mode: 'rule',
              'mixed-port': previewPort,
            }

          case 'get_runtime_logs':
            return {}

          case 'get_clash_info':
            return {
              port: previewPort,
              socks_port: 7891,
              redir_port: 0,
              tproxy_port: 0,
              mixed_port: previewPort,
            }

          case 'get_clash_mode':
            return 'rule'

          case 'get_clash_logs':
            return []

          case 'get_sys_proxy':
            return { ...sysProxy }

          case 'get_auto_proxy':
            return { ...autoProxy }

          case 'get_embedded_server_port':
            return previewPort

          case 'plugin:mihomo|get_base_config':
            return { mixedPort: previewPort, mode: 'rule' }

          case 'plugin:mihomo|get_rules':
            return { rules: [] }

          case 'plugin:mihomo|get_rule_providers':
            return { providers: {} }

          case 'check_service':
            return false

          case 'get_app_dir':
            return ''

          case 'plugin:window|theme':
            return 'light'

          case 'plugin:window|is_maximized':
            return false

          case 'plugin:event|listen':
            return Math.floor(Math.random() * 100000)

          case 'plugin:event|unlisten':
            return null

          case 'plugin:window|set_theme':
          case 'plugin:window|set_title':
          case 'plugin:window|set_focus':
            return null

          default:
            return null
        }
      },

      transformCallback: (callback: (response: any) => void, once = false) => {
        const id = Math.floor(Math.random() * 10000000)
        callbacks.set(id, (res) => {
          if (once) callbacks.delete(id)
          callback(res)
        })
        return id
      },

      unregisterCallback: (id: number) => {
        callbacks.delete(id)
      },

      convertFileSrc: (filePath: string) => filePath,
    }
  }
}
