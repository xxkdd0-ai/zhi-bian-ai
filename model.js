/* Steady-state educational model. Rates are expected values, not plant forecasts. */
(function(root){
  function calculate({speed,inspection,defect,rework},hours=8){
    if(![speed,inspection,defect,rework,hours].every(Number.isFinite)||speed<=0||inspection<=0||defect<0||defect>100||rework<0||hours<0)throw new RangeError('Invalid model parameters');
    const d=defect/100;
    const processing=60/(60/speed+d*rework);
    const throughput=Math.min(processing,inspection);
    const yieldRate=1-d*.2;
    const goodRate=throughput*yieldRate;
    const total=throughput*hours;
    return {processing,throughput,yieldRate,goodRate,total,firstPass:total*(1-d),reworked:total*d,recovered:total*d*.8,scrapped:total*d*.2,good:goodRate*hours,orderHours:1000/goodRate,bottleneck:Math.abs(processing-inspection)<.01?'均衡':processing<inspection?'加工与返工':'质检',processingUse:throughput/processing,inspectionUse:throughput/inspection};
  }
  root.productionModel={calculate};
  if(typeof module!=='undefined')module.exports=root.productionModel;
})(typeof window!=='undefined'?window:globalThis);
