const fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');
const js=fs.readFileSync(path.join(root,'assets','data','aegis-prop-library.js'),'utf8');
assert.ok(js.includes("v0.26.09.17.2120_PROP_TEST_GALLERY_INSTALLED_APP_URL_HOTFIX"));
assert.ok(js.includes("../../'+galleryName"));
assert.ok(js.includes("document?.scripts"));
assert.ok(!js.includes("new URL('./AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html',location.href)"));
function resolve(scriptSrc,topHref='about:srcdoc',base='about:srcdoc',loc='about:srcdoc'){
 const galleryName='AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html';let href='';
 try{if(scriptSrc)href=new URL('../../'+galleryName,scriptSrc).href;}catch{}
 if(!href){for(const b of [topHref,base,loc]){try{const c=new URL('./'+galleryName,b);if(['http:','https:','file:'].includes(c.protocol)){href=c.href;break;}}catch{}}}
 return href;
}
assert.equal(resolve('https://dolbinplays.github.io/Project-Aegis-Dark-Horizon/assets/data/aegis-prop-library.js'),'https://dolbinplays.github.io/Project-Aegis-Dark-Horizon/AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html');
assert.equal(resolve('file:///E:/JoshGameProjects/GitHub/Project-Aegis-Dark-Horizon/assets/data/aegis-prop-library.js'),'file:///E:/JoshGameProjects/GitHub/Project-Aegis-Dark-Horizon/AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html');
assert.equal(resolve('', 'https://dolbinplays.github.io/Project-Aegis-Dark-Horizon/index.html'),'https://dolbinplays.github.io/Project-Aegis-Dark-Horizon/AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html');
console.log('AEGIS 2120 URL hotfix tests passed.');
