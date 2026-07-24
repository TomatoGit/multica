/**
 * Convert legacy mention shortcodes [@ id="UUID" label="LABEL"] to the
 * standard markdown link format [@LABEL](mention://member/UUID).
 *
 * These shortcodes exist in older database records from a previous mention
 * serialization format. This function normalises them so downstream parsers
 * (Tiptap @tiptap/markdown, react-markdown) only need to handle one syntax.
 *
 * 同步副本——必须与 packages/core/markdown/mention-shortcodes.ts 保持一致。
 * Mobile 使用 core 副本，因为 Mobile 不能导入 packages/ui/（见
 * apps/mobile/CLAUDE.md），而 packages/ui/ 不能导入 packages/core/
 *（见 docs/agents/frontend.md「包边界」）。修改这里的正则或行为时必须同步
 * core 副本，否则 Web 与 Mobile 会以不同方式渲染旧 mention，并破坏计数一致性。
 */
export function preprocessMentionShortcodes(text: string): string {
  if (!text.includes("[@ ")) return text;
  return text.replace(
    /\[@\s+([^\]]*)\]/g,
    (match, attrString: string) => {
      const attrs: Record<string, string> = {};
      const re = /(\w+)="([^"]*)"/g;
      let m;
      while ((m = re.exec(attrString)) !== null) {
        if (m[1] && m[2] !== undefined) attrs[m[1]] = m[2];
      }
      const { id, label } = attrs;
      if (!id || !label) return match;
      return `[@${label}](mention://member/${id})`;
    },
  );
}
