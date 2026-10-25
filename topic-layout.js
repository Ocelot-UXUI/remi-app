/* Pure layout operations shared by pointer and keyboard controls. */
(function (root) {
  const ids = ['materials', 'chat', 'reader'];
  const minimums = {materials:180, chat:320, reader:280};
  const defaults = () => ({order:ids.slice(),weights:{materials:224,chat:600,reader:376},hidden:[]});
  const normalize = value => {
    const base=defaults();
    if(!value || typeof value!=='object') return base;
    if(Array.isArray(value.order) && value.order.length===3 && new Set(value.order).size===3 && value.order.every(id=>ids.includes(id))) base.order=value.order.slice();
    for(const id of ids) if(Number.isFinite(value.weights?.[id]) && value.weights[id]>0 && value.weights[id]<10000) base.weights[id]=value.weights[id];
    if(Array.isArray(value.hidden)) base.hidden=[...new Set(value.hidden.filter(id=>id==='materials'||id==='reader'))];
    return base;
  };
  const allocate = (available, panes, weights) => {
    if(!panes.length) return [];
    const total=Math.max(available,panes.reduce((n,id)=>n+minimums[id],0));
    const result=new Array(panes.length).fill(0), open=new Set(panes.map((_,i)=>i));
    let remaining=total;
    while(open.size){
      const sum=[...open].reduce((n,i)=>n+(weights[panes[i]]||1),0);
      const constrained=[...open].filter(i=>remaining*(weights[panes[i]]||1)/sum<minimums[panes[i]]);
      if(!constrained.length){for(const i of open)result[i]=remaining*(weights[panes[i]]||1)/sum;break;}
      for(const i of constrained){result[i]=minimums[panes[i]];remaining-=result[i];open.delete(i);}
    }
    return result;
  };
  const resizePair = (widths, panes, index, delta) => {
    if(index<0 || index>=widths.length-1) return widths.slice();
    const result=widths.slice(), sum=widths[index]+widths[index+1];
    result[index]=Math.max(minimums[panes[index]],Math.min(widths[index]+delta,sum-minimums[panes[index+1]]));
    result[index+1]=sum-result[index];
    return result;
  };
  const move = (order, source, target) => {
    const a=order.indexOf(source),b=order.indexOf(target);
    if(a<0 || b<0 || a===b) return order.slice();
    const next=order.slice();next.splice(a,1);next.splice(b,0,source);return next;
  };
  root.RemiTopicLayout={ids,minimums,defaults,normalize,allocate,resizePair,move};
})(typeof window!=='undefined'?window:globalThis);
