## [1.6.1](https://github.com/liquiddevelopmentnet/kaqi/compare/v1.6.0...v1.6.1) (2023-12-26)


### Bug Fixes

* added failsafe mechanism which tries to correct wrong usage of url building ([f728ab6](https://github.com/liquiddevelopmentnet/kaqi/commit/f728ab6222147ad4572db5983cc2cc45f33c27fb))
* also remove trailing slashes on service suffix and endpoint urls ([373f1bc](https://github.com/liquiddevelopmentnet/kaqi/commit/373f1bc2ba82ecbea18f4c317a2dd85d2d871625))
* fixed cache, querying the server even if valid cache is present ([3975b16](https://github.com/liquiddevelopmentnet/kaqi/commit/3975b166c4b3d14e95a2e06e82c3225b18eb0328))

# [1.6.0](https://github.com/liquiddevelopmentnet/kaqi/compare/v1.5.1...v1.6.0) (2023-12-24)


### Features

* added `@CacheFor` decorator to cache results for a certain amount of time ([51e403c](https://github.com/liquiddevelopmentnet/kaqi/commit/51e403c1cad22c504c1d49d0de48a86434f5920b))
* added `@Query` path decorators for url query data ([23030ca](https://github.com/liquiddevelopmentnet/kaqi/commit/23030caf52a179ae19a02ba0d08fcda6686e2107))

## [1.5.1](https://github.com/liquiddevelopmentnet/kaqi/compare/v1.5.0...v1.5.1) (2023-12-16)


### Bug Fixes

* fixed and improved url resolving ([d3f266e](https://github.com/liquiddevelopmentnet/kaqi/commit/d3f266e57f2fe4875981b4bb413c3d61b0440249))

# [1.5.0](https://github.com/liquiddevelopmentnet/kaqi/compare/v1.4.3...v1.5.0) (2023-12-15)


### Features

* added path parameter annotations, improved coding style, added JSDoc ([1279676](https://github.com/liquiddevelopmentnet/kaqi/commit/12796763822c49af32d76a759bd3e1c5857be772))

## [1.4.3](https://github.com/liquiddevelopmentnet/kaqi/compare/v1.4.2...v1.4.3) (2023-12-09)


### Bug Fixes

* proper file management for releases ([fede424](https://github.com/liquiddevelopmentnet/kaqi/commit/fede4242c92b84e564898e209f3f8bb0ce180051))

## [1.4.2](https://github.com/liquiddevelopmentnet/kaqi/compare/v1.4.1...v1.4.2) (2023-12-09)


### Bug Fixes

* added release branches ([8817d89](https://github.com/liquiddevelopmentnet/kaqi/commit/8817d8913dc422ee819a3f620874455dfeb2c51a))
* change files used in distribution ([0ca1370](https://github.com/liquiddevelopmentnet/kaqi/commit/0ca1370c4c65eb9bd3d7e6cc20915b0054c51fd1))
* correctly distibute to npmjs ([fc3fae0](https://github.com/liquiddevelopmentnet/kaqi/commit/fc3fae0b4eb6fdecac27956df8d7af7f1f56e032))
