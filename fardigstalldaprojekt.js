<!DOCTYPE html>
<html>

<head>
<style>
    .sweRegions {
        margin: 25px;
        margin-top: 10px;
        margin-bottom: 10px;
        padding: 10px;
        border: 2px solid #aaaaaa;
        border-radius: 10px;
        transition: color 0.3s ease;
    }
    .checkbox {
        display : none;
    }
    input[type="checkbox"].checkbox:checked + label {
    background-color: #2CAB57;
    color: white;
    }
    .checkboxContainer {
        display: flex; 
        align-items: center; 
        justify-content: center; 
        flex-wrap: wrap;
        gap: 30px; 
    }
</style>
<script>
const filter = new Set();
//m - Malardalen, g - Goteborg, s - Skane, o - Ovrigt (other)
document.body.style.fontFamily = "Arial, sans-serif";

let projects;
let searchQuery = "";


    
    
window.onload = function() {
    fetch('https://raw.githubusercontent.com/Marix24/Elementhiss/refs/heads/main/fardigstalldaprojekt.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json(); // Only if status is OK and JSON is valid
            })
        .then(data => {
        projects = data;
        if(!Array.isArray(data)){alert("not an array")}
        else{applyFilter()};
        })
        .catch(error => console.error('Error loading JSON:', error));
    alert("loaded");
};

function setSearchQuery() {
    searchQuery = document.getElementById('searchInput').value;
};
function processFilter(region, self){
    if(self.checked){
        filter.add(region);
    }
    else{
        filter.delete(region);
    };
    applyFilter();
    //alert(filter.size);
};

function createEl(tag, attributes = {}, styles = {}) {
    const el = document.createElement(tag);

    for (const [key, value] of Object.entries(attributes)) {
        el.setAttribute(key, value);
  }
  
    Object.assign(el.style, styles);

    return el;
}
function uncheckAll() {
    document.querySelectorAll('.checkbox').forEach(bt => bt.checked = false);
    filter.clear();
    applyFilter();
  }

function applyFilter(){
    const container = document.getElementById("dynamicContainer");
    container.innerHTML = "";
    projects.forEach(pR => {
        if (((filter.size === 0 || filter.has(pR.location))) && (Object.values(pR).some(attribute => typeof attribute === 'string' &&   attribute.toLowerCase().includes(searchQuery.toLowerCase())) || !searchQuery)){
        const card = createEl("div", {}, { backgroundColor : '#ffffff'});
        card.className = "card";
        card.style.transition = "background-color 0.3s ease";
        card.style.margin = "20px";
        card.style.overflowWrap = "break-word";
        card.style.whiteSpace = "normal";
        card.style.maxWidth = "300px";
        card.style.borderRadius = "10px";
        const image = document.createElement("img");
        image.src = pR.image;
        image.style.width = "300px";
        image.style.height = "200px";
        image.style.borderRadius = "10px 10px 0 0";
        const name = createEl("h2", {}, {fontSize: "30px", color : '#000000'});
        name.textContent = pR.displayName;
        name.style.marginLeft = "10px";
        const divider = createEl("hr", {}, {height: "1px", backgroundColor: "#999999"});
        const description = createEl("p", {}, {fontSize: "18px" , color : '#777777'});
        description.textContent = pR.desc;
        description.style.marginLeft = "10px";
        
        //////
        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(divider);
        card.appendChild(description);
        card.onclick = () => {window.location.href = pR.link;};
        card.onmouseenter = () => {card.style.backgroundColor = "#2CAB57"};
        card.onmouseleave = () => {card.style.backgroundColor = "#ffffff"};
        container.appendChild(card);}
    });
};
</script>
</head>

<body>
<!--<img src="https://optim.tildacdn.net/tild6463-6230-4939-b738-386561393265/-/contain/760x570/center/center/-/format/webp/6.jpg.webp" alt="Lidl">-->
<div style="display: block; align-items: center; ">
<h1 id = "demo" style="text-align:center; color: #2CAB57; font-size: 3.5em" >Avslutade projekt</h1><br>
<h2 style="text-align:center; font-size: 2em">Filter</h2>
</div>
<div class = "checkboxContainer">
    <input type = "checkbox" class = "checkbox" id = "malardalen"  onclick="processFilter('m', this);">
    <label class = "sweRegions" for = "malardalen">
    Mälardalen
    </label>
    <input type = "checkbox" class = "checkbox" id = "goteborg"  onclick= "processFilter('g', this);">
    <label class = "sweRegions" for = "goteborg">
    Göteborg
    </label>
    <input type = "checkbox" class = "checkbox" id = "skane"  onclick= "processFilter('s', this);">
    <label class = "sweRegions" for = "skane">
    Skåne
    </label>
    <input type = "checkbox" class = "checkbox" id = "ovrigt"  onclick= "processFilter('o', this);">
    <label class = "sweRegions" for = "ovrigt">
    Övrigt
    </label>
    <button style = "justify-self: right; align-self: right;" onclick = "uncheckAll();">Reset</button>
</div>

<div style="height: 10%; display: flex; align-items: center; justify-content: center;"><input id = "searchInput" type="text" placeholder="Söka..." oninput = "setSearchQuery();  applyFilter();"></div>
<div id = "dynamicContainer" style = "display: flex; flex-wrap: wrap; background-color : #eeeeee"></div>

</body>
</html>
