# Smart Home Demo

Voice-enabled web app for controlling home smart devices.

You can say...

"Turn off lights"
"Turn off television in the living room"
"Switch on lights in the bedroom and in the kitchen"
"On the terrace..."
"...turn on lights"
"Turn off living room lights..."
"...and the radio"

## Available Scripts

In the project directory, you can run:

### `pnpm install`

Install project dependencies.

### `pnpm run dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `pnpm start`

Serve the built app from `build` folder. Used by Heroku.

## Publishing to Heroku

### Requirements

- Heroku CLI app from https://devcenter.heroku.com/articles/heroku-command-line

```
heroku login
git remote add heroku https://git.heroku.com/home-automation-app-demo.git
git push heroku main
```

- Edit .env variables in Heroku Dashboard
