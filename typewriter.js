export function randomFromRange(min, max, dp){
  let range = max - min;
  let factor = dp > 0 ? 10 * dp : 1;

  let randNum = Math.random() * range;
  let randNumInRange = randNum + min;
  let randToDp;
  if(factor == 1){
    randToDp = Math.floor(randNumInRange);
  }else{
    let temp = randNumInRange * factor;
    randToDp = Math.floor(temp) / factor;
  }
  return randToDp;
}

export function timer(time){
  return new Promise(
    (res, rej) => {
      setTimeout(
        () => {
          res("complete")
        },
        time * 1000
      )
    }
  )
}

export class Typewriter{
  allOptions = {
    revealDuration : 10,
    revealDurationNoise: 1.5,
    typeSpeed : 0.2,
    clearSpeed : 0.1,
    cursor : true,
    firstWordTyped : true,
    cursor : "Vertical Bar"
  }
  constructor(
    elem, list, opt = null
  )
  {
    this.element = elem;
    if (this.element === undefined || this._element === null){
      throw new Error("Could not locate the typewriter element within the DOM");
    }

    this.wordList = list;
    if (this.wordList === null){
      throw new Error("Typewriter requires either an array or string parameter");
    }

    this.selectedOptions = opt;
    if (this.selectedOptions == false){
      throw new Error("invalid Typewriter options");
    }

    this.cursor = elem;
    
    this.__typingIn = true;
    if (this.selectedOptions.firstWordTyped){
      this.element.textContent = this.wordList[0];
      this.setCursorState(true);
      this.__typingIn = false;
    }

    this.__typewriterActive = true;
    this.__currentWordindex = 0;
  }

  set element(val){
    let target = document.querySelector(val);
    while(target.firstChild){
      target.removeChild(target.firstchild);
    }
    
    let typewriter = document.createElement("span");
    target.appendChild(typewriter);
    this._element = typewriter;

    // this._element = "hello"
  }

  get element(){
    return this._element;
  }
  
  set cursor(val){
    let parent = document.querySelector(val);
    let __cur = this.createCursor();
    parent.appendChild(__cur);
    this._cursor = parent.lastElementChild;
  }

  get cursor(){
    return this._cursor;
  }

  set wordList(val){
    if (Array.isArray(val)){
      this._wordList = val;
    }
    else if(typeof(val) === "string" || typeof(val) === "number"){
      this._wordList = [val];
    }
    else{
      this._wordList = null;
    }
  }

  get wordList(){
    return this._wordList;
  }

  set selectedOptions(val){
    if (this._selectedOptions === undefined || !this._selectedOptions){
      this._selectedOptions = this.allOptions;
    }
    
    if(typeof(val) === "object"){
      for(let key in val){
        this._selectedOptions[key] = val[key];
      }
    }else if(val !== null){
        this._selectedOptions = false;
    }
  }

  get selectedOptions(){
    return this._selectedOptions;
  }

  setCursorState(active){
    if(active){
      this.cursor.setAttribute("data-typewriterCusor", "blinking");
    }else{
      this.cursor.setAttribute("data-typewriterCusor", "static");
    }
  }
  nextWordIndex(){
    let wordListSize = this.wordList.length - 1;
    if(this.__currentWordindex >= wordListSize){
      this.__currentWordindex = 0;
    }else{
      this.__currentWordindex++;
    }
  }

  createCursor(){
    let cursor = document.createElement("span");
    cursor.classList.add("typewriterCursor");
    cursor.setAttribute("data-typewriterCusor", "static");

    let _cur = "\u007C";

    switch(this.selectedOptions.cursor){
      case "Vertical Bar":
        _cur = "\u007C";
        break;
      default:
        _cur = "\u007C";
        break;
    }

    let cursorContent = document.createTextNode(_cur);
    cursor.appendChild(cursorContent);

    return cursor;
  }

  typeAndClearText(_typedWord){
    if (this.__typingIn){
      timer(this.selectedOptions.typeSpeed).then(
        () => {
          let currentWordLength = _typedWord.length;
          let modifiedWord = this.wordList[this.__currentWordindex].slice(0, currentWordLength + 1);
          this.element.textContent = modifiedWord;
          this.controller();
        }
      )
    }
    else{
      timer(this.selectedOptions.clearSpeed).then(
        () => {
          let modifiedWord = _typedWord.slice(0, -1);
          this.element.textContent = modifiedWord;
          this.controller();
        }
      )
    }
  }
  controller(){
    // controls the typing if typing is true
    // checks which word in the wordlist is currently being typed
    // if the word is completely typed it declares typin false and begins deletion
    // else typein remains true and it adds the next letter
    if(this.__typewriterActive){
      let _typedWord = this.element.textContent;
      if(_typedWord == this.wordList[this.__currentWordindex]){
        this.__typingIn = false;
        this.setCursorState(true);
        let revealDuration;
        if(this.selectedOptions.revealDurationNoise != 0){
          let revealMin = this.selectedOptions.revealDuration - this.selectedOptions.revealDurationNoise;
          let revealMax = this.selectedOptions.revealDuration + this.selectedOptions.revealDurationNoise;
          revealDuration = randomFromRange(revealMin, revealMax, 1);
        }else{
          revealDuration = this.selectedOptions.revealDuration;
        }
        
        timer(revealDuration).then(
          () => {
            this.typeAndClearText(_typedWord);
            this.setCursorState(false);
          }
        )
      }else if(_typedWord.length == 0){
        this.setCursorState(true);
        let waitTime = randomFromRange(0, 3, 1);
        timer(waitTime).then(
          () => {
            this.__typingIn = true;
            this.nextWordIndex();
            this.setCursorState(false)
            this.typeAndClearText(_typedWord);
          }
        )
      }else{
        this.typeAndClearText(_typedWord);
      }
    }
  }

  init(){
    let wordListLength = this.wordList.length;

    this.controller();
  }
}