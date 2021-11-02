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
