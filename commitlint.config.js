module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [(message) => /^Bumps \[.+]\(.+\) (?:and \[.+]\(.+\)|from .+ to .+)\./m.test(message)],
}
