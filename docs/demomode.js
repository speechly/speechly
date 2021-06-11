const tokenizeSal = (s) => {
    if (s[0] !== "*") throw new Error("Expecting '*' to mark intent at start of SAL string")

    let i = s.indexOf(" ")
    if (i === -1) throw new Error("Expecting at least one word in addition to intent")
    let intent = s.substring(1, i)

    i++
    let tokens = []
    let stack = []
    let isAlpha = false
    let wordStart = undefined
    let char = undefined

    while (i <= s.length) {
        isAlpha = false
        char = s[i]
        
        switch (char) {
            case undefined:
            case " ":
                break;
            case "(":
                stack.push({ch: "(", index: i})
                break;
            case "[":
                stack.push({ch: "[", index: i})
                break;
            case "]":
                if (stack.length > 0 && stack[stack.length-1].ch === "[") {
                    tokens.push({
                        word: s.substring(stack[stack.length-1].index+1, i).trim()
                    })
                }
                stack.pop()
                break;
            case ")":
                if (stack.length > 0 && tokens.length > 0 && stack[stack.length-1].ch === "(") {
                    tokens[tokens.length-1].type = s.substring(stack[stack.length-1].index+1, i).trim()
                }
                stack.pop()
                break;
            default:
                isAlpha = true
                break;
        }

        if (stack.length === 0 && wordStart === undefined && isAlpha) {
            wordStart = i
        }
        
        if (wordStart !== undefined && !isAlpha) {
            tokens.push({
                word: s.substring(wordStart, i).trim()
            })
            wordStart = undefined
        }
        i++
    }

    return {intent, tokens}
}

const generateSegment = (tokenizedSal, lastToken = undefined) => {
    const id = 0
    const contextId = "e310e11e-95d4-4f22-98dd-388a1bd84718"

    if (lastToken === undefined) lastToken = tokenizedSal.tokens.length

    let words = []
    let entities = []

    tokenizedSal.tokens.slice(0, lastToken).forEach((token, index) => {
        words.push({
            "value": token.word,
            "index": index,
            "isFinal": true
        })
        if (token.type) {
            entities.push({
                "type": token.type,
                "value": token.word,
                "startPosition": index,
                "endPosition": index+1,
                "isFinal": true
            })
        }
    })

    return {
        "id": id,
        "contextId": contextId,
        "isFinal": true,
        "intent": {
            "intent": tokenizedSal.intent,
            "isFinal": true
        },
        "words": words,
        "entities": entities
    }
}

const startDemo = (demoStrings) => {
    const tokenizedSal = tokenizeSal(demoStrings[0])

    let timeout = undefined
    let playhead = 0

    const animateTranscript = () => {
        playhead++;
        if (playhead < tokenizedSal.tokens.length) {
            let mockSegment = generateSegment(tokenizedSal, playhead)
            mockSegment.isFinal = false
            window.postMessage({type: "speechsegment", segment: mockSegment}, "*");
            timeout = window.setTimeout(animateTranscript, tokenizedSal.tokens[playhead-1].word.length * 50)
        } else {
            let mockSegment = generateSegment(tokenizedSal, playhead)
            mockSegment.isFinal = true
            window.postMessage({type: "speechsegment", segment: mockSegment}, "*");
        }
    }

    animateTranscript();
}

/*
console.log(tokenizeSal("*book book a flight from london(from) to [new york](to)"))
console.log(tokenizeSal("*show show me blue(color) jeans (category)"))
console.log(tokenizeSal("*cry cry"))
*/
// console.log(generateSegment(tokenizeSal("*book book a flight from london(from) to [new york](to)")))
