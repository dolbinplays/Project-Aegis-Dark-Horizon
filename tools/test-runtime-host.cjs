const test=require('node:test'),assert=require('node:assert/strict');
const {validateRuntimeHost}=require('./validate-runtime-host.cjs');
const valid=`<body data-aegis-host-build="test"><iframe id="aegis-runtime"></iframe><script id="aegis-runtime-payload" type="application/octet-stream">YWJj</script><script>function bootRuntime(){document.getElementById('aegis-runtime');}bootRuntime();</script></body>`;
test('valid launch shell passes structural and script checks',()=>assert.deepEqual(validateRuntimeHost(valid),[]));
test('0050 corrupted script boundary is rejected',()=>{
 const corrupt=valid.replace('<script id="aegis-runtime-payload"','<scrip<script id="aegis-runtime-payload"').replace('</script><script>','</script>pt>');
 assert.ok(validateRuntimeHost(corrupt).some(message=>message.includes('bootstrap')));
});
test('missing payload, iframe, or bootstrap cannot pass silently',()=>{
 for(const pattern of [/<iframe.*?<\/iframe>/,/<script id=.*?<\/script>/,/<script>.*?<\/script>/])assert.ok(validateRuntimeHost(valid.replace(pattern,'' )).length);
});
