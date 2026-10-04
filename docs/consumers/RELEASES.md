# Releases

Package versions, changelog notes, and migration rules live in the files
below. This page points at them. The release steps themselves stay in
[RELEASE.md](../../RELEASE.md).

| Topic                                                           | Document                                           |
| --------------------------------------------------------------- | -------------------------------------------------- |
| What changed                                                    | [CHANGELOG.md](../../CHANGELOG.md)                 |
| How a release is cut                                            | [RELEASE.md](../../RELEASE.md)                     |
| Tarball install and version pairing                             | [DISTRIBUTION.md](../DISTRIBUTION.md)              |
| `experimental`, `preview`, `stable`, `deprecated`               | [MATURITY.md](../governance/MATURITY.md)           |
| Breaking changes, deprecation window, `Ui` / `lib-ui` migration | [COMPATIBILITY.md](../governance/COMPATIBILITY.md) |
| What a component change must satisfy                            | [ACCEPTANCE.md](../governance/ACCEPTANCE.md)       |

On October 4, 2026 the UI and token distribution packages are `0.1.0`, the
repository version is pre-1.0, and the first git tag has not been cut.
Consumers install tarballs built from a checkout. They do not install from an
npm registry.

`Ui` (`lib-ui`) is deprecated and still exported. New templates use the
primitives in [Components](./COMPONENTS.md). Removal has no assigned version
until the changelog starts the window in the compatibility doc.

Support level for each public export is the maturity inventory. Preview
exports are usable, with the limitations recorded there and in the component
guide. Server rendering is not a contract. Localization scope is
[the localization contract](../localization/CONTRACT.md).
