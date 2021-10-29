### Publish a new version of @speechly/react-voice-forms

```
cd library/react-voice-forms
rush build
rushx docs
# Bump version
code package.json
git add .
git commit -m"vX.Y.Z"
git push
npm publish
# Use authenticator for one-time passwords
```
