build:
	./gradlew clean
	./gradlew assemble -Pversion=${SG_VERSION}
	mkdir -p ../DecoderTest/libs
	cp SpeechlyDecoder/build/outputs/aar/SpeechlyDecoder-release.aar ../DecoderTest/libs/SpeechlyDecoder.aar

.PHONY: build
