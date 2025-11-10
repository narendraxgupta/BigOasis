(function(){
  function getCode(){
    try{
      if(window.monaco && window.monaco.editor){
        const models = window.monaco.editor.getModels();
        if(models && models.length){
          return models[0].getValue();
        }
      }
    }catch(e){}
    const ta = document.querySelector('textarea');
    if(ta){return ta.value;}
    const pre = document.querySelector('pre, code');
    return pre ? pre.textContent : '';
  }
  const ev = new CustomEvent('bigoasis-code', {detail: getCode()});
  document.dispatchEvent(ev);
})();