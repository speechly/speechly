import audioBlank from "./assets/blank.mp3"
import audioDemo1 from "./assets/koth.mp3"
import audioDemo2 from "./assets/pewdiepie.mp3"
import audioDemo3 from "./assets/tiktok.mp3"
import audioDemo4 from "./assets/stepbrothers.mp3"
import coverDemo1 from "./assets/koth.jpg"
import coverDemo2 from "./assets/pewdiepie.jpg"
import coverDemo3 from "./assets/tiktok.jpg"
import coverDemo4 from "./assets/stepbrothers.jpg"

export const blankAudio: Plyr.SourceInfo = {
  type: "audio",
  sources: [{
    src: audioBlank,
    type: "audio/mpeg"
  }]
}

export const demoAudios: {
  audioSrc: Plyr.SourceInfo;
  title: string;
  duration: number;
  thumbnail: string;
}[] = [
    {
      audioSrc: {
        type: "audio",
        sources: [{
          src: audioDemo2,
          type: "audio/mpeg"
      }]
      },
      title: "PewDiePie Uses the N-word",
      duration: 12000,
      thumbnail: coverDemo2
    },
    {
      audioSrc: {
        type: "audio",
        sources: [{
          src: audioDemo1,
          type: "audio/mpeg"
      }]
      },
      title: "I'm Gonna Kick Your Ass",
      duration: 20000,
      thumbnail: coverDemo1
    },
    {
      audioSrc: {
        type: "audio",
        sources: [{
          src: audioDemo3,
          type: "audio/mpeg"
      }]
      },
      title: "Reaction to Assault on TikTok",
      duration: 31000,
      thumbnail: coverDemo3
    },
    {
      audioSrc: {
        type: "audio",
        sources: [{
          src: audioDemo4,
          type: "audio/mpeg"
      }]
      },
      title: "Catalina Wine Mixer",
      duration: 36000,
      thumbnail: coverDemo4
    }
  ]
