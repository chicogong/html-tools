const fs = require('fs');
const path = require('path');

// CSV Viewer implementation
const csvViewerHTML = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CSV 查看器 - WebUtils</title>
  <meta name="description" content="在线 CSV 文件查看和编辑工具" />
  <meta name="keywords" content="csv viewer 查看器 表格" />
  <meta name="author" content="WebUtils" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://tools.realtime-ai.chat/tools/data/csv-viewer.html" />

  <meta property="og:title" content="CSV 查看器 - WebUtils" />
  <meta property="og:description" content="在线 CSV 文件查看和编辑工具" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://tools.realtime-ai.chat/tools/data/csv-viewer.html" />
  <meta property="og:site_name" content="WebUtils" />
  <meta property="og:locale" content="zh_CN" />
  <meta property="og:image" content="https://tools.realtime-ai.chat/social-preview.png" />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="CSV 查看器 - WebUtils" />
  <meta name="twitter:description" content="在线 CSV 文件查看和编辑工具" />
  <meta name="twitter:image" content="https://tools.realtime-ai.chat/social-preview.png" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "首页", "item": "https://tools.realtime-ai.chat/"},
      {"@type": "ListItem", "position": 2, "name": "数据工具", "item": "https://tools.realtime-ai.chat/#data"},
      {"@type": "ListItem", "position": 3, "name": "CSV 查看器", "item": "https://tools.realtime-ai.chat/tools/data/csv-viewer.html"}
    ]
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root{--bg-deep:#0a0a0f;--bg-surface:#12121a;--bg-card:#1a1a24;--bg-input:#0e0e14;--text-primary:#e8e8ed;--text-secondary:#8888a0;--text-muted:#55556a;--border-subtle:#2a2a3a;--accent-cyan:#00f5d4;--accent-green:#10b981;--radius-sm:4px;--radius-md:8px;--radius-lg:12px}
    [data-theme="light"]{--bg-deep:#fafafa;--bg-surface:#fff;--bg-card:#fff;--bg-input:#f5f5f5;--text-primary:#1a1a1a;--text-secondary:#666;--text-muted:#999;--border-subtle:#e5e5e5}
    .theme-toggle{position:fixed;top:1rem;right:1rem;width:40px;height:40px;border-radius:50%;border:1px solid var(--border-subtle);background:var(--bg-card);cursor:pointer;font-size:1.2rem;z-index:100;transition:all .2s}.theme-toggle:hover{transform:scale(1.1)}

    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Space Grotesk',system-ui,sans-serif;background:var(--bg-deep);color:var(--text-primary);min-height:100vh;line-height:1.6}
    .bg-grid{position:fixed;inset:0;background-image:linear-gradient(rgb(0,245,212,0.02) 1px,transparent 1px),linear-gradient(90deg,rgb(0,245,212,0.02) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0}
    .container{position:relative;z-index:1;max-width:1400px;margin:0 auto;padding:24px;min-height:100vh}

    .header{display:flex;align-items:center;gap:20px;margin-bottom:24px;flex-wrap:wrap}
    .breadcrumb{display:flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:0.85rem;padding:8px 14px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);flex-wrap:wrap}
    .breadcrumb a{color:var(--text-secondary);text-decoration:none;transition:color 0.2s}
    .breadcrumb a:hover{color:var(--accent-cyan)}
    .breadcrumb-separator{color:var(--text-muted);user-select:none}
    .breadcrumb-current{color:var(--text-primary);font-weight:500}
    .title-section{flex:1}
    .title-section h1{font-family:'JetBrains Mono',monospace;font-size:1.5rem;font-weight:600;display:flex;align-items:center;gap:12px}
    .title-section h1 .icon{font-size:1.8rem}
    .title-section p{color:var(--text-secondary);margin-top:4px;font-size:0.9rem}

    .panel{background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:24px;margin-bottom:24px}
    .panel-title{font-family:'JetBrains Mono',monospace;font-size:0.9rem;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid var(--border-subtle)}

    textarea{width:100%;min-height:150px;padding:12px;font-family:'JetBrains Mono',monospace;font-size:0.85rem;background:var(--bg-input);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);resize:vertical}
    textarea:focus{outline:none;border-color:var(--accent-cyan)}

    table{width:100%;border-collapse:collapse;font-family:'JetBrains Mono',monospace;font-size:0.85rem;overflow-x:auto;display:block}
    thead{background:var(--bg-input);position:sticky;top:0}
    th,td{padding:12px;text-align:left;border:1px solid var(--border-subtle)}
    th{color:var(--text-secondary);font-weight:600}
    td{color:var(--text-primary)}
    tbody tr:hover{background:var(--bg-surface)}

    .btn-row{display:flex;gap:12px;flex-wrap:wrap}
    .btn{flex:1;min-width:120px;padding:12px 20px;font-family:'JetBrains Mono',monospace;font-size:0.85rem;font-weight:500;border:none;border-radius:var(--radius-sm);cursor:pointer;transition:all 0.2s}
    .btn-primary{background:var(--accent-cyan);color:var(--bg-deep)}
    .btn-primary:hover{transform:translateY(-2px);box-shadow:0 4px 20px rgba(0,245,212,0.3)}
    .btn-secondary{background:var(--bg-surface);color:var(--text-primary);border:1px solid var(--border-subtle)}
    .btn-secondary:hover{border-color:var(--accent-cyan);color:var(--accent-cyan)}

    .stats{display:flex;gap:16px;margin-top:16px;font-family:'JetBrains Mono',monospace;font-size:0.85rem}
    .stat-item{padding:8px 12px;background:var(--bg-input);border:1px solid var(--border-subtle);border-radius:var(--radius-sm)}
    .stat-label{color:var(--text-secondary)}
    .stat-value{color:var(--accent-cyan);font-weight:600;margin-left:8px}

    .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--accent-green);color:#fff;padding:12px 24px;border-radius:var(--radius-md);font-family:'JetBrains Mono',monospace;font-size:0.85rem;font-weight:500;opacity:0;transition:all 0.3s;z-index:1000}
    .toast.show{transform:translateX(-50%) translateY(0);opacity:1}
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <button class="theme-toggle" onclick="toggleTheme()" title="切换主题">🌓</button>

  <div class="container">
    <header class="header">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="../../index.html">首页</a>
        <span class="breadcrumb-separator">/</span>
        <a href="../../index.html#data">数据工具</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">CSV 查看器</span>
      </nav>
      <div class="title-section">
        <h1><span class="icon">📊</span>CSV 查看器</h1>
        <p>在线 CSV 文件查看和编辑工具</p>
      </div>
    </header>

    <main>
      <div class="panel">
        <div class="panel-title">输入 CSV 数据</div>
        <textarea id="csvInput" placeholder="粘贴 CSV 数据或手动输入，例如：&#10;姓名,年龄,城市&#10;张三,25,北京&#10;李四,30,上海"></textarea>
        <div class="btn-row" style="margin-top:16px">
          <button class="btn btn-primary" onclick="parseCSV()">📊 解析 CSV</button>
          <button class="btn btn-secondary" onclick="clearAll()">🔄 清空</button>
          <button class="btn btn-secondary" onclick="downloadCSV()">📥 下载 CSV</button>
        </div>
        <div class="stats" id="stats" style="display:none">
          <div class="stat-item"><span class="stat-label">行数:</span><span class="stat-value" id="rowCount">0</span></div>
          <div class="stat-item"><span class="stat-label">列数:</span><span class="stat-value" id="colCount">0</span></div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-title">数据表格</div>
        <div id="tableContainer" style="max-height:500px;overflow:auto"></div>
      </div>
    </main>
  </div>

  <div class="toast" id="toast">操作成功</div>

  <script>
    function toggleTheme(){const body=document.body;const isDark=body.getAttribute('data-theme')!=='light';body.setAttribute('data-theme',isDark?'light':'dark');localStorage.setItem('theme',isDark?'light':'dark')}
    (function(){const saved=localStorage.getItem('theme');if(saved==='light')document.body.setAttribute('data-theme','light')})();

    function parseCSV(){
      const input=document.getElementById('csvInput').value.trim();
      if(!input){showToast('请输入 CSV 数据');return}

      const lines=input.split('\\n').filter(line=>line.trim());
      if(lines.length===0){showToast('没有有效数据');return}

      const rows=lines.map(line=>line.split(',').map(cell=>cell.trim()));
      const headers=rows[0];
      const data=rows.slice(1);

      let html='<table><thead><tr>';
      headers.forEach(h=>html+=\`<th>\${h}</th>\`);
      html+='</tr></thead><tbody>';
      data.forEach(row=>{
        html+='<tr>';
        row.forEach(cell=>html+=\`<td>\${cell}</td>\`);
        html+='</tr>';
      });
      html+='</tbody></table>';

      document.getElementById('tableContainer').innerHTML=html;
      document.getElementById('stats').style.display='flex';
      document.getElementById('rowCount').textContent=data.length;
      document.getElementById('colCount').textContent=headers.length;
      showToast('解析成功');
    }

    function clearAll(){
      document.getElementById('csvInput').value='';
      document.getElementById('tableContainer').innerHTML='';
      document.getElementById('stats').style.display='none';
      showToast('已清空');
    }

    function downloadCSV(){
      const input=document.getElementById('csvInput').value;
      if(!input){showToast('没有数据可下载');return}
      const blob=new Blob([input],{type:'text/csv'});
      const url=URL.createObjectURL(blob);
      const a=document.createElement('a');
      a.href=url;
      a.download='data.csv';
      a.click();
      URL.revokeObjectURL(url);
      showToast('下载成功');
    }

    function showToast(msg){
      const toast=document.getElementById('toast');
      toast.textContent=msg;
      toast.classList.add('show');
      setTimeout(()=>toast.classList.remove('show'),2000);
    }
  </script>
</body>
</html>`;

// Meeting Timer implementation
const meetingTimerHTML = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>会议计时器 - WebUtils</title>
  <meta name="description" content="会议倒计时和时间管理" />
  <meta name="keywords" content="meeting timer 会议 计时" />
  <meta name="author" content="WebUtils" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://tools.realtime-ai.chat/tools/office/meeting-timer.html" />

  <meta property="og:title" content="会议计时器 - WebUtils" />
  <meta property="og:description" content="会议倒计时和时间管理" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://tools.realtime-ai.chat/tools/office/meeting-timer.html" />
  <meta property="og:site_name" content="WebUtils" />
  <meta property="og:locale" content="zh_CN" />
  <meta property="og:image" content="https://tools.realtime-ai.chat/social-preview.png" />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="会议计时器 - WebUtils" />
  <meta name="twitter:description" content="会议倒计时和时间管理" />
  <meta name="twitter:image" content="https://tools.realtime-ai.chat/social-preview.png" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "首页", "item": "https://tools.realtime-ai.chat/"},
      {"@type": "ListItem", "position": 2, "name": "办公工具", "item": "https://tools.realtime-ai.chat/#office"},
      {"@type": "ListItem", "position": 3, "name": "会议计时器", "item": "https://tools.realtime-ai.chat/tools/office/meeting-timer.html"}
    ]
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root{--bg-deep:#0a0a0f;--bg-surface:#12121a;--bg-card:#1a1a24;--bg-input:#0e0e14;--text-primary:#e8e8ed;--text-secondary:#8888a0;--text-muted:#55556a;--border-subtle:#2a2a3a;--accent-cyan:#00f5d4;--accent-green:#10b981;--accent-red:#f43f5e;--radius-sm:4px;--radius-md:8px;--radius-lg:12px}
    [data-theme="light"]{--bg-deep:#fafafa;--bg-surface:#fff;--bg-card:#fff;--bg-input:#f5f5f5;--text-primary:#1a1a1a;--text-secondary:#666;--text-muted:#999;--border-subtle:#e5e5e5}
    .theme-toggle{position:fixed;top:1rem;right:1rem;width:40px;height:40px;border-radius:50%;border:1px solid var(--border-subtle);background:var(--bg-card);cursor:pointer;font-size:1.2rem;z-index:100;transition:all .2s}.theme-toggle:hover{transform:scale(1.1)}

    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Space Grotesk',system-ui,sans-serif;background:var(--bg-deep);color:var(--text-primary);min-height:100vh;line-height:1.6;display:flex;align-items:center;justify-content:center}
    .bg-grid{position:fixed;inset:0;background-image:linear-gradient(rgb(0,245,212,0.02) 1px,transparent 1px),linear-gradient(90deg,rgb(0,245,212,0.02) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0}
    .container{position:relative;z-index:1;max-width:600px;width:100%;padding:24px}

    .header{text-align:center;margin-bottom:32px}
    .breadcrumb{display:inline-flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:0.85rem;padding:8px 14px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);margin-bottom:16px}
    .breadcrumb a{color:var(--text-secondary);text-decoration:none;transition:color 0.2s}
    .breadcrumb a:hover{color:var(--accent-cyan)}
    .breadcrumb-separator{color:var(--text-muted);user-select:none}
    .breadcrumb-current{color:var(--text-primary);font-weight:500}
    h1{font-family:'JetBrains Mono',monospace;font-size:2rem;font-weight:600;display:flex;align-items:center;justify-content:center;gap:12px}
    h1 .icon{font-size:2.5rem}

    .timer-display{font-family:'JetBrains Mono',monospace;font-size:6rem;font-weight:700;text-align:center;margin:48px 0;color:var(--accent-cyan);text-shadow:0 0 30px var(--accent-cyan)}
    .timer-display.warning{color:var(--accent-red);text-shadow:0 0 30px var(--accent-red)}

    .controls{display:flex;flex-direction:column;gap:16px;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:24px}
    .input-group{display:flex;gap:12px}
    .input-group input{flex:1;padding:12px;font-family:'JetBrains Mono',monospace;font-size:1rem;background:var(--bg-input);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);text-align:center}
    .input-group input:focus{outline:none;border-color:var(--accent-cyan)}
    .input-label{font-size:0.85rem;color:var(--text-secondary);text-align:center;margin-top:4px}

    .btn-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    .btn{padding:16px;font-family:'JetBrains Mono',monospace;font-size:1rem;font-weight:600;border:none;border-radius:var(--radius-sm);cursor:pointer;transition:all 0.2s}
    .btn-primary{background:var(--accent-cyan);color:var(--bg-deep)}
    .btn-primary:hover{transform:translateY(-2px);box-shadow:0 4px 20px rgba(0,245,212,0.3)}
    .btn-secondary{background:var(--bg-surface);color:var(--text-primary);border:1px solid var(--border-subtle)}
    .btn-secondary:hover{border-color:var(--accent-cyan);color:var(--accent-cyan)}
    .btn-danger{background:var(--accent-red);color:var(--bg-deep)}

    .presets{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px}
    .preset-btn{padding:12px;font-family:'JetBrains Mono',monospace;font-size:0.85rem;background:var(--bg-input);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);cursor:pointer;transition:all 0.2s;color:var(--text-primary)}
    .preset-btn:hover{border-color:var(--accent-cyan);color:var(--accent-cyan)}

    @media(max-width:600px){.timer-display{font-size:4rem}}
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <button class="theme-toggle" onclick="toggleTheme()" title="切换主题">🌓</button>

  <div class="container">
    <header class="header">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="../../index.html">首页</a>
        <span class="breadcrumb-separator">/</span>
        <a href="../../index.html#office">办公工具</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">会议计时器</span>
      </nav>
      <h1><span class="icon">⏱️</span>会议计时器</h1>
    </header>

    <div class="timer-display" id="timerDisplay">00:00</div>

    <div class="controls">
      <div class="input-group">
        <div style="flex:1">
          <input type="number" id="minutes" min="0" max="999" value="30" placeholder="分钟">
          <div class="input-label">分钟</div>
        </div>
        <div style="flex:1">
          <input type="number" id="seconds" min="0" max="59" value="0" placeholder="秒">
          <div class="input-label">秒</div>
        </div>
      </div>

      <div class="btn-row">
        <button class="btn btn-primary" id="startBtn" onclick="startTimer()">▶️ 开始</button>
        <button class="btn btn-danger" id="stopBtn" onclick="stopTimer()" style="display:none">⏸️ 暂停</button>
        <button class="btn btn-secondary" onclick="resetTimer()">🔄 重置</button>
      </div>

      <div class="presets">
        <button class="preset-btn" onclick="setTime(5,0)">5 分钟</button>
        <button class="preset-btn" onclick="setTime(15,0)">15 分钟</button>
        <button class="preset-btn" onclick="setTime(30,0)">30 分钟</button>
        <button class="preset-btn" onclick="setTime(45,0)">45 分钟</button>
        <button class="preset-btn" onclick="setTime(60,0)">60 分钟</button>
        <button class="preset-btn" onclick="setTime(90,0)">90 分钟</button>
      </div>
    </div>
  </div>

  <script>
    let timer=null;
    let totalSeconds=0;
    let remainingSeconds=0;

    function toggleTheme(){const body=document.body;const isDark=body.getAttribute('data-theme')!=='light';body.setAttribute('data-theme',isDark?'light':'dark');localStorage.setItem('theme',isDark?'light':'dark')}
    (function(){const saved=localStorage.getItem('theme');if(saved==='light')document.body.setAttribute('data-theme','light')})();

    function updateDisplay(){
      const mins=Math.floor(remainingSeconds/60);
      const secs=remainingSeconds%60;
      const display=document.getElementById('timerDisplay');
      display.textContent=\`\${mins.toString().padStart(2,'0')}:\${secs.toString().padStart(2,'0')}\`;

      if(remainingSeconds<=60&&remainingSeconds>0){
        display.classList.add('warning');
      }else{
        display.classList.remove('warning');
      }
    }

    function startTimer(){
      if(!timer){
        const m=parseInt(document.getElementById('minutes').value)||0;
        const s=parseInt(document.getElementById('seconds').value)||0;
        totalSeconds=m*60+s;
        if(remainingSeconds===0)remainingSeconds=totalSeconds;

        if(remainingSeconds<=0)return;

        document.getElementById('startBtn').style.display='none';
        document.getElementById('stopBtn').style.display='block';

        timer=setInterval(()=>{
          remainingSeconds--;
          updateDisplay();

          if(remainingSeconds<=0){
            stopTimer();
            playAlert();
          }
        },1000);
      }
    }

    function stopTimer(){
      if(timer){
        clearInterval(timer);
        timer=null;
        document.getElementById('startBtn').style.display='block';
        document.getElementById('stopBtn').style.display='none';
      }
    }

    function resetTimer(){
      stopTimer();
      remainingSeconds=0;
      document.getElementById('timerDisplay').textContent='00:00';
      document.getElementById('timerDisplay').classList.remove('warning');
    }

    function setTime(m,s){
      resetTimer();
      document.getElementById('minutes').value=m;
      document.getElementById('seconds').value=s;
      remainingSeconds=m*60+s;
      updateDisplay();
    }

    function playAlert(){
      if('Notification' in window&&Notification.permission==='granted'){
        new Notification('⏱️ 会议时间到！',{body:'计时器已结束'});
      }
      alert('⏱️ 会议时间到！');
    }

    if('Notification' in window&&Notification.permission==='default'){
      Notification.requestPermission();
    }
  </script>
</body>
</html>`;

// Timezone Converter implementation
const timezoneConverterHTML = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>时区转换器 - WebUtils</title>
  <meta name="description" content="全球时区时间转换" />
  <meta name="keywords" content="timezone 时区 转换 time" />
  <meta name="author" content="WebUtils" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://tools.realtime-ai.chat/tools/travel/timezone-converter.html" />

  <meta property="og:title" content="时区转换器 - WebUtils" />
  <meta property="og:description" content="全球时区时间转换" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://tools.realtime-ai.chat/tools/travel/timezone-converter.html" />
  <meta property="og:site_name" content="WebUtils" />
  <meta property="og:locale" content="zh_CN" />
  <meta property="og:image" content="https://tools.realtime-ai.chat/social-preview.png" />

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="时区转换器 - WebUtils" />
  <meta name="twitter:description" content="全球时区时间转换" />
  <meta name="twitter:image" content="https://tools.realtime-ai.chat/social-preview.png" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {"@type": "ListItem", "position": 1, "name": "首页", "item": "https://tools.realtime-ai.chat/"},
      {"@type": "ListItem", "position": 2, "name": "旅行工具", "item": "https://tools.realtime-ai.chat/#travel"},
      {"@type": "ListItem", "position": 3, "name": "时区转换器", "item": "https://tools.realtime-ai.chat/tools/travel/timezone-converter.html"}
    ]
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root{--bg-deep:#0a0a0f;--bg-surface:#12121a;--bg-card:#1a1a24;--bg-input:#0e0e14;--text-primary:#e8e8ed;--text-secondary:#8888a0;--text-muted:#55556a;--border-subtle:#2a2a3a;--accent-green:#10b981;--radius-sm:4px;--radius-md:8px;--radius-lg:12px}
    [data-theme="light"]{--bg-deep:#fafafa;--bg-surface:#fff;--bg-card:#fff;--bg-input:#f5f5f5;--text-primary:#1a1a1a;--text-secondary:#666;--text-muted:#999;--border-subtle:#e5e5e5}
    .theme-toggle{position:fixed;top:1rem;right:1rem;width:40px;height:40px;border-radius:50%;border:1px solid var(--border-subtle);background:var(--bg-card);cursor:pointer;font-size:1.2rem;z-index:100;transition:all .2s}.theme-toggle:hover{transform:scale(1.1)}

    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Space Grotesk',system-ui,sans-serif;background:var(--bg-deep);color:var(--text-primary);min-height:100vh;line-height:1.6}
    .bg-grid{position:fixed;inset:0;background-image:linear-gradient(rgb(16,185,129,0.02) 1px,transparent 1px),linear-gradient(90deg,rgb(16,185,129,0.02) 1px,transparent 1px);background-size:40px 40px;pointer-events:none;z-index:0}
    .container{position:relative;z-index:1;max-width:900px;margin:0 auto;padding:24px;min-height:100vh}

    .header{display:flex;align-items:center;gap:20px;margin-bottom:24px;flex-wrap:wrap}
    .breadcrumb{display:flex;align-items:center;gap:8px;font-family:'JetBrains Mono',monospace;font-size:0.85rem;padding:8px 14px;background:var(--bg-surface);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);flex-wrap:wrap}
    .breadcrumb a{color:var(--text-secondary);text-decoration:none;transition:color 0.2s}
    .breadcrumb a:hover{color:var(--accent-green)}
    .breadcrumb-separator{color:var(--text-muted);user-select:none}
    .breadcrumb-current{color:var(--text-primary);font-weight:500}
    .title-section{flex:1}
    .title-section h1{font-family:'JetBrains Mono',monospace;font-size:1.5rem;font-weight:600;display:flex;align-items:center;gap:12px}
    .title-section h1 .icon{font-size:1.8rem}
    .title-section p{color:var(--text-secondary);margin-top:4px;font-size:0.9rem}

    .timezone-card{background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:24px;margin-bottom:24px}
    .timezone-card.current{border-color:var(--accent-green)}
    .timezone-label{font-family:'JetBrains Mono',monospace;font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px}
    .timezone-time{font-family:'JetBrains Mono',monospace;font-size:3rem;font-weight:700;color:var(--accent-green);margin-bottom:8px}
    .timezone-date{font-family:'JetBrains Mono',monospace;font-size:1rem;color:var(--text-secondary)}

    select,input[type="datetime-local"]{width:100%;padding:12px;font-family:'JetBrains Mono',monospace;font-size:0.9rem;background:var(--bg-input);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);color:var(--text-primary);margin-bottom:16px}
    select:focus,input:focus{outline:none;border-color:var(--accent-green)}

    .grid-2{display:grid;grid-template-columns:1fr 1fr;gap:24px}
    @media(max-width:768px){.grid-2{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <div class="bg-grid"></div>
  <button class="theme-toggle" onclick="toggleTheme()" title="切换主题">🌓</button>

  <div class="container">
    <header class="header">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <a href="../../index.html">首页</a>
        <span class="breadcrumb-separator">/</span>
        <a href="../../index.html#travel">旅行工具</a>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">时区转换器</span>
      </nav>
      <div class="title-section">
        <h1><span class="icon">🌍</span>时区转换器</h1>
        <p>全球时区时间转换</p>
      </div>
    </header>

    <main>
      <div class="timezone-card current">
        <div class="timezone-label">本地时间</div>
        <div class="timezone-time" id="localTime">--:--:--</div>
        <div class="timezone-date" id="localDate">----年--月--日</div>
      </div>

      <div class="grid-2">
        <div class="timezone-card">
          <div class="timezone-label">源时区</div>
          <select id="fromTz">
            <option value="Asia/Shanghai">中国 (UTC+8)</option>
            <option value="America/New_York">纽约 (UTC-5)</option>
            <option value="America/Los_Angeles">洛杉矶 (UTC-8)</option>
            <option value="Europe/London">伦敦 (UTC+0)</option>
            <option value="Europe/Paris">巴黎 (UTC+1)</option>
            <option value="Asia/Tokyo">东京 (UTC+9)</option>
            <option value="Asia/Seoul">首尔 (UTC+9)</option>
            <option value="Asia/Dubai">迪拜 (UTC+4)</option>
            <option value="Australia/Sydney">悉尼 (UTC+11)</option>
          </select>
          <input type="datetime-local" id="fromTime">
        </div>

        <div class="timezone-card">
          <div class="timezone-label">目标时区</div>
          <select id="toTz">
            <option value="America/New_York">纽约 (UTC-5)</option>
            <option value="America/Los_Angeles">洛杉矶 (UTC-8)</option>
            <option value="Europe/London">伦敦 (UTC+0)</option>
            <option value="Europe/Paris">巴黎 (UTC+1)</option>
            <option value="Asia/Tokyo">东京 (UTC+9)</option>
            <option value="Asia/Seoul">首尔 (UTC+9)</option>
            <option value="Asia/Shanghai">中国 (UTC+8)</option>
            <option value="Asia/Dubai">迪拜 (UTC+4)</option>
            <option value="Australia/Sydney">悉尼 (UTC+11)</option>
          </select>
          <div class="timezone-time" id="toTime" style="font-size:2rem">--:--:--</div>
          <div class="timezone-date" id="toDate">----年--月--日</div>
        </div>
      </div>
    </main>
  </div>

  <script>
    function toggleTheme(){const body=document.body;const isDark=body.getAttribute('data-theme')!=='light';body.setAttribute('data-theme',isDark?'light':'dark');localStorage.setItem('theme',isDark?'light':'dark')}
    (function(){const saved=localStorage.getItem('theme');if(saved==='light')document.body.setAttribute('data-theme','light')})();

    function updateLocalTime(){
      const now=new Date();
      document.getElementById('localTime').textContent=now.toLocaleTimeString('zh-CN',{hour12:false});
      document.getElementById('localDate').textContent=now.toLocaleDateString('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'});
    }

    function convertTime(){
      const fromTime=document.getElementById('fromTime').value;
      if(!fromTime)return;

      const fromTz=document.getElementById('fromTz').value;
      const toTz=document.getElementById('toTz').value;

      const date=new Date(fromTime);
      const toTime=date.toLocaleTimeString('zh-CN',{timeZone:toTz,hour12:false});
      const toDate=date.toLocaleDateString('zh-CN',{timeZone:toTz,year:'numeric',month:'long',day:'numeric',weekday:'long'});

      document.getElementById('toTime').textContent=toTime;
      document.getElementById('toDate').textContent=toDate;
    }

    document.getElementById('fromTime').addEventListener('change',convertTime);
    document.getElementById('fromTz').addEventListener('change',convertTime);
    document.getElementById('toTz').addEventListener('change',convertTime);

    setInterval(updateLocalTime,1000);
    updateLocalTime();

    const now=new Date();
    document.getElementById('fromTime').value=now.toISOString().slice(0,16);
    convertTime();
  </script>
</body>
</html>`;

// Write files
const toolsDir = path.join(__dirname, '..');
fs.writeFileSync(path.join(toolsDir, 'tools/data/csv-viewer.html'), csvViewerHTML);
fs.writeFileSync(path.join(toolsDir, 'tools/office/meeting-timer.html'), meetingTimerHTML);
fs.writeFileSync(path.join(toolsDir, 'tools/travel/timezone-converter.html'), timezoneConverterHTML);

console.log('✅ CSV 查看器已实现');
console.log('✅ 会议计时器已实现');
console.log('✅ 时区转换器已实现');
console.log('\\n🎉 所有 4 个核心工具已完成！');
