'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export function LiveChat() {
  const scriptUrl = process.env.NEXT_PUBLIC_ODOO_LIVECHAT_SCRIPT
  const loaderUrl = process.env.NEXT_PUBLIC_ODOO_LIVECHAT_LOADER
  const rawSnippet = process.env.NEXT_PUBLIC_ODOO_LIVECHAT_SNIPPET

  useEffect(() => {
    if (!loaderUrl || !scriptUrl) return
    if (document.getElementById('odoo-livechat-loader')) return

    const loader = document.createElement('script')
    loader.id = 'odoo-livechat-loader'
    loader.src = loaderUrl
    loader.onload = () => {
      const odooWindow = window as typeof window & {
        __mbLivechatProfileName?: string
        odoo?: { __session_info__?: { livechatData?: { options?: { default_username?: string } } } }
      }
      const livechatOptions = odooWindow.odoo?.__session_info__?.livechatData?.options
      if (livechatOptions && odooWindow.__mbLivechatProfileName) {
        livechatOptions.default_username = odooWindow.__mbLivechatProfileName
      }

      if (!document.getElementById('odoo-livechat-assets')) {
        const assets = document.createElement('script')
        assets.id = 'odoo-livechat-assets'
        assets.src = scriptUrl
        document.head.appendChild(assets)
      }
    }
    document.head.appendChild(loader)
  }, [loaderUrl, scriptUrl])

  if ((!scriptUrl && !rawSnippet) || (scriptUrl && !loaderUrl && !rawSnippet)) {
    return null
  }

  if (rawSnippet) {
    return (
      <Script
        id="odoo-livechat-snippet"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: rawSnippet,
        }}
      />
    )
  }

  return null
}
