import * as tw from './typewriter.js';

let jsConceptsList = [
  "modules",
  "promises",
  "classes",
  "RNG"
];
let jsConceptsSettings = {
  revealDuration : 2,
  revealDurationNoise : 0.75,
  firstWordTyped : false
}

try{
  let jsConcepts = new tw.Typewriter(".jsConcepts", jsConceptsList, jsConceptsSettings);
  jsConcepts.init();
}
catch (err){
  console.warn("failed to create the typewriter object: " + err.message);
}
