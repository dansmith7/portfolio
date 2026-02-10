/**
 * Синхронизация данных между админкой и сайтом (в т.ч. в разных вкладках).
 * При сохранении в админке бroadcast уведомляет все вкладки — они инвалидируют кэш.
 */

const CHANNEL = 'portfolio-admin-sync'

export function broadcastAdminSave() {
  try {
    if (typeof BroadcastChannel === 'undefined') return
    const bc = new BroadcastChannel(CHANNEL)
    bc.postMessage({ type: 'admin-saved', ts: Date.now() })
    bc.close()
  } catch (_) {}
}

export function subscribeToAdminSync(queryClient) {
  try {
    if (typeof BroadcastChannel === 'undefined') return () => {}
    const bc = new BroadcastChannel(CHANNEL)
    bc.onmessage = () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['project'] })
      queryClient.invalidateQueries({ queryKey: ['site_settings'] })
    }
    return () => bc.close()
  } catch (_) {
    return () => {}
  }
}
