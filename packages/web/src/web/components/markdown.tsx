import { useMemo } from "react";

function parseMarkdown(text: string): string {
  let html = text;

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-slate-100 rounded-lg p-3 overflow-x-auto text-sm my-2 border border-slate-200"><code>$2</code></pre>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-sm font-mono text-[#1E3A5F]">$1</code>');

  // Tables
  html = html.replace(/(?:^|\n)(\|.+\|)\n(\|[-:\| ]+\|)\n((?:\|.+\|\n?)+)/g, (_, header, _separator, body) => {
    const headers = header.split("|").filter((c: string) => c.trim()).map((c: string) =>
      `<th class="px-3 py-2 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b-2 border-slate-200">${c.trim()}</th>`
    ).join("");
    const rows = body.trim().split("\n").map((row: string) => {
      const cells = row.split("|").filter((c: string) => c.trim()).map((c: string) =>
        `<td class="px-3 py-2 text-sm border-b border-slate-100">${c.trim()}</td>`
      ).join("");
      return `<tr class="hover:bg-slate-50">${cells}</tr>`;
    }).join("");
    return `<div class="overflow-x-auto my-3"><table class="min-w-full border border-slate-200 rounded-lg overflow-hidden"><thead class="bg-slate-50"><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
  });

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>');

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Headers
  html = html.replace(/^#### (.+)$/gm, '<h4 class="text-sm font-bold text-slate-700 mt-3 mb-1">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-[#1E3A5F] mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-[#1E3A5F] mt-4 mb-2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-[#1E3A5F] mt-4 mb-2">$1</h1>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-4 border-slate-200" />');

  // Unordered lists
  html = html.replace(/^[\-\*] (.+)$/gm, '<li class="ml-4 text-sm list-disc list-inside text-slate-700">$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 text-sm list-decimal list-inside text-slate-700">$1</li>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-blue-600 hover:text-blue-800 underline">$1</a>');

  // Alert blocks (⚠️ or ALERTE)
  html = html.replace(/^(⚠️.+|ALERTE.+)$/gm, '<div class="bg-amber-50 border-l-4 border-amber-400 p-2 my-2 text-sm text-amber-800 rounded-r">$1</div>');

  // Paragraphs - wrap remaining lines
  html = html.replace(/^(?!<[a-z])((?!<).+)$/gm, '<p class="text-sm text-slate-700 leading-relaxed">$1</p>');

  return html;
}

export function Markdown({ content }: { content: string }) {
  const html = useMemo(() => parseMarkdown(content), [content]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
