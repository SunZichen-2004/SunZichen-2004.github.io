(function () {
  'use strict';
  const original = window.SITE_CONTENT;
  const storageKey = 'zichen-personal-site-draft-v1';
  const clone = x => JSON.parse(JSON.stringify(x));
  let data = clone(original), active = 'profile', previewPage = 'home', timer;
  const groups = {
    profile: ['基本信息', ['name','tagline','email','github','scholar','website','updated','photo','bio','interests']],
    publications: ['已发表论文', ['publications']],
    manuscripts: ['未发表稿件', ['manuscripts']],
    education: ['教育', ['education']],
    experience: ['研究经历', ['experience']],
    awards: ['奖项', ['awards']],
    skills: ['技能', ['skills']]
  };
  const labels = {photo:'照片路径（上传到 assets/ 目录）',name:'姓名',tagline:'研究方向副标题',email:'电子邮箱',github:'GitHub 链接',scholar:'Google Scholar 链接',website:'网站地址',updated:'更新日期',bio:'个人简介（每项一段）',interests:'研究兴趣',publications:'已发表论文',manuscripts:'未发表稿件',education:'教育经历',experience:'研究经历',awards:'奖项',skills:'技能',title:'标题',authors:'作者',venue:'期刊 / 稿件状态',details:'卷期、页码或补充信息',year:'年份',doi:'DOI',url:'论文链接',note:'备注',abstract:'摘要（可留空）',code:'代码链接（可留空）',institution:'学校',degree:'学位',department:'院系',dates:'时间',courses:'课程',group:'课题组 / 机构',role:'角色',points:'经历描述'};
  const status = document.getElementById('status');
  const prototypes = {publications:clone(original.publications[0]),manuscripts:clone(original.manuscripts[0]),experience:clone(original.experience[0])};
  function valid(x) { return x && typeof x.name === 'string' && Array.isArray(x.bio) && Array.isArray(x.publications) && Array.isArray(x.manuscripts) && Array.isArray(x.experience) && x.education && Array.isArray(x.awards) && Array.isArray(x.interests) && x.skills; }
  try { const draft = JSON.parse(localStorage.getItem(storageKey)); if(valid(draft)) data=draft; } catch (_) {}
  function persist() { try { localStorage.setItem(storageKey,JSON.stringify(data));status.textContent='草稿已保存在当前浏览器'; } catch (_) {status.textContent='草稿在内存中，请下载以保存';} }
  function at(path) { return path.reduce((obj,k)=>obj[k],data); }
  function set(path,value) {const parent=at(path.slice(0,-1));parent[path[path.length-1]]=value;persist();clearTimeout(timer);timer=setTimeout(updatePreview,250);}
  function blank(value) {if(Array.isArray(value)) return [];if(value && typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,blank(v)]));return '';}
  function button(label, action) {const b=document.createElement('button');b.type='button';b.textContent=label;b.addEventListener('click',action);return b;}
  function field(key,value,path) {
    const container=document.createElement('div');
    if(Array.isArray(value)) {
      const heading=document.createElement('h3');heading.textContent=labels[key]||key;heading.style.fontSize='14px';container.append(heading);
      value.forEach((item,i)=>{
        const itemBox=document.createElement('div');itemBox.className='array-item';
        const row=document.createElement('div');row.className='item-heading';const name=document.createElement('strong');name.textContent=(item && item.title ? item.title.slice(0,45) : (labels[key]||key))+' · '+(i+1);row.append(name);
        const controls=document.createElement('div');controls.className='item-buttons';
        for(const [label,delta] of [['上移',-1],['下移',1]]){const b=button(label,()=>{[value[i],value[i+delta]]=[value[i+delta],value[i]];persist();renderFields();updatePreview();});b.disabled=i+delta<0||i+delta>=value.length;controls.append(b);}
        controls.append(button('删除',()=>{value.splice(i,1);persist();renderFields();updatePreview();}));row.append(controls);itemBox.append(row,field(key,item,[...path,i]));container.append(itemBox);
      });
      const add=button('+ 添加一项',()=>{value.push(blank(value[0]??prototypes[key]??''));persist();renderFields();updatePreview();});add.className='add';container.append(add);
    } else if(value && typeof value==='object') {
      for(const [k,v] of Object.entries(value)) container.append(field(k,v,[...path,k]));
    } else {
      const label=document.createElement('label');label.className='field';const span=document.createElement('span');span.textContent=labels[key]||key;
      const isLong=String(value).length>90||['bio','points','abstract'].includes(key);
      const input=document.createElement(isLong?'textarea':'input');if(!isLong)input.type='text';input.value=value??'';input.addEventListener('input',()=>set(path,input.value));label.append(span,input);container.append(label);
    }
    return container;
  }
  function renderFields() {
    const box=document.getElementById('fields');box.replaceChildren();
    for(const key of groups[active][1])box.append(field(key,data[key],[key]));
    document.querySelectorAll('#tabs button').forEach(b=>b.setAttribute('aria-current',String(b.dataset.tab===active)));
  }
  function updatePreview() {
    const frame=document.getElementById('preview');
    let y=0;try{y=frame.contentWindow.scrollY;}catch(_){}
    frame.onload=()=>{try{frame.contentWindow.scrollTo(0,y);}catch(_){}};
    frame.srcdoc=SiteRender[previewPage](data);
  }
  for(const [key,[label]] of Object.entries(groups)) {const b=button(label,()=>{active=key;renderFields();});b.dataset.tab=key;document.getElementById('tabs').append(b);}
  document.getElementById('export').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='content.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);status.textContent='已下载；上传到 GitHub 仓库根目录并提交后生效';});
  document.getElementById('import').addEventListener('change',async event=>{const file=event.target.files[0];if(!file)return;try{const next=JSON.parse(await file.text());if(!valid(next))throw new Error('不是本站的 content.json 格式');data=next;persist();renderFields();updatePreview();}catch(error){status.textContent='导入失败：'+error.message;}event.target.value='';});
  document.getElementById('reset').addEventListener('click',()=>{data=clone(original);persist();renderFields();updatePreview();status.textContent='已恢复网站当前内容（本地草稿）';});
  for(const p of ['home','cv']) document.getElementById('preview-'+p).addEventListener('click',()=>{previewPage=p;for(const q of ['home','cv'])document.getElementById('preview-'+q).setAttribute('aria-pressed',String(p===q));updatePreview();});
  renderFields();updatePreview();status.textContent='修改后可下载 content.json';
})();
