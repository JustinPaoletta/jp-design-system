# Writing

Recorded October 4, 2026.

JP copy is calm, specific, and short. Design principle 10 applies: structured and confident, approachable without being casual. Write to the person using the product as "you". Do not joke, scold, or add exclamation marks.

Say what happened and what to do next. Leave brand decoration out of the sentence.

## Voice

- Use the present tense for the current state and the simple past for a finished action: "Settings saved."
- Use the active voice: "Save failed." The product is not surprised.
- Prefer one idea per sentence. Two short sentences beat one clause with "and/or".
- Do not say "please" on buttons. Use it at most once in a longer explanation, and only when the person is being asked to wait or to correct something.
- Do not mention implementation details (context trigger, token, primitive, component) in product copy.

## Action labels

Buttons and links are sentence case, start with a verb, and have no trailing punctuation.

Name the object when the control is not sitting under a heading that already names it: "Save settings", "Refresh services", "Clear filters". Inside a dialog whose title names the action, the confirm button can be the verb alone: title "Delete deployment?", button "Delete".

Use these verbs consistently:

| Verb    | Use for                                 | Example              |
| ------- | --------------------------------------- | -------------------- |
| Close   | A dialog, panel, or navigation layer    | Close dialog         |
| Dismiss | Transient feedback only                 | Dismiss notification |
| Remove  | One filter or selection                 | Remove Healthy       |
| Clear   | A whole set                             | Clear filters        |
| Delete  | Destroying a record                     | Delete               |
| Stop    | Work that is still running              | Stop response        |
| Retry   | The same action again                   | Retry save           |
| Cancel  | Leaving a confirmation without doing it | Cancel               |

"OK", "Yes", "Submit", and "Confirm deletion" are not action labels. "Confirm deletion" describes the gesture. "Delete" describes the outcome.

The remove control on a chip includes the visible label in the accessible name: "Remove Healthy". Visible text stays the label; the button name carries "Remove" plus that label.

## Headings

Page and section titles use `jp-heading`. Sentence case. No trailing period. A confirmation title may be a question: "Delete deployment?"

Do not put a button label in the heading, and do not repeat the heading as the first sentence of the body.

## Terminology

Use the product's words:

- Service, deployment, settings, filter, assistant
- JP Assistant when naming the product; "assistant" in running text
- Filter for the thing a person removes; chip is the component name, not the label
- Region and support plan as the settings fields already use them

Do not invent synonyms in the same screen (preferences vs settings, facet vs filter, record vs service).

Help text names the control, not the pointing device. Write "Select Save settings." Do not write "Click here" or "Click the button below."

## Capitalization

Sentence case for headings, buttons, labels, menus, empty states, and alerts.

Keep the product name "JP Assistant" capitalized. Code, tokens, and component selectors stay as written in documentation, not in product UI.

Do not use all caps for emphasis. Do not title-case every word ("Data Display", "Feedback & Overlays").

## Inclusive language

Address the person as "you", or use "they" when speaking about someone else. Do not use "guys" or a gendered pronoun for an unknown person.

Do not use disability or mental-health words as criticism. Do not use master/slave, whitelist/blacklist, dummy, or sanity check. Say primary/replica, allow list/deny list, placeholder, and check.

Do not describe a person by an assumed body, culture, or family structure. Empty and error copy talks about the product state, not about the person being wrong.

## Translation-friendly sentences

Consumers translate product strings. JP defaults must be replaceable sentences, not fragments that only make sense in English word order.

- One string is one complete thought. Do not build a sentence by concatenating "Delete " + a name inside the library.
- Put the variable at the end of a sentence the consumer can reorder, or accept a single string the consumer has already translated.
- Avoid idioms, slang, and jokes.
- Do not split one sentence across a title and a button.
- Plurals belong to the consumer. A library default that hard-codes "of" or "page" cannot cover other languages. Prefer a label input when the string is visible.
- Do not embed a formatted date, time, or number inside a JP default. See below.

## Message patterns

### Error

State the failure, then the recovery. The title is the failure. The message is what to do. The action names the retry.

- Title: "Save failed"
- Message: "Check the notification email and try again."
- Action: "Retry save"

Do not write "Oops", "Something went wrong", or "Invalid input" with no field name. Name the field: "Enter a valid notification email."

Use the alert role for errors (`jp-inline-alert` already does this when the tone is `error`).

### Confirmation

The title asks the question and names the outcome: "Delete deployment?"

The body states the consequence in one sentence: "This removes the selected deployment record. This cannot be undone."

Actions are "Cancel" and the destructive verb ("Delete"). Cancel is the safe action and is not styled as the primary destructive action.

### Success

Past tense and specific. "Settings saved."

Do not add "successfully". Do not title it "Success!". Add a second sentence only when it tells the person something new, such as where to look next.

### Warning

Say what will happen if they continue. A warning is not a failure.

"Notifications for this region are delayed."

Do not use a warning for a blocked action. That is an error.

### Empty

Say what is empty and how to fill it or widen it.

"No matching services. Clear your search or choose a different query."

The title can be the first sentence and the description the recovery: title "No matching services", description "Clear your search or choose a different query."

Do not use "No data", "No items", or a description that explains the component ("Use outside tables…").

### Loading

Name the work. "Refreshing services", "Saving settings", "Generating response".

Do not use a bare "Loading" when the work has a name. Set `aria-busy` while the work is in progress (buttons and the assistant log already do this). Keep the visible label available to assistive technology; do not rely on a spinner alone.

## Dates, times, and numbers

The consumer owns locale and time zone. JP does not format dates, times, or time zones.

No UI component calls a date formatter. The only `toLocale*` use in the library is `toLocaleLowerCase()` in the combobox, and that is case folding for search matching, not presentation.

Format dates and times in the consumer with `Intl.DateTimeFormat`, and pass an explicit `timeZone`. Do not render a date by concatenating `Date` parts in a template. Relative phrases such as "just now" and "earlier" are consumer copy; they go stale unless the consumer refreshes them. Prefer an absolute date the consumer formats.

Format numbers the person reads (counts, percents, durations) in the consumer with `Intl.NumberFormat`. Do not assume `,` grouping or `.` decimals inside a JP component.

Pagination is the exception that still renders counts itself (`1–10 of 24`, `Page 1 of 3`). That is English copy with an en dash, not locale-aware number formatting. It is recorded in the audit. It is not a date formatter, and new components must not add one.

## Assistant wording

The assistant panel does not invent an answer. Uncertainty, if the model should admit it, is part of the message content the consumer writes. The panel only supplies chrome labels.

Defaults in `assistant-panel.ts` and the error fallback in `assistant-panel.html`:

| Situation                                  | Default today                                                      | Write this                                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- |
| Uncertainty (no default; consumer message) | none                                                               | "I don't have enough information to answer that. Name the service or ask a narrower question." |
| Failure                                    | `Response failed`                                                  | "The response failed. Try again."                                                              |
| Retry action                               | `Retry`                                                            | `Retry response`                                                                               |
| In progress                                | `Generating response`                                              | `Generating response`                                                                          |
| Stop action                                | `Stop response`                                                    | `Stop response`                                                                                |
| Cancelled                                  | `Response stopped`                                                 | `Response stopped.`                                                                            |
| Empty title                                | `Ask about this surface`                                           | `Ask about this page`                                                                          |
| Empty description                          | `Open the assistant from a context trigger, then send a question.` | `Select a section, then ask a question.`                                                       |
| Placeholder                                | `Ask a question…`                                                  | `Ask a question…`                                                                              |
| Clear context                              | `Clear context`                                                    | `Clear context`                                                                                |
| Close                                      | `Close assistant`                                                  | `Close assistant`                                                                              |
| Send                                       | `Send`                                                             | `Send`                                                                                         |

Uncertainty rules:

- Say what is missing and what the person can add.
- Do not claim a fact the model did not return.
- Do not write "As an AI" or "I think maybe".
- Do not hide a failure behind uncertainty. A transport or generation failure uses the failure pattern and `Retry response`.

Cancellation and retry:

- Stopping is successful cancellation, not an error. `Response stopped.` uses the status role, then offers `Retry response`.
- `Stop response` is the in-progress action. It matches the object used in `Generating response`.
- Retry starts the response again. The label names the object, the same way `Stop response` does.

`Clear context` clears the attached context. It is not `Remove` plus the context label. A removable filter chip uses `Remove` plus the label; assistant context is a clear action for one attached context. Keep those words distinct.

## Audit of current defaults

These strings were read from the library on October 4, 2026. This pass does not edit the components. Mismatches are for a later copy change.

### Pagination

Source: `pagination.html`, `pagination.ts`.

- Buttons are `First page`, `Previous`, `Next`, `Last page`. `Previous` and `Next` drop the object that `First page` and `Last page` include. Use `Previous page` and `Next page`, or accept a single label input per control.
- The summary defaults are `{start}–{end} of {total}` and `Page {page} of {pageCount}`. The words and the en dash are English, and the numbers are not passed through `Intl.NumberFormat`. A consumer replaces the whole sentence through `JP_MESSAGES.pagination`.
- The nav name `Table pagination` is a clear default and can stay as the English fallback.

### Dialog

Source: `dialog.ts` (`closeLabel` default `Close dialog`).

- `Close dialog` matches the Close pattern.
- The component has no default title or body, which is correct.
- Showcase examples disagree with each other. Product recipes uses `Confirm deletion`. Overlays uses `Delete` under `Delete deployment?`. The guide's confirm label is `Delete`. `Confirm deletion` is the mismatch.

### Toast

Source: `toast.html`.

- The dismiss control's default accessible name is `Dismiss notification`. The words match the Dismiss pattern. It is not a component input; translate it with `JP_MESSAGES.toast.dismiss`.
- Story examples: `Saved successfully` repeats the outcome with an adverb the guide drops; write `Settings saved.` or `Deployment saved.` `Deploy failed` is a fragment; write `Deploy failed. Try again.` `Check configuration` does not say what happens if the person continues; write the consequence.

### Empty state

Source: `empty-state.ts` (description defaults to `''`; title is required), `table.ts` (`emptyTitle` default `No data`), `assistant-panel.ts` empty defaults.

- `No data` names neither the collection nor the recovery. Prefer `No matching services` plus a description that says what to do.
- Assistant empty description `Open the assistant from a context trigger, then send a question.` uses implementation language. Prefer `Select a section, then ask a question.`
- Product recipes copy is aligned: `No matching services` / `Clear your search or choose a different query.`
- The data page standalone example uses `Standalone empty state` and `Use outside tables for filtered lists or first-run screens.` That is documentation voice in the product slot.
- The data page icon is the character `◇`, which does not follow the icon convention. See [Icons](./ICONS.md).

### Assistant

Source: `assistant-panel.ts` and the `message.error || 'Response failed'` fallback in `assistant-panel.html`.

- `Retry` does not name the object. `Stop response` does. Use `Retry response`.
- `Response failed` is a fragment with no recovery in the message. The action is separate, and the action label is the short `Retry`. Prefer a full failure sentence and `Retry response`.
- `Response stopped` is the right idea and should end with a period when it is a status sentence.
- `Generating response`, `Stop response`, `Close assistant`, `Send`, `Clear context`, and `Ask a question…` match the guide.
- `Ask about this surface` and the "context trigger" description are the empty-state mismatches above.
- There is no default uncertainty string. Consumers must write that message themselves using the uncertainty rules.

### Related loading default

`jp-button` defaults `loadingLabel` to `Loading`. Named work in the showcase (`Refreshing services`, `Saving settings`, `Deleting services`) matches the guide. The bare default does not. Same pattern on `jp-progress`, whose label defaults to `Loading`.
