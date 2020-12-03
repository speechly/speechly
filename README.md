# React UI Components Testbench App

This is a "host" Create React App project for the components in `components` project. This arrangement enables rapid development of Speechly React UI components to be developed in real, working CRA app environment.

When `../use-speechly-react-ui.sh` is run, Component project's  `src` are hard-linked the files in `src/speechly-react-ui` folder. Any changes to these files will be thus reflected to the "original" files. The folder can be safely removed, as the changes are preserved in the "originals".

Once stable, the Component project can be `npm pack`'ed for release.

## Available Scripts

In the project directory, you can run:

### `./initialize.sh`

Create hard links from component sources in `../components/src` to `src/linked-component-src`.

### `pnpm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.
