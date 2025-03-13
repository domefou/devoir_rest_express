
  // Script pour gérer la déconnexion 
    
  document.getElementById('logoutButton').addEventListener('click', function() {
    window.location.href = '/logout'; // Redirige vers la route de déconnexion
});



const select = document.getElementById('Number');

for (let i = 1; i <= 24; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
};







// boutton mise jour sur chaque ligne avec utilisation de l'id
// et affichage du formulaire de modification
document.addEventListener('DOMContentLoaded', () => {
const buttonsUpdate = document.querySelectorAll('.updateBtn');
const formCatways = document.getElementById('formCatways');
formCatways.style.display = 'none';

const divSecret_question = document.querySelector('.secret_question');



if (buttonsUpdate.length === 0) {
console.error("Aucun bouton de mise à jour trouvé.");
return;
}




//utiliser les données recuperer de catway et les ajouter dans le tableau et masquer le tableau directement
buttonsUpdate.forEach(button => {
button.addEventListener('click', () => {
const parentRow = button.closest('.ligne');
//const catwaysId = parentRow.querySelector('.catwaysId').dataset.id;
const catwaysNumber = parentRow.querySelector('.catwaysNumber').dataset.number;
const catwaysType = parentRow.querySelector('.catwaysType').dataset.type;
const catwaysState = parentRow.querySelector('.catwaysState').dataset.state;


const btnAddCatway = document.getElementById('btnAddCatway');


if (formCatways.style.display === 'none') {
  formCatways.style.display = 'block';
  divSecret_question.style.display = 'none';
  btnAddCatway.textContent = 'fermer modifier';


  }

update(/*catwaysId,*/ catwaysNumber, catwaysType, catwaysState);
window.scrollTo(0, 0);



});
});



// masquer le formulaire apres envoi de la requete add ou update
function formInputDisplay() {
const inputSubmit = document.getElementById('btn_submit');
inputSubmit.addEventListener('click', () => {
    formCatways.style.display = 'none';
});
}
formInputDisplay();



// passer les valeur des ligne de tableau dans chaque bouton modifier avec impossibilité de changer "number" et "type"
function update(/*id,*/ number, type, state) {

//document.getElementById('id').value = id;
document.getElementById('State').value = state;

const selectNumber = document.getElementById('Number');
selectNumber.value = number;
selectNumber.disabled = true;

const selectType = document.getElementById('Type');
selectType.value = type;
selectType.disabled = true;


}

update();
});

const divSecret_question = document.querySelector('.secret_question');
divSecret_question.style.display = 'none';



// masquer le formulaire d'ajout ou modification et restaurer ses valeur a zéro
function formBtnAdd() {
const formCatways = document.getElementById('formCatways');
const btnAddCatway = document.getElementById('btnAddCatway');

const divSecret_question = document.querySelector('.secret_question');



btnAddCatway.addEventListener('click', () => {

  //document.getElementById('id').value = "";
  document.getElementById('State').value = "";

  const selectNumber = document.getElementById('Number');
  selectNumber.value = "";
  selectNumber.disabled = false;

  const selectType = document.getElementById('Type');
  selectType.value = "";
  selectType.disabled = false;

  if (formCatways.style.display === 'none') {
    formCatways.style.display = 'block';
    divSecret_question.style.display = 'block';
    btnAddCatway.textContent = 'Masquer formulaire';
  }
  else {
    formCatways.style.display = 'none';
    btnAddCatway.textContent = 'ajouter un catway';
  }

  window.scrollTo(0, 0);
});
}
formBtnAdd();








// masquer ou afficher avec un bouton le tableau contenant touts les resultats

document.addEventListener('DOMContentLoaded', (event) => {
const dataAllResult = document.getElementById('allResult');
dataAllResult.style.display = 'none';

function listAllResult() {
const btnAllResult = document.querySelector('.all');
btnAllResult.addEventListener('click', () => {
  if (dataAllResult.style.display === 'none') {
    dataAllResult.style.display = 'table';
    btnAllResult.textContent = 'Masquer tout';
  }
  else {
    dataAllResult.style.display = 'none';
    btnAllResult.textContent = 'afficher tout';
  }
});
}

listAllResult();
});





//masquer ou afficher le resultats avec un bouton apres recherche d'un catwway

document.addEventListener('DOMContentLoaded', (event) => {
const searchResults = document.getElementById('searchResult');
const originalDisplay = searchResults.style.display || 'table-row-group';

function reset() {
const btnReset = document.getElementById('btnReset');
  btnReset.addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    if (searchResults.style.display === 'none') {
      searchResults.style.display = originalDisplay;
      btnReset.textContent = 'Masquer la recherche';
  }
  else {
    searchResults.style.display = 'none';
    btnReset.textContent = 'afficher la recherche';
  }
});
}

reset();
});



document.querySelectorAll('.inputDelete').forEach(button => {
button.addEventListener('click', event => {
const form = document.getElementById('globalDeleteForm');

// Récupération des données dynamiques
const catwaysNumber = button.dataset.number;
const catwaysState = button.dataset.state;
const catwaysType = button.dataset.type;

// Injecter les valeurs dans le formulaire global
form.querySelector('#form_catwaysNumber').value = catwaysNumber;
form.querySelector('#form_catwaysState').value = catwaysState;
form.querySelector('#form_catwaysType').value = catwaysType;

// Soumettre le formulaire
form.submit();
});
});

