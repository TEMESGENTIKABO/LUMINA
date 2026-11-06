export const DATA_SAVER_KEY = "aksum-saver";
// Runs in <head>: turns data saver on if the visitor chose it, or if their
// phone/browser asks for it (Save-Data, or a 2G connection).
export const dataSaverInitScript = `try{var s=localStorage.getItem("${DATA_SAVER_KEY}");var c=navigator.connection;if(s==="on"||(s===null&&c&&(c.saveData||/(^|-)2g$/.test(c.effectiveType||"")))){document.documentElement.dataset.saver="on"}}catch(e){}`;
