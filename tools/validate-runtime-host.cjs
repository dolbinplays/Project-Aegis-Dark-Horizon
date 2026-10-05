const vm=require('node:vm');
function validateRuntimeHost(html){
 const failures=[];
 const scripts=[...html.matchAll(/<script\b([^<>]*)>([\s\S]*?)<\/script\s*>/gi)];
 const payloads=scripts.filter(m=>/\bid=["']aegis-runtime-payload["']/i.test(m[1]));
 if(payloads.length!==1)failures.push('Launch page must contain exactly one runtime payload.');
 const executable=scripts.filter(m=>! /\btype=["']application\/(?:octet-stream|json)["']/i.test(m[1])&&m[2].trim());
 const boots=executable.filter(m=>/\bbootRuntime\s*\(/.test(m[2])&&m[2].includes('aegis-runtime'));
 if(boots.length!==1)failures.push('Launch page is missing its executable game bootstrap script (blank-page risk).');
 if(!/<iframe\b[^>]*\bid=["']aegis-runtime["']/i.test(html))failures.push('Launch page is missing its game iframe.');
 for(const script of executable)try{new vm.Script(script[2]);}catch(error){failures.push('Launch script syntax: '+error.message);}
 return failures;
}
module.exports={validateRuntimeHost};
