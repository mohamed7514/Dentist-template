import { Fragment, type ReactNode } from "react";

/** Tiny markup for dictionary strings: "\n" is a line break and *text* is emphasised. */
export function rich(text: string): ReactNode {
  return text.split("\n").map((line, lineIndex) => (
    <Fragment key={lineIndex}>
      {lineIndex > 0 && <br />}
      {line.split(/(\*[^*]+\*)/).map((part, index) => (part.startsWith("*") && part.endsWith("*") && part.length > 2 ? <em key={index}>{part.slice(1, -1)}</em> : part))}
    </Fragment>
  ));
}
