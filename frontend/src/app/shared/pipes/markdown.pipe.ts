import { Pipe, PipeTransform } from "@angular/core";
import { marked } from "marked";
import DOMPurify from "dompurify";

@Pipe({
  name: "markdown",
  standalone: true,
})
export class MarkdownPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return "";

    // Convert markdown to HTML synchronously
    const html = marked.parse(value, { async: false }) as string;
    return DOMPurify.sanitize(html);
  }
}
