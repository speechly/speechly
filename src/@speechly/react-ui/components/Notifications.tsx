import React, { useEffect, useState } from 'react'
import { SpeechState, useSpeechContext } from '@speechly/react-client'
import styled from 'styled-components'
import { Info } from './Info'
import { SpeechlyUiEvents } from '../types'

export enum NotificationType {
  info = 'info',
  warning = 'warning',
}

export type NotificationItem = {
  type: NotificationType
  notificationId: string
  message: string
  footnote?: string
  visible: boolean
}

let NotificationId: number = 0

export const Notifications: React.FC = props => {
  const { speechState } = useSpeechContext()
  const [notification, setNotification] = useState<NotificationItem | null>(null)

  /*
    {
      type: NotificationType.info,
      message: "Could not find 'Good vibes pants'",
      footnote: "Try: 'Sneakers'",
      visible: true,
    }
    {
      type: NotificationType.warning,
      message: "Bad audio. Please say again.",
      visible: true,
    },
    {
      type: NotificationType.warning,
      message: "Sorry, all we hear is silence.",
      visible: true,
    },
    {
      type: NotificationType.info,
      message: "Please say again",
      footnote: 'Try: "Sneakers"',
      visible: true,
    }
  */

  useEffect(() => {
    const subDismiss = PubSub.subscribe(
      SpeechlyUiEvents.DismissNotification,
      (message: string, payload: { state: SpeechState }) => {
        hideHints()
      },
    )
    const subNotification = PubSub.subscribe(
      SpeechlyUiEvents.Notification,
      (message: string, payload: { message: string, footnote?: string }) => {
        setNotification({
          type: NotificationType.info,
          notificationId: `msg-${NotificationId++}`,
          message: payload.message,
          footnote: payload.footnote,
          visible: true,
        })
      },
    )
    const subWarningNotification = PubSub.subscribe(
      SpeechlyUiEvents.WarningNotification,
      (message: string, payload: { message: string, footnote?: string }) => {
        setNotification({
          type: NotificationType.warning,
          notificationId: `msg-${NotificationId++}`,
          message: payload.message,
          footnote: payload.footnote,
          visible: true,
        })
      },
    )
    return () => {
      PubSub.unsubscribe(subNotification)
      PubSub.unsubscribe(subWarningNotification)
      PubSub.unsubscribe(subDismiss)
    }
  }, [])

  useEffect(() => {
    switch (speechState) {
      case SpeechState.Recording: {
        hideHints()
      }
    }
  }, [speechState])

  const hideHints = (): void => {
    setNotification(prev => (prev !== null ? { ...prev, visible: false } : null))
  }

  return (
    <>
      {notification?.type === NotificationType.info && (
        <Info visible={notification?.visible || false} color="#fff" backgroundcolor="#46c">
          <InfoIcon color="#fff" />
          <div>
            {notification?.message}
            {notification?.footnote !== null && (
              <>
                <br />
                <small>{notification.footnote}</small>
              </>
            )}
          </div>
        </Info>
      )}
      {notification?.type === NotificationType.warning && (
        <Info visible={notification?.visible || false} color="#000" backgroundcolor="#fc0">
          <WarningIcon color="#000" />
          <div>
            {notification?.message}
            {notification?.footnote !== null && (
              <>
                <br />
                <small>{notification?.footnote}</small>
              </>
            )}
          </div>
        </Info>
      )}
    </>
  )
}

const InfoIcon: React.FC<{ color: string }> = props => {
  return (
    <IconSvg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g fill={props.color} fillRule="evenodd">
        <path d="M12 1.5c5.799 0 10.5 4.701 10.5 10.5S17.799 22.5 12 22.5 1.5 17.799 1.5 12 6.201 1.5 12 1.5zM12 3a9 9 0 100 18 9 9 0 000-18z" />
        <path fillRule="nonzero" d="M13 10v8h-2v-6.5h-1V10z" />
        <circle cx="11.75" cy="7.5" r="1.5" />
      </g>
    </IconSvg>
  )
}

const WarningIcon: React.FC<{ color: string }> = props => {
  return (
    <IconSvg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.738.743a1.5 1.5 0 01.568.567l10.429 18.452A1.5 1.5 0 0122.429 22H1.571a1.5 1.5 0 01-1.306-2.238L10.695 1.31a1.5 1.5 0 012.043-.567zM8.5 13H7v1a5.001 5.001 0 004.25 4.944V21h1.5v-2.056A5.001 5.001 0 0017 14v-1h-1.5v1l-.005.192A3.5 3.5 0 0112 17.5l-.192-.005A3.5 3.5 0 018.5 14v-1zM12 6a2 2 0 00-2 2v6a2 2 0 104 0V8a2 2 0 00-2-2z"
        fill={props.color}
        fillRule="evenodd"
      />
    </IconSvg>
  )
}

const IconSvg = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  margin-right: 0.5rem;
  margin-bottom: auto;
`
