'use client'

import { FormEvent, useEffect, useRef, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

const LIVECHAT_BUTTON_SELECTOR = 'button[class*="o-livechat-LivechatButton"],button[class*="LivechatButton"],button[class*="livechat-button"],button[data-livechat-button],button[data-livechat]'
const PROFILE_STORAGE_KEY = 'master-build-livechat-profile-v2'

function findOdooElement(selector: string, root: ParentNode = document): HTMLElement | null {
  const selectors = selector.split(',').map((value) => value.trim()).filter(Boolean)

  for (const currentSelector of selectors) {
    const directMatch = root.querySelector<HTMLElement>(currentSelector)
    if (directMatch) return directMatch

    for (const element of root.querySelectorAll<HTMLElement>('*')) {
      if (element.shadowRoot) {
        const shadowMatch = findOdooElement(currentSelector, element.shadowRoot)
        if (shadowMatch) return shadowMatch
      }
    }
  }

  return null
}

function findOdooChatWindow(root: ParentNode = document): HTMLElement | null {
  if (root instanceof HTMLElement && root.matches('.o-mail-ChatWindow')) return root

  const directMatch = root.querySelector<HTMLElement>('.o-mail-ChatWindow')
  if (directMatch) return directMatch

  if (root instanceof HTMLElement && root.shadowRoot) {
    const shadowMatch = findOdooChatWindow(root.shadowRoot)
    if (shadowMatch) return shadowMatch
  }

  for (const element of root.querySelectorAll<HTMLElement>('*')) {
    if (element.shadowRoot) {
      const shadowMatch = findOdooChatWindow(element.shadowRoot)
      if (shadowMatch) return shadowMatch
    }
  }

  return null
}

function findOdooChatWindows(root: ParentNode = document): HTMLElement[] {
  const windows = [
    ...(root instanceof HTMLElement && root.matches('.o-mail-ChatWindow') ? [root] : []),
    ...Array.from(root.querySelectorAll<HTMLElement>('.o-mail-ChatWindow')),
  ]

  if (root instanceof HTMLElement && root.shadowRoot) {
    windows.push(...findOdooChatWindows(root.shadowRoot))
  }

  for (const element of root.querySelectorAll<HTMLElement>('*')) {
    if (element.shadowRoot) {
      windows.push(...findOdooChatWindows(element.shadowRoot))
    }
  }

  return windows
}

function ensureWaitingStyles(root: ShadowRoot) {
  if (root.querySelector('#mb-livechat-waiting-styles')) return

  const style = document.createElement('style')
  style.id = 'mb-livechat-waiting-styles'
  style.textContent = `
    .o-mail-ChatWindow[data-mb-awaiting-operator='true'] .o-mail-ChatWindow-threadAvatar,
    .o-mail-ChatWindow[data-mb-awaiting-operator='true'] .o-mail-ChatWindow-header > .text-truncate,
    .o-mail-ChatWindow[data-mb-awaiting-operator='true'] .o-mail-Message-header,
    .o-mail-ChatWindow[data-mb-awaiting-operator='true'] .o-mail-Message-avatarContainer {
      visibility: hidden !important;
    }

    .o-mail-ChatWindow[data-mb-awaiting-operator='true'] .o-mail-ChatWindow-header {
      position: relative;
    }

    .o-mail-ChatWindow[data-mb-awaiting-operator='true'] .o-mail-ChatWindow-header::before {
      position: absolute;
      left: 3.25rem;
      overflow: hidden;
      max-width: 11rem;
      color: var(--muted-foreground, #667085);
      content: 'Waiting for a specialist...';
      font-size: 0.8rem;
      font-weight: 600;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `
  root.appendChild(style)
}

function applyOdooRootPointerPolicy() {
  const livechatRoots = Array.from(
    document.querySelectorAll<HTMLElement>('[id^="o-livechat-root"], [id*="livechat-root"], [data-livechat-root], .o-livechat-root'),
  )

  livechatRoots.forEach((node) => {
    const hasOpenChat = Boolean(findOdooChatWindow(node) || node.shadowRoot?.querySelector('.o-mail-ChatWindow'))
    node.style.pointerEvents = 'none'
    node.style.zIndex = hasOpenChat ? '90' : '0'
    node.style.visibility = hasOpenChat ? 'visible' : 'hidden'
    node.style.opacity = hasOpenChat ? '1' : '0'
    node.shadowRoot?.querySelectorAll<HTMLElement>('.o-mail-ChatWindow').forEach((element) => {
      element.style.pointerEvents = hasOpenChat ? 'auto' : 'none'
    })
  })
}

function applyOdooWidgetVisibility(visible: boolean) {
  const livechatRoots = Array.from(
    document.querySelectorAll<HTMLElement>('[id^="o-livechat-root"], [id*="livechat-root"], [data-livechat-root], .o-livechat-root'),
  )

  livechatRoots.forEach((node) => {
    const shouldShow = visible && Boolean(findOdooChatWindow(node) || node.shadowRoot?.querySelector('.o-mail-ChatWindow'))
    node.style.pointerEvents = 'none'
    node.style.zIndex = shouldShow ? '90' : '0'
    node.style.visibility = shouldShow ? 'visible' : 'hidden'
    node.style.opacity = shouldShow ? '1' : '0'

    if (node.shadowRoot) {
      node.shadowRoot.querySelectorAll<HTMLElement>('.o-mail-ChatWindow, .o-mail-ChatHub, .o-main-components-container').forEach((element) => {
        element.style.visibility = shouldShow ? 'visible' : 'hidden'
        element.style.opacity = shouldShow ? '1' : '0'
        element.style.pointerEvents = element.classList.contains('o-mail-ChatWindow') && shouldShow ? 'auto' : 'none'
      })
    }
  })
}

function triggerOdooLivechatWidget() {
  const odooWindow = window as typeof window & {
    __odooLiveChat?: { open?: () => void; toggle?: () => void; show?: () => void }
    odoo?: { livechat?: { open?: () => void; toggle?: () => void; show?: () => void } }
  }

  if (typeof odooWindow.__odooLiveChat?.open === 'function') {
    odooWindow.__odooLiveChat.open()
    return true
  }

  if (typeof odooWindow.__odooLiveChat?.toggle === 'function') {
    odooWindow.__odooLiveChat.toggle()
    return true
  }

  if (typeof odooWindow.__odooLiveChat?.show === 'function') {
    odooWindow.__odooLiveChat.show()
    return true
  }

  if (typeof odooWindow.odoo?.livechat?.open === 'function') {
    odooWindow.odoo.livechat.open()
    return true
  }

  if (typeof odooWindow.odoo?.livechat?.toggle === 'function') {
    odooWindow.odoo.livechat.toggle()
    return true
  }

  const livechatRoot = document.querySelector<HTMLElement>('[id^="o-livechat-root"], [id*="livechat-root"], [data-livechat-root]')
  if (livechatRoot) {
    livechatRoot.click?.()
    return true
  }

  const candidateButtons = Array.from(
    document.querySelectorAll<HTMLElement>(
      'button, [role="button"], a, div',
    ),
  ).filter((element) => {
    const text = (element.textContent ?? '').toLowerCase()
    const classes = (element.className ?? '').toString().toLowerCase()
    const label = (element.getAttribute('aria-label') ?? '').toLowerCase()
    return /livechat|chat support|chat with us|talk to us|support/.test(`${text} ${classes} ${label}`)
  })

  for (const candidate of candidateButtons) {
    candidate.style.removeProperty('display')
    candidate.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true, view: window }))
    return true
  }

  return false
}

async function openOdooChat() {
  const existingWidgetRoot = document.querySelector<HTMLElement>('.o-livechat-root, [id^="o-livechat-root"], [data-livechat-root]')
  const existingChatWindow = findOdooChatWindow()

  if (existingChatWindow) {
    const root = existingChatWindow.getRootNode()
    if (root instanceof ShadowRoot) {
      root.host.style.visibility = 'visible'
      root.host.style.opacity = '1'
      root.host.style.pointerEvents = 'none'
    }
    existingChatWindow.style.visibility = 'visible'
    existingChatWindow.style.opacity = '1'
    existingChatWindow.style.pointerEvents = 'auto'
    return true
  }

  if (existingWidgetRoot) {
    existingWidgetRoot.style.visibility = 'visible'
    existingWidgetRoot.style.opacity = '1'
    existingWidgetRoot.style.pointerEvents = 'auto'
    const chatBubbleButton = existingWidgetRoot.shadowRoot?.querySelector<HTMLElement>(
      '.o-mail-ChatBubble > button:not(.o-mail-ChatBubble-close), .o-mail-ChatBubble button.o-mail-ChatHub-bubbleBtn',
    )
    if (chatBubbleButton) {
      chatBubbleButton.click()
      for (let check = 0; check < 35; check += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 100))
        if (findOdooChatWindow()) return true
      }
      return false
    }

    const button = existingWidgetRoot.shadowRoot
      ? findOdooElement(LIVECHAT_BUTTON_SELECTOR, existingWidgetRoot.shadowRoot)
      : findOdooElement(LIVECHAT_BUTTON_SELECTOR, existingWidgetRoot)
    if (button) {
      const root = button.getRootNode()
      const host = root instanceof ShadowRoot ? root.host : null
      host?.style.removeProperty('display')
      host?.style.removeProperty('pointer-events')
      button.style.removeProperty('display')
      button.click()
      return true
    }
    existingWidgetRoot.click?.()
  }

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const button = findOdooElement(LIVECHAT_BUTTON_SELECTOR)
    if (button) {
      const root = button.getRootNode()
      const host = root instanceof ShadowRoot ? root.host : null
      host?.style.removeProperty('display')
      host?.style.removeProperty('pointer-events')
      button.style.removeProperty('display')
      button.click()

      for (let check = 0; check < 35; check += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 100))
        if (findOdooChatWindow()) {
          host?.style.removeProperty('pointer-events')
          return true
        }
      }

      return false
    }

    triggerOdooLivechatWidget()

    await new Promise((resolve) => window.setTimeout(resolve, 100))
  }

  return false
}

export function LiveChatGate() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const allowNextClick = useRef(false)
  const hasProfileRef = useRef(false)

  useEffect(() => {
    const handleNativeButtonClick = (event: MouseEvent) => {
      if (hasProfileRef.current || allowNextClick.current) {
        allowNextClick.current = false
        return
      }

      event.preventDefault()
      event.stopImmediatePropagation()
      setError('')
      setIsOpen(true)
    }

    const attachNativeButton = () => {
      const button = findOdooElement(LIVECHAT_BUTTON_SELECTOR)
      if (button && button.dataset.mbPrechatAttached !== 'true') {
        button.dataset.mbPrechatAttached = 'true'
        button.addEventListener('click', handleNativeButtonClick, true)
      }
      if (button) {
        button.style.display = 'none'
        const root = button.getRootNode()
        if (root instanceof ShadowRoot) {
          root.host.style.pointerEvents = findOdooChatWindow(root) ? 'auto' : 'none'
          root.host.style.zIndex = findOdooChatWindow(root) ? '90' : '0'
        }
      }

      applyOdooRootPointerPolicy()
    }

    const observer = new MutationObserver(attachNativeButton)
    observer.observe(document.body, { childList: true, subtree: true })
    const interval = window.setInterval(attachNativeButton, 500)
    attachNativeButton()

    return () => {
      observer.disconnect()
      window.clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const profileExists = Boolean(window.sessionStorage.getItem(PROFILE_STORAGE_KEY))
    hasProfileRef.current = profileExists
  }, [])

  useEffect(() => {
    applyOdooWidgetVisibility(!isOpen)
  }, [isOpen])

  useEffect(() => {
    const syncOperatorVisibility = () => {
      const chatWindows = findOdooChatWindows()

      chatWindows.forEach((chatWindow) => {
        const root = chatWindow.getRootNode()
        if (root instanceof ShadowRoot) ensureWaitingStyles(root)

        const messages = Array.from(chatWindow.querySelectorAll<HTMLElement>('.o-mail-Message'))
        const incomingMessages = messages.filter(
          (message) =>
            !message.classList.contains('o-selfAuthored') &&
            !(message.textContent ?? '').includes('How may I help you?'),
        )

        if (incomingMessages.length > 0) {
          chatWindow.dataset.mbOperatorBaseline ??= String(incomingMessages.length)
          chatWindow.dataset.mbAwaitingOperator = 'false'
          return
        }

        if (chatWindow.dataset.mbOperatorBaseline === undefined) {
          chatWindow.dataset.mbOperatorBaseline = String(incomingMessages.length)
          chatWindow.dataset.mbAwaitingOperator = 'true'
          return
        }

        const baseline = Number(chatWindow.dataset.mbOperatorBaseline)
        if (incomingMessages.length > baseline) {
          chatWindow.dataset.mbAwaitingOperator = 'false'
        }
      })
    }

    const observer = new MutationObserver(() => {
      syncOperatorVisibility()
      applyOdooRootPointerPolicy()
    })
    observer.observe(document.body, { childList: true, subtree: true })
    const interval = window.setInterval(() => {
      syncOperatorVisibility()
      applyOdooRootPointerPolicy()
    }, 250)
    syncOperatorVisibility()
    applyOdooRootPointerPolicy()
    return () => {
      observer.disconnect()
      window.clearInterval(interval)
    }
  }, [])

  async function submitPreChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/odoo/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          service: 'Live Chat',
          message: 'Live Chat visitor requested a conversation.',
          source: 'website_livechat_prechat',
        }),
      })

      if (!response.ok) {
        throw new Error('We could not start the chat right now. Please try again.')
      }

      const odooWindow = window as typeof window & {
        __odooLiveChat?: {
          default_username?: string
          options?: { default_username?: string }
        }
        odoo?: {
          __session_info__?: {
            livechatData?: {
              options?: { default_username?: string }
            }
          }
        }
      }
      const livechatOptions = odooWindow.odoo?.__session_info__?.livechatData?.options
      if (livechatOptions) {
        livechatOptions.default_username = form.name
      }

      if (odooWindow.__odooLiveChat && typeof odooWindow.__odooLiveChat === 'object') {
        odooWindow.__odooLiveChat.default_username = form.name
        if (odooWindow.__odooLiveChat.options) {
          odooWindow.__odooLiveChat.options.default_username = form.name
        }
      }

      await syncOdooGuestProfile()
      window.sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(form))
      hasProfileRef.current = true
      allowNextClick.current = true
      const chatOpened = await openOdooChat()

      if (!chatOpened) {
        allowNextClick.current = false
        throw new Error('Odoo Live Chat is not ready. Make sure the Support channel is active, then try again.')
      }

      setIsOpen(false)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function syncOdooGuestProfile() {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const response = await fetch('/api/odoo/livechat/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        const result = (await response.json()) as { guestToken?: string }
        if (result.guestToken) {
          window.localStorage.setItem(
            'EXPIRABLE_STORAGE_im_livechat_guest_token',
            JSON.stringify({ value: result.guestToken, expires: null }),
          )
        }
        const odooWindow = window as typeof window & {
          __mbLivechatProfileName?: string
          odoo?: {
            __session_info__?: {
              websocket_worker_version?: string
              livechatData?: {
                can_load_livechat?: boolean
                serverUrl?: string
                options?: {
                  channel_id?: number
                  default_username?: string
                  header_background_color?: string
                  button_background_color?: string
                  title_color?: string
                  button_text_color?: string
                  button_text?: string
                  default_message?: string
                  channel_name?: string
                  review_link?: boolean
                }
              }
            }
          }
        }
        odooWindow.__mbLivechatProfileName = form.name
        const loaderUrl = process.env.NEXT_PUBLIC_ODOO_LIVECHAT_LOADER
        const loaderUrlValue = loaderUrl ? new URL(loaderUrl) : null
        const channelId = Number(loaderUrlValue?.pathname.match(/\/loader\/(\d+)/)?.[1] ?? 0)
        odooWindow.odoo ??= {}
        if (loaderUrlValue && channelId && !odooWindow.odoo.__session_info__?.livechatData) {
          odooWindow.odoo.__session_info__ = {
            websocket_worker_version: '19.0-2',
            livechatData: {
              can_load_livechat: true,
              serverUrl: loaderUrlValue.origin,
              options: {
                channel_id: channelId,
                default_username: form.name,
                header_background_color: '#875A7B',
                button_background_color: '#875A7B',
                title_color: '#FFFFFF',
                button_text_color: '#FFFFFF',
                button_text: 'Need help? Chat with us.',
                default_message: 'How may I help you?',
                channel_name: 'Support',
                review_link: false,
              },
            },
          }
        }
        window.dispatchEvent(new Event('master-build-livechat-start'))
        return
      }
      await new Promise((resolve) => window.setTimeout(resolve, 250))
    }

    throw new Error('We could not connect your details to Odoo. Please try again.')
  }

  function handleLiveChatButtonClick() {
    if (hasProfileRef.current || window.sessionStorage.getItem(PROFILE_STORAGE_KEY)) {
      void openOdooChat()
      return
    }

    setIsOpen(true)
  }

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={handleLiveChatButtonClick}
          aria-label="Open live chat"
          className="fixed bottom-5 right-5 z-[90] flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105"
        >
          <MessageCircle className="size-6" />
        </button>
      )}
      <div
        className={isOpen ? 'fixed inset-0 z-[100] flex items-end justify-center bg-ink/35 p-4 sm:items-center' : 'hidden'}
        role="dialog"
        aria-modal="true"
        aria-labelledby="livechat-prechat-title"
      >
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="label-eyebrow">Live chat</p>
            <h2 id="livechat-prechat-title" className="mt-3 text-2xl font-medium tracking-tight text-foreground">
              Before we connect you
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Share your details first. We&apos;ll send them to our team, then connect you to the next available specialist.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close live chat form"
            onClick={() => setIsOpen(false)}
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={submitPreChat} className="mt-7 space-y-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Full name *</span>
            <input
              required
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="input-mb"
              placeholder="Your name"
              autoComplete="name"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Email *</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              className="input-mb"
              placeholder="you@company.com"
              autoComplete="email"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Phone *</span>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(event) => setForm({ ...form, phone: event.target.value })}
              className="input-mb"
              placeholder="+20 ..."
              autoComplete="tel"
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Connecting...' : 'Start chat'}
          </button>
        </form>
      </div>
      </div>
    </>
  )
}
