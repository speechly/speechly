import React, { useEffect } from 'react'
import { useSpeechContext } from '@speechly/react-client'
import { useSpring, animated } from 'react-spring'
import styled from 'styled-components'

/**
 * A React component that renders the transcript and entities received from Speechly SLU API.
 *
 * The component is intended to be used for providing visual feedback to the speaker.
 *
 * @public
 */
export const BigTranscript: React.FC = props => {
  const { segment } = useSpeechContext()
  const [springProps, setSpringProps] = useSpring(() => ({
    effectOpacity: 1,
  }))

  useEffect(() => {
    if (segment?.isFinal === true) {
      setSpringProps({
        effectOpacity: 0,
        delay: 2000,
        config: { tension: 200 },
      })
    } else {
      setSpringProps({
        effectOpacity: 1,
        config: { tension: 500 },
      })
    }
  }, [segment, setSpringProps])

  if (segment === undefined) {
    return <BigTranscriptDiv className="BigTranscript" />
  }

  // Assign words to a new list with original index (segments.words array indices may not correlate with entity.startIndex)
  let words: ITaggedWord[] = []
  segment.words.forEach(w => {
    words[w.index] = { word: w.value, serialNumber: w.index, entityType: null, isFinal: w.isFinal }
  })

  // Tag words with entities
  segment.entities.forEach(e => {
    words.slice(e.startPosition, e.endPosition).forEach(w => {
      w.entityType = e.type
      w.isFinal = e.isFinal
    })
  })

  // Remove holes from word array
  words = words.flat()

  // Combine words of same type into HTML element snippets
  return (
    <BigTranscriptDiv
      className="BigTranscript"
      style={{ opacity: springProps.effectOpacity.interpolate(x => x as number) }}
    >
      {words.map<React.ReactNode>((w, index) => {
        const key = `${segment.contextId}/${segment.id}/${index}`
        return (
          <span key={key}>
            <TransscriptItem word={w}>{w.word}</TransscriptItem>{' '}
          </span>
        )
      })}
    </BigTranscriptDiv>
  )
}

const TransscriptItem: React.FC<{ word: ITaggedWord }> = props => {
  const [springProps] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { tension: 500 },
  }))

  const entityProps = useSpring({
    entityEffect: props.word.entityType !== null ? 1 : 0,
    config: { duration: 250 },
  })

  return (
    <TransscriptItemDiv className={`${props.word.entityType ? 'Entity' : ''} ${props.word.isFinal ? 'Final' : ''} ${props.word.entityType || ''}`}>
      <TransscriptItemBgDiv style={springProps} />
      <TransscriptItemContent
        style={{
          ...springProps,
          transform: entityProps.entityEffect.interpolate(
            x => `translate3d(0, ${Math.sin((x as number) * Math.PI) * -5}px, 0)`,
          ),
        }}
      >
        {props.children}
      </TransscriptItemContent>
    </TransscriptItemDiv>
  )
}

const BigTranscriptDiv = styled(animated.div)`
  white-space: 'pre';
`

const TransscriptItemDiv = styled(animated.div)`
  position: relative;
  white-space: pre;
  display: inline-block;
`

const TransscriptItemContent = styled(animated.div)`
  z-index: 1;
`

const TransscriptItemBgDiv = styled(animated.div)`
  position: absolute;
  box-sizing: content-box;
  width: 100%;
  height: 100%;
  margin: -0.5rem;
  padding: 0.5rem;
  background-color: #000;
  z-index: -1;
`

type ITaggedWord = {
  word: string
  serialNumber: number
  entityType: string | null
  isFinal: boolean
}
