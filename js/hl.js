/* 極簡 C++ 語法上色器 — 無外部相依，離線可用
   刻意只處理競程會寫到的語法子集，換取小體積與零依賴 */
(function (g) {
  const KW = new Set(('alignas alignof and asm auto break case catch class const consteval constexpr ' +
    'const_cast continue decltype default delete do dynamic_cast else enum explicit export extern false ' +
    'for friend goto if inline mutable namespace new noexcept not nullptr operator or private protected ' +
    'public register reinterpret_cast return sizeof static static_assert static_cast struct switch ' +
    'template this throw true try typedef typeid typename union using virtual volatile while xor').split(' '));

  const TYPE = new Set(('bool char double float int long short signed unsigned void size_t ssize_t ' +
    'string vector map set multiset unordered_map unordered_set queue deque stack priority_queue pair ' +
    'tuple array bitset list forward_list ll ull uint64_t int64_t int32_t stringstream istringstream ' +
    'ostringstream ifstream ofstream').split(' '));

  const BUILTIN = new Set(('cin cout cerr endl npos sort stable_sort reverse unique lower_bound ' +
    'upper_bound binary_search max min max_element min_element minmax_element accumulate partial_sum ' +
    'iota fill memset swap abs fabs llabs sqrt hypot pow round floor ceil printf scanf puts getline ' +
    'push_back emplace_back pop_back push pop top front back begin end rbegin rend size empty clear ' +
    'insert erase find count assign resize substr replace at first second make_pair next_permutation ' +
    'prev_permutation nth_element remove remove_if any_of all_of none_of to_string stoi stoll stod ' +
    'transform tolower toupper isdigit isalpha isupper islower main').split(' '));

  const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  const put = (cls, txt) => '<span class="t-' + cls + '">' + esc(txt) + '</span>';

  g.highlightCpp = function (src) {
    let out = '', i = 0;
    const n = src.length;
    while (i < n) {
      const c = src[i];

      // 行註解
      if (c === '/' && src[i + 1] === '/') {
        let j = src.indexOf('\n', i); if (j < 0) j = n;
        out += put('cmt', src.slice(i, j)); i = j; continue;
      }
      // 區塊註解
      if (c === '/' && src[i + 1] === '*') {
        let j = src.indexOf('*/', i + 2); j = j < 0 ? n : j + 2;
        out += put('cmt', src.slice(i, j)); i = j; continue;
      }
      // 前處理指令（整行，但行內的 <...> 另外上色）
      if (c === '#' && (i === 0 || src[i - 1] === '\n')) {
        let j = src.indexOf('\n', i); if (j < 0) j = n;
        const line = src.slice(i, j);
        const m = line.match(/^(#\s*\w+)(\s*)(<[^>]*>|"[^"]*")?(.*)$/);
        if (m) {
          out += put('pre', m[1]) + esc(m[2] || '');
          if (m[3]) out += put('str', m[3]);
          if (m[4]) out += esc(m[4]);
        } else out += put('pre', line);
        i = j; continue;
      }
      // 字串
      if (c === '"') {
        let j = i + 1;
        while (j < n && !(src[j] === '"' && src[j - 1] !== '\\')) j++;
        j = Math.min(j + 1, n);
        out += put('str', src.slice(i, j)); i = j; continue;
      }
      // 字元常量
      if (c === "'") {
        let j = i + 1;
        while (j < n && !(src[j] === "'" && src[j - 1] !== '\\')) j++;
        j = Math.min(j + 1, n);
        out += put('str', src.slice(i, j)); i = j; continue;
      }
      // 數字
      if (/[0-9]/.test(c)) {
        let j = i;
        while (j < n && /[0-9a-fA-FxXeE.'+-]/.test(src[j])) {
          if (/[+-]/.test(src[j]) && !/[eE]/.test(src[j - 1])) break;
          j++;
        }
        while (j < n && /[uUlLfF]/.test(src[j])) j++;
        out += put('num', src.slice(i, j)); i = j; continue;
      }
      // 識別字
      if (/[A-Za-z_]/.test(c)) {
        let j = i;
        while (j < n && /[A-Za-z0-9_]/.test(src[j])) j++;
        const w = src.slice(i, j);
        let k = 'id';
        if (KW.has(w)) k = 'kw';
        else if (TYPE.has(w)) k = 'ty';
        else if (BUILTIN.has(w)) k = 'fn';
        else if (/^[A-Z_][A-Z0-9_]*$/.test(w) && w.length > 1) k = 'num'; // 常數如 INF、MOD
        out += k === 'id' ? esc(w) : put(k, w);
        i = j; continue;
      }
      // 運算子
      if (/[+\-*/%=<>!&|^~?:]/.test(c)) {
        let j = i;
        while (j < n && /[+\-*/%=<>!&|^~?:]/.test(src[j])) j++;
        out += put('op', src.slice(i, j)); i = j; continue;
      }
      // 括號與標點
      if (/[{}()[\];,.]/.test(c)) { out += put('pun', c); i++; continue; }

      out += esc(c); i++;
    }
    return out;
  };
})(window);
