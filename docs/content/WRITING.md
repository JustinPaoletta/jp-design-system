# Documentation writing rules

JP documentation uses ASD-STE100 Simplified Technical English, Issue 9.
The [official standard](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf)
contains the rules and dictionary. This page applies those rules to JP.

## Words and sentences

- Use approved dictionary words with their approved meanings and parts of speech.
- Use approved verb forms and simple tenses.
- Use active voice for instructions.
- Write one instruction in each sentence.
- Keep instruction sentences within 20 words.
- Keep description sentences within 25 words.
- Keep each paragraph on one topic, with no more than six sentences.
- Put a condition before its instruction.
- Use the same technical term for the same item.
- Keep noun groups within three words, unless the standard permits a longer technical noun.
- Do not use contractions or omit necessary words.
- Use lists for complex information.

## Project terms

The [technical term list](TECHNICAL_TERMS.md) defines software terms used by JP.
These terms belong to the computer and software subject field.
The [official FAQ](https://www.asd-ste100.org/STE_faq.html) explains technical nouns and verbs.
A project term does not approve an unrelated use of that word.

Keep API names, selectors, CSS variables, commands, paths and quoted interface labels exact.
Explain an unfamiliar term before its first use, or link to its definition.
Do not change a code example to satisfy a prose rule.

## Document structure

1. State the purpose of the component or procedure.
2. Give necessary setup information.
3. Put instructions in their operation order.
4. State the result of each important action.
5. Give limits and recovery instructions near the applicable behavior.

Use a table for API values or direct comparisons.
Keep each table cell short.
Use a complete sentence for a behavior description.
Use short labels for types, defaults and headings.

## Product copy

Use sentence case for labels.
Name the action and its object, such as "Save settings".
For an error, state the failure and recovery action.
For an empty state, name the collection and how to add or find content.

The application supplies its product text and translations.
Built-in defaults use label inputs or `JP_MESSAGES`.
See the [message rules](../localization/CONTRACT.md).
Quoted existing interface text stays exact in reference documentation.

## Inspection and checks

1. Compare the text with the code and current test evidence.
2. Examine word meanings, parts of speech and technical terms against Issue 9.
3. Run `node tools/docs/check-writing.mjs`.
4. Run `node --test tools/docs/check-writing.spec.mjs`.
5. Run `node tools/docs/check-links.mjs`.
6. Run `npm run format:check`.

The writing check finds selected sentence-length and structure problems.
The Docs workflow runs this check and its tests on pull requests.

The check covers root product guides, `docs/` and application/package READMEs.
Code samples, exact quoted labels and managed tool instructions keep their original text.
It does not assess every dictionary use or establish full ASD-STE100 conformance.
A person must examine meaning, grammar and technical accuracy.
The standard remains the authority.
