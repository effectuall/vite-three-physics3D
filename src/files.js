import json from '/src/files.json'

let topicList = json;
// console.log(topicList)


init();
async function init() {
 
  const validRedirects = new Map();

  const row = document.getElementById('row');

  const files = topicList;
  const topics = document.getElementById('topics');
  row.appendChild(topics)

  for (const key in files) {

    const section = files[key];
    const each = document.createElement('div');
    let X = `
           <a class = "topics">${key} </a>`;
    each.innerHTML = X.trim();
    row.appendChild(each.firstChild);
    for (let i = 0; i < section.length; i++) {

      const file = section[i];
      const link = 'Simulations/' + file 
      const template = `
              <div id="${file}"  class="column"> 
             
              <img class="image" style="width:100%" src="/screenshots/${file}.jpg" loading="lazy"  />
              <div class="middle">
              <div class="text">${getName(file)}</div>
            </div>
                </div>
              `;
      const div = document.createElement('div');
      div.innerHTML = template.trim();
      row.appendChild(div.firstChild);
      let selected = document.getElementById(file);
      selected.href = './Simulations/' +file + '.html';
      selected.addEventListener('click', function (e) {
        
        window.parent.location.hash = link;
        window.location.href = selected.href; 
        
            
      });

    }
  }

 
}


function getName(file) {

  const name = file.split('_');
  name.shift();
  return name.join(' ');

}