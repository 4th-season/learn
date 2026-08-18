(function(){
'use strict';
var app=document.getElementById('slp-app');
if(!app)return;

function injectStyle(){
  if(document.getElementById('slp-v6-style'))return;
  var css=''
  +'.slp-bar.screen i{background:linear-gradient(90deg,#176a67,#48a68f)}'
  +'.slp-bar.day i{background:linear-gradient(90deg,#d19a20,#f1c65b)}'
  +'.slp-dash-note{margin-top:14px;padding:11px 13px;border-radius:10px;background:#f6f9fa;color:#63767c;font-size:12px}'
  +'.slp-screen-review{margin-top:22px;padding:19px;border:1px solid #cddfdb;border-radius:17px;background:linear-gradient(145deg,#f3faf7,#f9fcfb)}'
  +'.slp-review-head{padding-bottom:13px;border-bottom:1px solid #dbe8e4}'
  +'.slp-review-head>span{display:inline-flex;padding:5px 9px;border-radius:999px;background:#dcefeb;color:#17625f;font-size:11px;font-weight:900;letter-spacing:.03em}'
  +'.slp-review-head h3{margin:8px 0 4px;color:#174b59;font-size:20px;letter-spacing:-.03em}'
  +'.slp-review-head p{margin:0;color:#66787e;font-size:13px}'
  +'.slp-screen-review .slp-checks{margin-top:13px}'
  +'.slp-structure-notes{margin-top:18px}'
  +'.slp-plan-progress{display:grid;grid-template-columns:auto 1fr;gap:10px 16px;align-items:center;margin-top:13px;padding:16px;border:1px solid #e3cf88;border-radius:15px;background:#fff9e7}'
  +'.slp-plan-progress small{display:block;color:#7b6a38;font-size:11px;font-weight:850}'
  +'.slp-plan-progress strong{display:block;color:#9a7015;font-size:27px;line-height:1.1}'
  +'.slp-plan-progress .slp-bar{margin:0}'
  +'.slp-plan-progress p{grid-column:1/-1;margin:0;color:#6e654f;font-size:13px}'
  +'.slp-final-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:20px}'
  +'.slp-final-grid .slp-final{margin-top:0}'
  +'.slp-final.alt{background:linear-gradient(145deg,#6f571b,#9f7920)}'
  +'.slp-final.alt strong{color:#fff3ba}'
  +'@media(max-width:720px){.slp-final-grid{grid-template-columns:1fr}.slp-plan-progress{grid-template-columns:1fr}.slp-plan-progress p{grid-column:auto}}'
  +'@media print{.slp-screen-review,.slp-plan-progress,.slp-page-tools,.slp-nav,.slp-sources,.slp-dashboard,.slp-overview,.slp-notice,.slp-cover{display:none!important}}';
  var st=document.createElement('style');st.id='slp-v6-style';st.textContent=css;document.head.appendChild(st);
}
function directChecks(page){
  [].slice.call(page.children).forEach(function(el){if(el.classList&&el.classList.contains('slp-checks'))el.remove()});
}
function reviewMarkup(num,items,intro,title){
  var html='<section class="slp-screen-review"><div class="slp-review-head"><span>화면 완료 체크</span><h3>'+(title||'이 화면에서 확인할 것')+'</h3><p>'+(intro||'핵심 내용을 읽은 뒤 아래 항목을 실제로 확인하면 이 화면이 완료됩니다.')+'</p></div><div class="slp-checks compact">';
  items.forEach(function(text,i){var id='slp-screen-'+String(num).padStart(2,'0')+'-'+String(i+1).padStart(2,'0');html+='<label class="slp-check" for="'+id+'"><input type="checkbox" id="'+id+'" data-screen-check><span>'+text+'</span></label>'});
  return html+'</div></section>';
}
function addReview(page,num,items,intro,title){
  var old=page.querySelector('.slp-screen-review');if(old)old.remove();
  page.insertAdjacentHTML('beforeend',reviewMarkup(num,items,intro,title));
}
function rebuildDom(){
  injectStyle();
  var board=app.querySelector('.slp-dashboard');
  if(board)board.innerHTML='<div class="slp-dash-head"><div><small>현재 화면</small><strong id="slp-current-title">01. 현재 과부하 진단</strong></div><b><span id="slp-current-page">1</span>/10</b></div><div class="slp-progress-label"><span>화면 위치</span><strong id="slp-page-percent">10%</strong></div><div class="slp-bar"><i id="slp-page-bar"></i></div><div class="slp-progress-label"><span>10개 화면 완료</span><strong id="slp-screen-count">0 / 10</strong></div><div class="slp-bar screen"><i id="slp-screen-bar"></i></div><div class="slp-progress-label"><span>14일 실행 항목</span><strong id="slp-day-count">0 / 56</strong></div><div class="slp-bar day"><i id="slp-day-bar"></i></div><div class="slp-dash-note">진단 문항은 증상 확인용이며 완료율에 포함하지 않습니다. 화면 완료 체크와 14일 실행 체크를 따로 계산합니다.</div><div class="slp-dash-actions"><button data-action="open-toc">목차</button><button data-action="open-timer">타이머</button><button data-action="reset-all">전체 기록 초기화</button></div>';

  var p1=document.getElementById('slp-page-1');
  [].slice.call(p1.querySelectorAll('.slp-diag input')).forEach(function(x){x.setAttribute('data-diag','')});
  addReview(p1,1,['현재 나타나는 신호의 개수와 강도를 확인했다.','10분·30분·80분 중 오늘의 권장 시작 단위를 확인했다.','학습 계획보다 도움을 먼저 받아야 하는 기준을 읽었다.'],'진단 체크는 증상 수를 세기 위한 항목입니다. 아래 완료 체크만 화면 완료율에 반영됩니다.');

  var p2=document.getElementById('slp-page-2'),key=p2.querySelector('.slp-key');
  if(!p2.querySelector('.slp-structure-notes'))key.insertAdjacentHTML('beforebegin','<div class="slp-form-grid two slp-structure-notes"><label>오늘 가장 먼저 낮출 부담<textarea data-note="structure-first" rows="3" placeholder="예: 어려운 지문 선투입, 수면 시각 변동"></textarea></label><label>내 악순환이 시작되는 지점<textarea data-note="structure-cycle" rows="3" placeholder="예: 첫 문제 시작 지연 → 계획표 수정"></textarea></label></div>');
  addReview(p2,2,['작업기억·시간압·불안·수면 중 내 상황과 가장 가까운 요인을 하나 골랐다.','시작 지연부터 자책까지 이어지는 악순환에서 내 반복 지점을 찾았다.','오늘 정보량·시간 상한·시작 절차 중 하나를 줄이기로 정했다.','슬럼프를 의지 부족 하나로 단정하지 않기로 했다.']);

  var p3=document.getElementById('slp-page-3');directChecks(p3);addReview(p3,3,['반드시 할 것·하면 좋은 것·오늘 하지 않을 것을 각각 한 줄로 적었다.','미니 과제를 한 종류만 선택했다.','10분이 끝난 뒤 공부량을 즉시 늘리지 않고 완료를 인정했다.','다음 행동을 한 문장으로 정했다.']);
  var p4=document.getElementById('slp-page-4');addReview(p4,4,['오늘 해결할 과제를 지문 1개 또는 개념 1개로 제한했다.','본학습 전에 무엇을 찾아야 하는지 한 문장으로 예고했다.','자료를 덮고 핵심과 근거를 직접 회상했다.','다음 세션에서 바꿀 행동을 하나만 적었다.']);
  var p5=document.getElementById('slp-page-5');directChecks(p5);addReview(p5,5,['최근 모의고사에서 검증된 개인 풀이 순서를 적었다.','과투입 상한과 스킵 기준을 숫자 또는 행동으로 구체화했다.','점수보다 시간 배치와 판단 지연을 먼저 회고했다.','다음 실전에서 유지할 규칙을 하나만 남겼다.']);
  var p6=document.getElementById('slp-page-6');addReview(p6,6,['학습 직후 자료를 덮고 논지·근거·오답 이유를 회상했다.','같은 내용을 하루 뒤 짧게 다시 꺼낼 시점을 정했다.','언제·어디서·무엇을 펼칠지 시작 문장을 완성했다.','틀린 회상 전체를 다시 공부하지 않고 틀린 부분만 교정했다.']);
  var p7=document.getElementById('slp-page-7');directChecks(p7);addReview(p7,7,['기상 시각을 전날과 크게 다르게 바꾸지 않았다.','취침 준비를 시작할 시각을 정했다.','늦은 카페인·장시간 낮잠·잠들기 직전 고난도 과제를 점검했다.','국어 시험 시간대에 깨어 집중하는 연습을 유지했다.']);
  var p8=document.getElementById('slp-page-8'),filters=p8.querySelector('.slp-filters');
  if(!p8.querySelector('.slp-plan-progress'))filters.insertAdjacentHTML('afterend','<div class="slp-plan-progress"><div><small>14일 실행률</small><strong id="slp-plan-percent">0%</strong></div><div class="slp-bar day"><i id="slp-plan-bar"></i></div><p id="slp-plan-message">시작일을 저장하고 각 날짜의 실행 항목을 체크하세요.</p></div>');
  addReview(p8,8,['계획 시작일을 저장하고 D-14부터 D-1까지 날짜가 표시되는지 확인했다.','리듬 복구·약점 보정·실전 고정·피로 감량의 네 단계를 구분했다.','하루를 놓쳐도 밀린 분량을 몰아서 보충하지 않는 규칙을 정했다.'],'아래 체크는 계획표 사용 방법을 이해했는지 확인합니다. 날짜별 실행 항목은 별도의 14일 실행률로 계산됩니다.');
  var p9=document.getElementById('slp-page-9');directChecks(p9);addReview(p9,9,['D-3부터 새 교재·새 강의·새 풀이 순서를 시작하지 않기로 했다.','D-2 학습을 30분 이내의 가벼운 회상으로 제한했다.','D-1에는 밀린 분량이나 새로운 오답을 확장하지 않기로 했다.','시험 당일 첫 행동과 준비물을 확인했다.']);
  var p10=document.getElementById('slp-page-10'),oldFinal=p10.querySelector('.slp-final'),warning=p10.querySelector('.slp-warning');if(oldFinal)oldFinal.remove();
  addReview(p10,10,['첫 과제와 시작 장소·시각을 적었다.','과투입 경고 신호와 스킵 기준을 적었다.','회상 방법과 수면 기준을 적었다.','불안할 때 줄일 행동과 끝까지 유지할 행동을 적었다.'],'각 칸을 길게 채우는 것보다 불안할 때 그대로 따라 할 수 있을 만큼 구체적으로 적는 것이 중요합니다.','최종 프로토콜을 한 장으로 정리했는가');
  var review=p10.querySelector('.slp-screen-review');warning.parentNode.insertBefore(review,warning);
  warning.insertAdjacentHTML('beforebegin','<div class="slp-final-grid"><div class="slp-final"><small>10개 화면 완료율</small><strong id="slp-final-screen-percent">0%</strong><p id="slp-final-message">화면별 완료 체크를 채우면 진행 상태가 표시됩니다.</p></div><div class="slp-final alt"><small>14일 실행률</small><strong id="slp-final-day-percent">0%</strong><p id="slp-final-day-message">날짜별 실행 항목은 계획표에서 별도로 누적됩니다.</p></div></div>');
  var tools=app.querySelector('.slp-page-tools'),btns=tools?tools.querySelectorAll('button'):[];if(btns.length>1){btns[0].textContent='현재 화면 완료 체크';btns[1].textContent='현재 화면 완료 해제'}
}

rebuildDom();
var pages=[].slice.call(app.querySelectorAll('.slp-page'));
var KEY='csat-slump-14days-v6:'+location.pathname;
var state={page:1,checks:{},notes:{},date:'',diag:{}};
var preferred=0,timer={base:600,sec:600,id:null};
var $=function(id){return document.getElementById(id)};
var all=function(sel,root){return [].slice.call((root||app).querySelectorAll(sel))};
function pad(n){return String(n).length<2?'0'+n:String(n)}
function localIso(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function parseDate(v){var m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)return null;var d=new Date(+m[1],+m[2]-1,+m[3]);return d.getFullYear()==+m[1]&&d.getMonth()==+m[2]-1&&d.getDate()==+m[3]?d:null}
function screenChecks(root){return all('[data-screen-check]',root)}
function dayChecks(){return all('#slp-days input[type=checkbox]')}
function diagnosticChecks(){return all('[data-diag]')}
function notes(){return all('[data-note]')}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function read(){try{var v=JSON.parse(localStorage.getItem(KEY)||'{}');state.page=+v.page||1;state.checks=v.checks||{};state.notes=v.notes||{};state.date=v.date||'';state.diag=v.diag||{}}catch(e){}}
function clamp(n){return Math.max(1,Math.min(pages.length,+n||1))}
function syncLabel(x){var l=x.closest('.slp-check');if(l)l.classList.toggle('checked',x.checked)}
function restore(){screenChecks().concat(dayChecks()).forEach(function(x){x.checked=!!state.checks[x.id];syncLabel(x)});notes().forEach(function(x){x.value=state.notes[x.getAttribute('data-note')]||''});diagnosticChecks().forEach(function(x,i){x.checked=!!state.diag[i];syncLabel(x)});var date=$('slp-start-date');if(date)date.value=state.date||'';updateDates();updateDiagnosis();markDays()}
function pageScreenChecks(n){return screenChecks(pages[n-1])}
function pageDone(n){var xs=pageScreenChecks(n);return xs.length>0&&xs.every(function(x){return x.checked})}
function completedPages(){return pages.filter(function(p,i){return pageDone(i+1)}).length}
function buildToc(){var box=$('slp-toc');box.innerHTML='';pages.forEach(function(p,i){var b=document.createElement('button');b.className='slp-toc-button';b.type='button';b.setAttribute('data-page-target',i+1);b.innerHTML='<b>'+pad(i+1)+'</b><span>'+p.dataset.title.replace(/^\d+\.\s*/,'')+'</span><small>미완료</small>';box.appendChild(b)})}
function updateToc(){all('.slp-toc-button').forEach(function(b,i){var done=pageDone(i+1);b.classList.toggle('current',i+1===state.page);b.classList.toggle('complete',done);b.querySelector('small').textContent=done?'완료':'미완료'})}
function updateProgress(){var cp=completedPages(),screenPct=Math.round(cp/pages.length*100),ds=dayChecks(),dd=ds.filter(function(x){return x.checked}).length,dayPct=ds.length?Math.round(dd/ds.length*100):0,pagePct=Math.round(state.page/pages.length*100);$('slp-current-page').textContent=state.page;$('slp-current-title').textContent=pages[state.page-1].dataset.title;$('slp-page-percent').textContent=pagePct+'%';$('slp-page-bar').style.width=pagePct+'%';$('slp-screen-count').textContent=cp+' / '+pages.length+' · '+screenPct+'%';$('slp-screen-bar').style.width=screenPct+'%';$('slp-day-count').textContent=dd+' / '+ds.length+' · '+dayPct+'%';$('slp-day-bar').style.width=dayPct+'%';if($('slp-plan-percent'))$('slp-plan-percent').textContent=dayPct+'%';if($('slp-plan-bar'))$('slp-plan-bar').style.width=dayPct+'%';if($('slp-plan-message'))$('slp-plan-message').textContent=dayPct===100?'14일 실행 항목을 모두 완료했습니다.':dayPct>=50?'절반 이상 진행했습니다. 남은 날짜는 밀어붙이기보다 최소 단위로 이어가세요.':dayPct>0?'실행 중입니다. 하루를 놓쳐도 다음 날짜의 최소 단위부터 재개하세요.':'시작일을 저장하고 각 날짜의 실행 항목을 체크하세요.';if($('slp-final-screen-percent'))$('slp-final-screen-percent').textContent=screenPct+'%';if($('slp-final-day-percent'))$('slp-final-day-percent').textContent=dayPct+'%';if($('slp-final-message'))$('slp-final-message').textContent=screenPct===100?'10개 화면의 핵심 확인을 모두 마쳤습니다.':screenPct>=70?'핵심 구조가 거의 완성되었습니다. 미완료 화면만 다시 확인하세요.':screenPct>0?'화면별 완료 체크를 이어가세요.':'화면별 완료 체크를 채우면 진행 상태가 표시됩니다.';if($('slp-final-day-message'))$('slp-final-day-message').textContent=dayPct===100?'14일 실행 기록이 모두 채워졌습니다.':dayPct>0?'계획표의 날짜별 실행이 별도로 누적되고 있습니다.':'날짜별 실행 항목은 계획표에서 별도로 누적됩니다.';$('slp-nav-page').textContent=state.page+' / '+pages.length;$('slp-prev').disabled=state.page===1;$('slp-next').disabled=state.page===pages.length;updateToc();markDays()}
function showPage(n,opt){state.page=clamp(n);pages.forEach(function(p,i){var active=i===state.page-1;p.classList.toggle('is-active',active);p.setAttribute('aria-hidden',active?'false':'true')});try{history.replaceState(null,'',location.pathname+location.search+'#slp-page-'+state.page)}catch(e){}updateProgress();save();if(opt&&opt.scroll)$('slp-current-title').scrollIntoView({behavior:'smooth',block:'center'})}
function openModal(id){$(id).hidden=false;var b=$(id).querySelector('button');if(b)b.focus()}
function closeModal(id){$(id).hidden=true}
function updateDiagnosis(){var xs=diagnosticChecks(),n=xs.filter(function(x){return x.checked}).length,m='30분 회복',t='과제를 한 단위로 줄이고 30분 세션부터 시작하세요.';preferred=4;if(n>=6){m='10분 재시동';t='과부하 신호가 많습니다. 오늘은 10분 루틴 하나를 끝내는 것을 성공 기준으로 두세요.';preferred=3}else if(n<=2&&n>0){m='80분 재현 가능';t='기본 기능은 비교적 유지됩니다. 검증된 개인 순서로 80분 실전을 재현하세요.';preferred=5}else if(n===0){m='항목을 체크하세요';t='체크 결과에 따라 오늘의 시작 단위를 제안합니다.';preferred=0}$('slp-mode').textContent=m;$('slp-mode-text').textContent=t;$('slp-mode-button').disabled=!preferred}
function applyDate(value,announce){var d=parseDate(value);if(!d){$('slp-date-status').textContent='날짜를 선택해 주세요';if(announce)alert('달력에서 날짜를 선택한 뒤 저장 버튼을 눌러 주세요.');return false}state.date=localIso(d);$('slp-start-date').value=state.date;$('slp-date-status').textContent=state.date+' 저장됨';updateDates();save();return true}
function updateDates(){var base=parseDate(state.date);all('[data-day-date]').forEach(function(t){if(!base){t.textContent='날짜 미설정';return}var d=+t.getAttribute('data-day-date'),x=new Date(base.getFullYear(),base.getMonth(),base.getDate()+(14-d));t.textContent=(x.getMonth()+1)+'월 '+x.getDate()+'일'})}
function markDays(){all('.slp-day').forEach(function(c){var xs=all('input[type=checkbox]',c);c.classList.toggle('done',xs.length>0&&xs.every(function(x){return x.checked}))})}
function filterDays(f,b){all('[data-filter]').forEach(function(x){x.classList.toggle('is-active',x===b)});all('.slp-day').forEach(function(c){var d=+c.dataset.day,show=f==='all';if(!show){var p=f.split('-').map(Number);show=d<=p[0]&&d>=p[1]}c.style.display=show?'':'none'})}
function renderTimer(){$('slp-clock').textContent=pad(Math.floor(timer.sec/60))+':'+pad(timer.sec%60)}
function stopTimer(){if(timer.id){clearInterval(timer.id);timer.id=null}}
function selectTimer(m,b){stopTimer();timer.base=timer.sec=m*60;all('[data-minutes]').forEach(function(x){x.classList.toggle('active',x===b)});$('slp-timer-label').textContent=m+'분 '+(m===10?'응급 재시동':m===30?'회복 루틴':'실전 재현');renderTimer()}
function handle(a,target){if(a==='start')showPage(1,{scroll:true});else if(a==='go-calendar')showPage(8,{scroll:true});else if(a==='prev')showPage(state.page-1,{scroll:true});else if(a==='next')showPage(state.page+1,{scroll:true});else if(a==='open-toc')openModal('slp-toc-modal');else if(a==='close-toc')closeModal('slp-toc-modal');else if(a==='open-timer'){var m=+(target&&target.dataset.minutes||10);openModal('slp-timer-modal');selectTimer(m,app.querySelector('[data-minutes="'+m+'"]'))}else if(a==='close-timer')closeModal('slp-timer-modal');else if(a==='apply-mode'&&preferred)showPage(preferred,{scroll:true});else if(a==='apply-date')applyDate($('slp-start-date').value,true);else if(a==='set-today')applyDate(localIso(new Date()),false);else if(a==='print-plan'){all('.slp-day').forEach(function(c){c.style.display=''});showPage(8,{scroll:false});setTimeout(function(){window.print()},120)}else if(a==='check-page'){pageScreenChecks(state.page).forEach(function(x){x.checked=true;state.checks[x.id]=true;syncLabel(x)});save();updateProgress()}else if(a==='reset-page'){pageScreenChecks(state.page).forEach(function(x){x.checked=false;state.checks[x.id]=false;syncLabel(x)});save();updateProgress()}else if(a==='reset-all'){if(confirm('모든 화면 완료 체크·14일 실행 기록·메모·날짜를 초기화하시겠습니까?')){try{localStorage.removeItem(KEY)}catch(e){}location.reload()}}else if(a==='timer-start'){if(timer.id||timer.sec<=0)return;timer.id=setInterval(function(){timer.sec--;renderTimer();if(timer.sec<=0){stopTimer();alert('타이머가 끝났습니다.')}},1000)}else if(a==='timer-pause')stopTimer();else if(a==='timer-reset'){stopTimer();timer.sec=timer.base;renderTimer()}}
app.addEventListener('click',function(e){var t=e.target&&e.target.nodeType===1?e.target:e.target&&e.target.parentElement;if(!t)return;var a=t.closest('[data-action]');if(a){handle(a.dataset.action,a);return}var p=t.closest('[data-page-target]');if(p){closeModal('slp-toc-modal');showPage(+p.dataset.pageTarget,{scroll:true});return}var f=t.closest('[data-filter]');if(f){filterDays(f.dataset.filter,f);return}var m=t.closest('[data-minutes]');if(m&&m.closest('.slp-timer-presets'))selectTimer(+m.dataset.minutes,m)});
app.addEventListener('change',function(e){var x=e.target;if(x.matches('[data-screen-check]')||(x.matches('input[type=checkbox]')&&x.closest('#slp-days'))){state.checks[x.id]=x.checked;syncLabel(x);save();updateProgress();return}if(x.matches('[data-diag]')){diagnosticChecks().forEach(function(d,i){state.diag[i]=d.checked});syncLabel(x);save();updateDiagnosis();return}});
app.addEventListener('input',function(e){var x=e.target;if(x.matches('[data-note]')){state.notes[x.dataset.note]=x.value;save()}});
var date=$('slp-start-date');if(date){['input','change','blur'].forEach(function(ev){date.addEventListener(ev,function(){if(date.value)applyDate(date.value,false)})})}
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeModal('slp-toc-modal');closeModal('slp-timer-modal')}});
window.addEventListener('hashchange',function(){var m=location.hash.match(/#slp-page-(\d+)/);if(m)showPage(+m[1],{scroll:true})});
function environment(){var ua=navigator.userAgent||'',mobile=/Android|iPhone|iPad|iPod|Mobile/i.test(ua),inapp=/KAKAOTALK|NAVER|DaumApps|Instagram|FBAN|FBAV|; wv\)|\bwv\b/i.test(ua);$('slp-device').textContent=inapp?'인앱 브라우저':mobile?'모바일 브라우저':'PC 브라우저';try{var k='__slp';localStorage.setItem(k,'1');localStorage.removeItem(k);$('slp-storage').textContent='자동 저장 가능'}catch(e){$('slp-storage').textContent='저장 제한'}}
read();buildToc();restore();environment();app.setAttribute('data-ready','true');var hm=location.hash.match(/#slp-page-(\d+)/);if(hm)state.page=clamp(hm[1]);showPage(state.page,{scroll:false});selectTimer(10,app.querySelector('[data-minutes="10"]'));
})();