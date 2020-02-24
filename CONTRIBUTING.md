# Contributing

### Bugs and improvements

Please submit an issue if you have found a bug or would like to propose an improvement. When submitting a bug, please provide the environment and steps to reproduce it. If you are proposing an improvement, please provide some reasoning behind it, ideally with a few use-cases.

### Pull requests

We are happy to accept your PRs! When submitting, however, please make sure that you do the following:

- Ensure that your code is properly linted and tested. Don't forget to add tests and update existing ones, as necessary.
- Make sure to update the API report and documentation.

The easiest way to do that is to run the NPM / Yarn script in `package.json`:

```shell
# Using Yarn
yarn run precommit

# Using NPM
npm run precommit
```

### Test setup

You can use the demo example in the `./examples` directory as your test setup. You will need a Speechly app ID to go with it.

You can set it up by overriding the dependency to point to the `./dist` directory of the client:

```shell
# Clone the repo
git clone git@github.com:speechly/browser-client.git speechly-browser-client && cd speechly-browser-client

# Install dependencies
yarn install

# Build the dist & watch the files for changes
yarn watch

# Setup the demo for testing.
# Execute in a different terminal, since yarn watch blocks.
cd examples

# This will tell NPM to use browser-client from the dist directory.
# It also means that when you update the code of browser-client, the dependency code is updated automatically,
# so you don't need to restart the demo app.
npm install --save ../dist

# Start the demo app.
yarn start
```

Once you complete the above steps, you should now be able to make changes to the code and test them using the demo app.
