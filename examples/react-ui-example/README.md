# React UI Example

This project demonstrates the use of core Speechy UI Components

- [Docs for UI Components](https://docs.speechly.com/client-libraries/ui-components/)

## React UI Example as a test project

This example can be used as a test project for the `react-ui` components. This arrangement enables rapid development of Speechly React UI components to be developed in real, working CRA app environment.

### Developing react-ui library against this example project

We are using using [rush](https://rush.js) and [pnpm](https://pnpm.io) so first please check the instructions in the [root level README](../../README.md#how-to-use-this-repository)

In terminal 1, run this command to build library dependencies for `react-ui-example` and stay in watch mode to rebuild any changes to dependencies:

```
# Build dependency and stay in watch mode
rush build:watch --to-except react-ui-example
```

In terminal 2, run the app using the development server in watch mode
```
cd examples/react-ui-example
rushx start
```
