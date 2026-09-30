(function(root){
'use strict';
let folder=null,busy=false;
const FILE='aegis-authored-content',SCHEMA='aegis-authored-content-v1';
async function connect(){
  if(!root.showDirectoryPicker)throw Error('Use Chrome or Edge on localhost/HTTPS to write project files. JSON export remains available.');
  const picked=await root.showDirectoryPicker({mode:'readwrite'});
  const src=await picked.getDirectoryHandle('src');
  const manifest=JSON.parse(await (await (await src.getFileHandle('manifest.json')).getFile()).text());
  if(!manifest.currentBuild)throw Error('Choose the Project Aegis repository root.');
  await (await picked.getDirectoryHandle('assets')).getDirectoryHandle('data');
  folder=picked;return folder;
}
async function read(dir,name){try{return await (await (await dir.getFileHandle(name)).getFile()).text();}catch(e){if(e.name==='NotFoundError')return null;throw e;}}
async function put(dir,name,text){const stream=await (await dir.getFileHandle(name,{create:true})).createWritable();try{await stream.write(text);await stream.close();}catch(e){await stream.abort?.().catch(()=>{});throw e;}}
async function writeFiles(dir,files){
  if(busy)throw Error('Another project write is still running.');busy=true;
  const originals=new Map(),written=[];
  try{
    for(const [name] of files){const old=await read(dir,name);originals.set(name,old);if(old!==null)await put(dir,name+'.backup',old);}
    for(const [name,text] of files){written.push(name);await put(dir,name,text);if(await read(dir,name)!==text)throw Error('Read-back verification failed: '+name);}
  }catch(e){let failed=false;for(const name of written.reverse()){try{const old=originals.get(name);if(old===null)await dir.removeEntry(name);else await put(dir,name,old);}catch{failed=true;}}throw Error(e.message+(failed?' Restore the .backup files before continuing.':' Previous project files restored.'));}
  finally{busy=false;}
}
async function writeSection(section,value){
  if(!['poses','buildingLayout'].includes(section))throw Error('Unknown authored content type.');
  if(!folder)await connect();
  const data=await (await folder.getDirectoryHandle('assets')).getDirectoryHandle('data');
  const raw=await read(data,FILE+'.json');
  const payload=raw?JSON.parse(raw):{schema:SCHEMA,poses:{},buildingLayout:null};
  if(payload.schema!==SCHEMA)throw Error('Unrecognized project content. Nothing was overwritten.');
  if(section==='poses')payload.poses={...payload.poses,...value};else payload.buildingLayout=value;
  const json=JSON.stringify(payload,null,2)+'\n';
  await writeFiles(data,[[FILE+'.json',json],[FILE+'.js','window.AEGIS_AUTHORED_CONTENT='+json.trim()+';\n']]);
  return 'Verified project files in '+folder.name+'. Commit and publish them to include these changes in game updates.';
}
root.AEGIS_PROJECT_AUTHORING={connect,read,writeFiles,writeSection};
})(typeof window==='undefined'?globalThis:window);
