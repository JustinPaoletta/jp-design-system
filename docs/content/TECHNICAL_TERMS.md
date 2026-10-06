# Technical terms

This list defines JP terms for readers and documentation authors.
API identifiers, package names and interface labels keep their exact spelling.
These are project technical terms, not additions to the ASD-STE100 dictionary.

## Software nouns

| Term                 | Meaning in JP                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| API                  | The public inputs, outputs, types and functions available to an application.                                           |
| Application          | Software that uses the JP packages.                                                                                    |
| ARIA                 | Accessible Rich Internet Applications. HTML attributes that describe interface roles, names, relationships and states. |
| Assistive technology | Software or equipment that helps a person use an interface, such as a screen reader.                                   |
| Caption              | Visible text that names a table or describes a figure.                                                                 |
| CI                   | Continuous integration. GitHub Actions runs repository checks after a change.                                          |
| Component            | An Angular class that controls an interface element.                                                                   |
| Contract             | The documented behavior that JP agrees to support.                                                                     |
| Consumer             | An application or developer that uses the JP packages.                                                                 |
| CSS                  | Cascading Style Sheets. Rules that control the page's appearance and layout.                                           |
| CVA                  | Angular ControlValueAccessor. It connects a component value to an Angular form.                                        |
| Density              | The token mode that sets spacing and control sizes.                                                                    |
| Dataset              | A collection of application data, such as table rows.                                                                  |
| Directive            | An Angular class that adds behavior to a host element.                                                                 |
| DOM                  | Document Object Model. The browser's element tree for the page.                                                        |
| Dry-run              | An operation that shows proposed changes without writing them.                                                         |
| Focus                | The element that receives keyboard input.                                                                              |
| Forced colors        | A browser mode that uses a user's system color palette.                                                                |
| Hydration            | Angular's connection of browser behavior to existing server-rendered HTML.                                             |
| Inert                | An HTML state that removes a region from interaction and accessibility navigation.                                     |
| Input                | A value that an application supplies to a component.                                                                   |
| Instance             | One use of a component or service, with its own state.                                                                 |
| Locale               | A language and region setting used for text and data formats.                                                          |
| Maturity             | An API's support level: experimental, preview, stable or deprecated.                                                   |
| Model                | An Angular value with an input and a corresponding change output.                                                      |
| Native control       | An HTML control whose basic behavior comes from the browser.                                                           |
| Output               | An Angular event that a component sends to the application.                                                            |
| Overlay              | A dialog, menu or other panel shown above the current page.                                                            |
| Peer dependency      | A package version range that the application must supply.                                                              |
| Projection           | Application content placed in a component's template slot.                                                             |
| Reflow               | A layout change that lets content fit the available width.                                                             |
| Screen reader        | Assistive technology that presents interface information through speech or braille.                                    |
| Schema               | The definition of data fields or table columns.                                                                        |
| Semantic token       | A CSS variable named for a purpose, such as a field background.                                                        |
| SSR                  | Server-side rendering. A server creates the initial page HTML.                                                         |
| State                | The current values that determine interface behavior, such as open, selected or loading.                               |
| Tarball              | A `.tgz` archive used to install a built npm package.                                                                  |
| Top layer            | A browser layer that displays native dialogs and popovers above ordinary page content.                                 |
| Toolbar              | A named group of controls for a related task.                                                                          |
| Tree shaking         | A production build process that removes unused code.                                                                   |
| Virtualization       | The display of a limited row set while a user moves through a larger dataset.                                          |
| WCAG                 | Web Content Accessibility Guidelines. JP's automated target is WCAG 2.1 A/AA.                                          |

## Software verbs

These verbs describe specific computer operations.
They do not approve other meanings or parts of speech.

| Verb      | Meaning in JP                                                   |
| --------- | --------------------------------------------------------------- |
| Bind      | Connect a template value or event to application state.         |
| Build     | Compile source files into application or package output.        |
| Configure | Set software options.                                           |
| Emit      | Send an Angular output event.                                   |
| Import    | Make a public module export available to another source file.   |
| Inject    | Obtain a value from Angular dependency injection.               |
| Mount     | Add a component or data row to the DOM.                         |
| Project   | Place content in a component's projection slot.                 |
| Render    | Produce page elements or displayed content from software state. |
| Validate  | Compare data with the specified software rules.                 |

| Name | Set an element's accessible name for assistive technology. |
| Support | Supply documented software behavior under the stated compatibility conditions. |

Other computer verbs, such as install, load, save and scroll, follow the
standard's computer-process rules. Generic verbs keep their dictionary meanings.
Use "do a test" for a test procedure and "examine" for a document inspection.
