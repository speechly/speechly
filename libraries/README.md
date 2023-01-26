## Developing a library against an example project

This arrangement enables rapid development of libraries while testing them against a working app.

####  Example: Developing `react-ui` library against `react-ui-example` project using Rush

Please see basic [Rush](https://rush.js) documentation if you are not familiar with it. The repository README contains the basic installation instructions.

In terminal 1, run this command to build dependencies for up until the test application, e.g. `react-ui-example` and stay in watch mode to rebuild any changes to dependencies:

```
# Build dependency and stay in watch mode
rush build:watch --to-except react-ui-example
```

In terminal 2, run the app using the development server in watch mode

```
cd examples/react-ui-example
rushx start
```
