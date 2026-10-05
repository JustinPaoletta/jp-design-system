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
- Plural rules belong in message override functions. Use a label input or `JP_MESSAGES` for built-in text; keep sentences whole.
- Do not bake one locale into caller-owned data. Use the formatting and message contracts below.

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

Applications choose locale and time zone. Timeline, scheduling and charts offer
`Intl`-based formatting through their documented inputs; native date/time
pickers keep ISO civil values and browser-owned display. Format other content
with `Intl.DateTimeFormat` / `Intl.NumberFormat` and an explicit time zone where
needed. Relative phrases go stale unless the application updates them.

Translate count sentences as complete functions through `provideJpMessages`.
Pagination defaults are ordinary English interpolation, not automatic locale
number formatting. Use the [message contract](../localization/CONTRACT.md) for
provider scopes, plural rules and the complete default inventory.

## Assistant wording

The application owns response content, uncertainty and transport errors. The
panel supplies chrome labels through inputs or `JP_MESSAGES.assistant`.

- Say what information is missing and how the person can supply it.
- Describe a failed response with recovery text and a clear retry action.
- Treat stopping as cancellation, with a status message rather than an error.
- Name actions consistently: "Stop response", "Retry response", "Clear context".
- Prefer user-facing terms such as "page" over implementation words such as
  "surface" or "context trigger" in product empty-state copy.

## Applying defaults

Generic English fallbacks keep components usable before configuration. Product
screens should supply labels that name the task, collection and recovery:
"Refreshing services" rather than "Loading", or "No matching services" with
instructions rather than "No data". Override existing label inputs or
`JP_MESSAGES`; do not duplicate an English string inside a new template.

The canonical default inventory is
[messages.ts](../../libs/ui/src/lib/i18n/messages.ts). Update it and the relevant
API guide together when changing built-in copy. Validate long translations,
RTL, accessible names and announcement behavior through the
[acceptance checklist](../governance/ACCEPTANCE.md).
