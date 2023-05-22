export default async function CopyToClipboard (id) {
    var text = document.getElementById(id).innerText;
    var elem = document.createElement("textarea");
    document.body.appendChild(elem);
    elem.value = text;
    elem.select();
    document.execCommand("copy");
    document.body.removeChild(elem);
    document.getElementById("CopiedMsg").style.top = '20px';
    let delayres = await delay(1000);
    document.getElementById("CopiedMsg").style.top = '-70px'; 
}
const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}