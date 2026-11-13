/**
 * 文本工具：词频统计
 *
 * 按词频从高到低输出
 */

export const name = "dsh-text-word-freq";

// 只注册工具，不需要其它服务。
export const inject = ["tools"];

const TEXT_OUTPUT = {
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      text: { type: "string" },
    },
    required: ["text"],
  },
  render: (_args, value) => [
    { type: "text", text: (value && value.text) || "" },
  ],
};

const TITLE = "文本工具：词频统计";
const OP = "word_freq";
const SITE = "https://deepseekbase.com/zh/tools/";

function lines(t) {
  return String(t == null ? "" : t).replace(/\r\n?/g, "\n").split("\n");
}

function uniq(arr) {
  const seen = new Set();
  const out = [];
  for (const x of arr) { if (!seen.has(x)) { seen.add(x); out.push(x); } }
  return out;
}

function freq(t) {
  const m = new Map();
  for (const w of String(t).split(/\s+/)) {
    if (!w) continue;
    m.set(w, (m.get(w) || 0) + 1);
  }
  return m;
}

const OPS = {
  dedupe_lines: (t) => uniq(lines(t)).join("\n"),
  remove_empty_lines: (t) => lines(t).filter((x) => x.trim() !== "").join("\n"),
  upper: (t) => String(t).toUpperCase(),
  lower: (t) => String(t).toLowerCase(),
  title_case: (t) => String(t).replace(/\b([a-z])/g, (m) => m.toUpperCase()),
  reverse_chars: (t) => Array.from(String(t)).reverse().join(""),
  reverse_lines: (t) => lines(t).reverse().join("\n"),
  sort_lines: (t) => lines(t).filter(Boolean).sort((a, b) => a.localeCompare(b, "zh")).join("\n"),
  sort_lines_len: (t) => lines(t).filter(Boolean).sort((a, b) => a.length - b.length).join("\n"),
  sort_lines_numeric: (t) => lines(t).filter(Boolean).sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0)).join("\n"),
  count_chars: (t) => "字符数（含空白）: " + String(t).length + "\n字符数（不含空白）: " + String(t).replace(/\s/g, "").length,
  count_words: (t) => "词数: " + String(t).split(/\s+/).filter(Boolean).length,
  count_lines: (t) => "行数: " + lines(t).length,
  word_freq: (t) => {
    const m = freq(t);
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).map(([w, n]) => n + "\t" + w).join("\n");
  },
  replace: (t, a, b) => (a ? String(t).split(a).join(b) : String(t)),
  extract_emails: (t) => uniq(String(t).match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || []).join("\n"),
  extract_urls: (t) => uniq(String(t).match(/https?:\/\/[^\s<>]+/g) || []).join("\n"),
  extract_numbers: (t) => (String(t).match(/-?\d+(?:\.\d+)?/g) || []).join("\n"),
  extract_dates: (t) => uniq(String(t).match(/\d{4}[-/年]\d{1,2}[-/月]\d{1,2}日?/g) || []).join("\n"),
  strip_html: (t) => String(t).replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/[ \t]+/g, " ").trim(),
  html_escape: (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"),
  html_unescape: (t) => String(t).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&"),
  trim_lines: (t) => lines(t).map((x) => x.trim()).join("\n"),
  collapse_spaces: (t) => String(t).replace(/[ \t]+/g, " ").trim(),
  tabs_to_spaces: (t) => String(t).replace(/\t/g, "    "),
  normalize_newlines: (t) => String(t).replace(/\r\n?/g, "\n"),
  split_sentences: (t) => String(t).split(/(?<=[。！？!?；;])\s*/).filter(Boolean).join("\n"),
  join_lines: (t) => lines(t).map((x) => x.trim()).filter(Boolean).join(" "),
  add_line_numbers: (t) => lines(t).map((x, i) => String(i + 1).padStart(4, " ") + "  " + x).join("\n"),
  wrap_text: (t, a) => {
    const w = parseInt(a, 10) || 40;
    const out = [];
    for (const p of String(t).split(/\n/)) {
      let buf = "";
      for (const ch of Array.from(p)) {
        buf += ch;
        if (buf.length >= w) { out.push(buf); buf = ""; }
      }
      out.push(buf);
    }
    return out.join("\n");
  },
  camel_to_snake: (t) => String(t).replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase(),
  snake_to_camel: (t) => String(t).replace(/_([a-z0-9])/g, (m, c) => c.toUpperCase()),
  kebab_case: (t) => String(t).replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[\s_]+/g, "-").toLowerCase(),
  fullwidth_to_half: (t) => String(t).replace(/[\uFF01-\uFF5E]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).replace(/\u3000/g, " "),
  half_to_fullwidth: (t) => String(t).replace(/[!-~]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 0xFEE0)),
  remove_punctuation: (t) => String(t).replace(/[\p{P}\p{S}]/gu, ""),
  punctuation_stats: (t) => {
    const m = new Map();
    for (const c of Array.from(String(t))) {
      if (/[\p{P}\p{S}]/u.test(c)) m.set(c, (m.get(c) || 0) + 1);
    }
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1]).map(([c, n]) => c + "\t" + n).join("\n");
  },
  cjk_space: (t) => String(t).replace(/([\u4e00-\u9fa5])([A-Za-z0-9])/g, "$1 $2").replace(/([A-Za-z0-9])([\u4e00-\u9fa5])/g, "$1 $2"),
  dedupe_words: (t) => uniq(String(t).split(/\s+/).filter(Boolean)).join(" "),
  top_keywords: (t, a) => {
    const n = parseInt(a, 10) || 10;
    const stop = new Set(["的", "了", "和", "是", "在", "我", "有", "就", "不", "人", "都", "一", "一个", "the", "a", "an", "of", "to", "and", "in", "is", "it"]);
    const m = new Map();
    for (const w of String(t).split(/[\s,.;:!?，。；：！？、]+/)) {
      if (!w || stop.has(w)) continue;
      m.set(w, (m.get(w) || 0) + 1);
    }
    return Array.from(m.entries()).sort((x, y) => y[1] - x[1]).slice(0, n).map(([w, c]) => c + "\t" + w).join("\n");
  },
  truncate: (t, a) => {
    const n = parseInt(a, 10) || 200;
    const arr = Array.from(String(t));
    return arr.length <= n ? String(t) : arr.slice(0, n).join("") + "…";
  },
  first_sentences: (t, a) => {
    const n = parseInt(a, 10) || 3;
    return String(t).split(/(?<=[。！？!?.])\s*/).filter(Boolean).slice(0, n).join(" ");
  },
  longest_line: (t) => lines(t).reduce((a, b) => (b.length > a.length ? b : a), ""),
  duplicate_lines: (t) => {
    const seen = new Set(); const dup = new Set();
    for (const x of lines(t)) { if (seen.has(x)) dup.add(x); else seen.add(x); }
    return Array.from(dup).join("\n");
  },
  unique_preserve: (t) => uniq(lines(t)).join("\n"),
  shuffle_lines: (t) => {
    const a = lines(t).filter(Boolean);
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a.join("\n");
  },
  to_json_array: (t) => JSON.stringify(lines(t)),
  from_json_array: (t) => {
    try { const a = JSON.parse(String(t)); return Array.isArray(a) ? a.map(String).join("\n") : String(t); }
    catch (e) { return "不是合法 JSON 数组: " + String(e.message || e); }
  },
  to_csv: (t, a) => {
    const sep = a || ",";
    return lines(t).map((x) => '"' + x.split(sep).join('","') + '"').join("\n");
  },
  from_csv: (t) => lines(t).map((x) => x.replace(/^"|"$/g, "").split('","').join("\t")).join("\n"),
  csv_to_markdown_table: (t) => {
    const rows = lines(t).map((x) => x.split(","));
    if (!rows.length) return "";
    const head = "| " + rows[0].join(" | ") + " |";
    const sep = "| " + rows[0].map(() => "---").join(" | ") + " |";
    const body = rows.slice(1).map((r) => "| " + r.join(" | ") + " |").join("\n");
    return head + "\n" + sep + (body ? "\n" + body : "");
  },
  markdown_table_to_csv: (t) => lines(t).filter((x) => x.trim().startsWith("|") && !/^\|[\s:-]+\|/.test(x)).map((x) => x.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()).join(",")).join("\n"),
  number_lines: (t) => lines(t).map((x, i) => (i + 1) + ". " + x).join("\n"),
  bullet_list: (t) => lines(t).filter((x) => x.trim()).map((x) => "- " + x.trim()).join("\n"),
  ordered_list: (t) => lines(t).filter((x) => x.trim()).map((x, i) => (i + 1) + ". " + x.trim()).join("\n"),
  strip_quotes: (t) => String(t).replace(/^[\u0022\u0027\u201c\u201d\u2018\u2019]+|[\u0022\u0027\u201c\u201d\u2018\u2019]+$/g, ""),
  wrap_quotes: (t) => lines(t).filter((x) => x.trim()).map((x) => '"' + x.trim() + '"').join("\n"),
  swap_case: (t) => Array.from(String(t)).map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase())).join(""),
  sentence_case: (t) => String(t).replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (m) => m.toUpperCase()),
};

function parseArgs(a, b) { return [a, b]; }

function run(op, text, a, b) {
  const fn = OPS[op];
  if (!fn) throw new Error("未知操作: " + op);
  return String(fn(text, a, b));
}

export function apply(ctx, config) {
  void config;
  ctx.tools.register({
    name: "text_word_freq",
    description: "词频统计：按词频从高到低输出",
    parameters: {
      text: { "type": "string", required: true, "description": "要处理的文本" },
    },
    output: TEXT_OUTPUT,
    async execute(args) {
      const text = args && args.text != null ? String(args.text) : "";
      const a = args && args.a != null ? String(args.a) : "";
      const b = args && args.b != null ? String(args.b) : "";
      try {
        const out = run(OP, text, a, b);
        const lines2 = [TITLE, "=".repeat(52), out, "", "更多工具：" + SITE];
        return { text: lines2.join("\n") };
      } catch (e) {
        return { text: "处理失败: " + String((e && e.message) || e) };
      }
    },
  });
}
