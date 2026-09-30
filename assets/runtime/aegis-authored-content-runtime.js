(function(root){
'use strict';
const keys=['rootPosition','rootRotation','torso','neck','leftHip','rightHip','leftKnee','rightKnee','leftAnkle','rightAnkle','leftShoulder','rightShoulder','leftElbow','rightElbow','leftWrist','rightWrist','weaponPosition','weaponRotation'];
function validatePose(pose){
  if(!pose||!keys.every(key=>Array.isArray(pose[key])&&pose[key].length===3&&pose[key].every(n=>Number.isFinite(n)&&Math.abs(n)<=(key.endsWith('Position')?5:Math.PI*2+.01))))throw Error('Pose must contain finite XYZ positions and rotations in radians for every joint.');
  return Object.fromEntries(keys.map(key=>[key,pose[key].slice()]));
}
function meshGeometry(THREE,component){
  const vertices=component?.vertices,indices=component?.indices;
  if(!Array.isArray(vertices)||vertices.length<9||vertices.length>30000||vertices.length%3||!vertices.every(Number.isFinite)||!Array.isArray(indices)||indices.length>60000||indices.length%3||!indices.every(i=>Number.isInteger(i)&&i>=0&&i<vertices.length/3))return null;
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
root.AEGIS_AUTHORED_RUNTIME={validatePose,meshGeometry,pose(name){try{const content=root.AEGIS_AUTHORED_CONTENT;if(content?.schema!=='aegis-authored-content-v1'||!content.poses?.[name])return null;return validatePose(content.poses[name]);}catch{return null;}}};
})(typeof window==='undefined'?globalThis:window);
