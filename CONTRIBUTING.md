# Contribution guide

## Bugs and improvements

Please submit an issue if you have found a bug or would like to propose an improvement. When submitting a bug, please provide the environment and steps to reproduce it. If you are proposing an improvement, please provide some reasoning behind it, ideally with a few use-cases.

Please do make use of the issue templates. If you think that a template is lacking for your case, feel free to suggeest a new one.

## Pull requests

We are happy to accept your PRs! When submitting, however, please make sure that you do the following:

- Ensure that your code is properly linted and tested. Don't forget to add tests and update existing ones, as necessary.
- Make sure to update the API report and documentation.

The easiest way to do that is to run the Yarn script in `package.json`:

```shell
yarn run precommit
```

## Test setup

You can use the [Speechly Browser Client Example](https://github.com/speechly/speechly/tree/main/examples/browser-client-example) as your test setup. You will need a Speechly App ID to go with it.

You can set it up by using `yarn link`:

```shell
# Clone the repo
git clone git@github.com:speechly/browser-client.git speechly-browser-client && cd speechly-browser-client

# Install dependencies
yarn install

# Create a symlink for the package
yarn link

# Build the dist & watch the files for changes
yarn watch

# Switch to a different terminal, since yarn watch blocks.

# Setup the example for testing.
cd ../
git clone git@github.com:speechly/browser-client-example.git speechly-browser-client-example && cd speechly-browser-client-example

# This will tell NPM to use browser-client from the dist directory.
# It also means that when you update the code of browser-client, the dependency code is updated automatically,
# so you don't need to restart the demo app.
yarn link @speechly/browser-client

# Start the demo app.
yarn start
```

Once you complete the above steps, you should now be able to make changes to the code and test them using the demo app.

Don't forget to unlink the package after you've done your changes, otherwise your example will be stuck using the linked version:

```shell
# Make sure you're in the right directory
cd speechly-browser-client-example

# Unlink browser-client
yarn unlink @speechly/browser-client

# Reinstall browser-client
yarn install --force
```
