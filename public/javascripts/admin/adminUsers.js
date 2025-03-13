
//   Script pour gérer la déconnexion

document.getElementById('logoutButton').addEventListener('click', function() {
    window.location.href = '/logout'; // Redirige vers la route de déconnexion
});







// boutton mise jour sur chaque ligne avec utilisation de l'id
// et affichage du formulaire de modification
document.addEventListener('DOMContentLoaded', () => {
const buttonsUpdate = document.querySelectorAll('.updateBtn');
const userForm = document.getElementById('userForm');
userForm.style.display = 'none';

const divSecret_question = document.querySelector('.secret_question');





if (buttonsUpdate.length === 0) {
console.error("Aucun bouton de mise à jour trouvé.");
return;
}


//utiliser les données recuperer de catway et les ajouter dans le tableau et masquer le tableau directement et masquer question secrete et reponse secrete 
buttonsUpdate.forEach(button => {
button.addEventListener('click', () => {
const parentRow = button.closest('.ligne');
const usersName = parentRow.querySelector('.usersName').dataset.name;
const usersFirstname = parentRow.querySelector('.usersFirstname').dataset.firstname;
const usersEmail = parentRow.querySelector('.usersEmail').dataset.email;

const btnAddUser = document.getElementById('btnAddUser');

if (userForm.style.display === 'none') {
    userForm.style.display = 'block';
    divSecret_question.style.display = 'none';
    btnAddUser.textContent = 'fermer modifier';
    
  }

update(
usersName, usersFirstname, usersEmail);
window.scrollTo(0, 0);



});
});



// masquer le formulaire apres envoi de la requete add ou update
function formInputDisplay() {
const inputSubmit = document.getElementById('btn_submit');
inputSubmit.addEventListener('click', () => {
    userForm.style.display = 'none';
});
}
formInputDisplay();



// passer les valeur des ligne de tableau dans chaque bouton modifier avec impossibilité de changer "number" et "type"
function update(name, firstname, email) {

document.getElementById('name').value = name;
document.getElementById('firstname').value = firstname;
document.getElementById('email').value = email;
}

update();
});


const divSecret_question = document.querySelector('.secret_question');
divSecret_question.style.display = 'none';


// masquer le formulaire d'ajout ou modification et restaurer ses valeur a zéro
function formBtnAdd() {
const userForm = document.getElementById('userForm');
const btnAddUser = document.getElementById('btnAddUser');

const divSecret_question = document.querySelector('.secret_question');


btnAddUser.addEventListener('click', () => {

  const formId = document.getElementById('id');
  formId.value = "";
  formId.disabled = false;

  const formName = document.getElementById('name');
  formName.value = "";
  formName.disabled = false;

  const formFirstname = document.getElementById('firstname');
  formFirstname.value = "";
  formFirstname.disabled = false;

  const formEmail = document.getElementById('email');
  formEmail.value = "";
  formEmail.disabled = false;

  if (userForm.style.display === 'none') {
    userForm.style.display = 'block';
    divSecret_question.style.display = 'block';
    btnAddUser.textContent = 'Masquer formulaire';
  }
  else {
    userForm.style.display = 'none';
    btnAddUser.textContent = 'ajouter un utilisateur';
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
    dataAllResult.style.display = 'table'; // Restaurer le comportement de tableau
    btnAllResult.textContent = 'Masquer tout';
} else {
    dataAllResult.style.display = 'none'; // Cacher
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






//bouton supprimer global 


document.querySelectorAll('.inputDelete').forEach(button => {
button.addEventListener('click', event => {
const form = document.getElementById('globalDeleteForm');

// Récupération des données dynamiques
const userId = button.dataset.id;
const userName = button.dataset.name;
const userFirstname = button.dataset.firstname;
const userEmail = button.dataset.email;

// Injecter les valeurs dans le formulaire global
form.querySelector('#form_id').value = userId;
form.querySelector('#form_name').value = userName;
form.querySelector('#form_firstname').value = userFirstname;
form.querySelector('#form_email').value = userEmail;

// Soumettre le formulaire
form.submit();
});
});
