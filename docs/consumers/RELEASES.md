# Releases

Package versions, changelog notes, and migration rules live in the files
below. This page points at them. The release steps themselves stay in
[RELEASE.md](../../RELEASE.md).

| Topic                                                           | Document                                           |
| --------------------------------------------------------------- | -------------------------------------------------- |
| What changed                                                    | [CHANGELOG.md](../../CHANGELOG.md)                 |
| Release procedure                                               | [RELEASE.md](../../RELEASE.md)                     |
| Tarball install and version pairing                             | [DISTRIBUTION.md](../DISTRIBUTION.md)              |
| `experimental`, `preview`, `stable`, `deprecated`               | [MATURITY.md](../governance/MATURITY.md)           |
| Breaking changes, deprecation window, `Ui` / `lib-ui` migration | [COMPATIBILITY.md](../governance/COMPATIBILITY.md) |
| What a component change must satisfy                            | [ACCEPTANCE.md](../governance/ACCEPTANCE.md)       |

The [repository status](../../README.md#current-status) gives package versions and release status.
Consumers install tarballs built from a checkout.
Registry publication is not configured.

`Ui` (`lib-ui`) is deprecated and still exported. New templates use the
primitives in [Components](./COMPONENTS.md). Removal has no assigned version
until the changelog starts the window in the compatibility doc.

Support level for each public export is the maturity inventory. Preview
exports are usable, with the limitations recorded there and in the component
guide. Server rendering is not a contract. Localization scope is
[the localization contract](../localization/CONTRACT.md).
