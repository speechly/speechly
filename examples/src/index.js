import { Client, ClientState, stateToString } from '@speechly/browser-client'

window.onload = () => {
  const appId = process.env.REACT_APP_APP_ID
  if (appId === undefined) {
    document.getElementById('status').innerHTML = 'Cannot connect to Speechly API without app ID!'
    return
  }

  const language = process.env.REACT_APP_LANGUAGE
  if (language === undefined) {
    document.getElementById('status').innerHTML = 'Cannot connect to Speechly API without language specified!'
    return
  }

  // Configure Speechly client.
  const client = new Client({
    appId,
    language
  })

  // High-level API, that you can use to react to segment changes.
  client.onSegmentChange(segment => {
    updateWords(segment.words)
    updateEntities(segment.entities)

    if (segment.isFinalized) {
      updateReady(segment.contextId, true)
    }
  })

  // This is low-level API, that you can use to react to tentative events.
  client.onTentativeIntent((cid, sid, intent) => log('tentative_intent', cid, sid, { intent }))
  client.onTentativeEntities((cid, sid, entities) => log('tentative_entities', cid, sid, { entities }))
  client.onTentativeTranscript((cid, sid, words, transcript) =>
    log('tentative_transcript', cid, sid, { words, transcript })
  )

  // This is low-level API, that you can use to react to final events.
  client.onIntent((cid, sid, intent) => log('intent', cid, sid, { intent }))
  client.onEntity((cid, sid, entity) => log('entity', cid, sid, { entity }))
  client.onTranscript((cid, sid, word) => log('transcript', cid, sid, { word }))

  // Initialize the client.
  client.initialize(err => {
    if (err) {
      console.error('Error initializing Speechly client:', err)
    }
  })

  // Use the "Record" button for recording.
  const recordDiv = document.getElementById('record')
  recordDiv.addEventListener('mousedown', startRecording)
  recordDiv.addEventListener('mouseup', stopRecording)

  // Use disconnect button to disconnect.
  const dcDiv = document.getElementById('disconnect')
  dcDiv.addEventListener('click', () => client.close())

  // Update client status on the page.
  client.onStateChange(state => {
    if (state < ClientState.Connected) {
      recordDiv.setAttribute('disabled', true)
      dcDiv.setAttribute('disabled', true)
    } else {
      recordDiv.removeAttribute('disabled')
      dcDiv.removeAttribute('disabled')
    }

    document.getElementById('status').innerHTML = stateToString(state)
  })

  function startRecording(event) {
    event.preventDefault()

    client.startContext((err, contextId) => {
      if (err) {
        console.error('Could not start recording', err)
        return
      }

      reset(contextId)
    })
  }

  function stopRecording(event) {
    event.preventDefault()

    client.stopContext(err => {
      if (err) {
        console.error('Could not stop recording', err)
        return
      }
    })
  }

  function updateWords(words) {
    const textDiv = document.getElementById('transcript-words')
    textDiv.innerHTML = words.map(word => (word.isFinal ? `<b>${word.value}</b>` : word.value)).join(' ')

    const wordsDiv = document.getElementById('transcript-list')
    wordsDiv.innerHTML = words
      .map(word => (word.isFinal ? `<li><b>${word.value}</b></li>` : `<li>${word.value}</li>`))
      .join('')
  }

  function updateEntities(entities) {
    const entitiesDiv = document.getElementById('entities-list')
    entitiesDiv.innerHTML = entities
      .map(entity => {
        const t = `${entity.type} - ${entity.value} [${entity.startPosition} - ${entity.endPosition}]`
        if (entity.isFinal) {
          return `<li><b>${t}</b></li>`
        }
        return `<li>${t}</li>`
      })
      .join('')
  }

  function updateReady(contextId, isReady) {
    const readyDiv = document.getElementById('final')

    if (isReady) {
      readyDiv.innerHTML = `<b>Context</b> ${contextId} Done!`
    } else {
      readyDiv.innerHTML = `<b>Context</b> ${contextId}`
    }
  }

  function log(type, contextId, segmentId, data) {
    const logDiv = document.getElementById('log-list')
    logDiv.innerHTML =
      `<tr>
          <td>${contextId}</td>
          <td>${segmentId}</td>
          <td>${type}</td>
          <td>${JSON.stringify(data)}</td>
        </tr>` + logDiv.innerHTML
  }

  function reset(contextId) {
    updateReady(contextId, false)

    document.getElementById('transcript-words').innerHTML = ''
    document.getElementById('transcript-list').innerHTML = ''
    document.getElementById('log-list').innerHTML = ''
    document.getElementById('entities-list').innerHTML = ''
  }
}
