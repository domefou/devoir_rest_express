
//Script pour gérer la déconnexion

    
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




//bouton tri par numero ou par date
let sortByNumber = false;

document.getElementById('sortButton').addEventListener('click', () => {
  const sortButton = document.getElementById('sortButton');
  const table = document.getElementById('allResult');
  const rowsArray = Array.from(table.querySelectorAll('tbody tr'));

  sortByNumber = !sortByNumber; // Bascule la méthode de tri

  if (sortByNumber) {
    rowsArray.sort((a, b) => {
      const numA = parseInt(a.querySelector('.catwaysNumber').dataset.number, 10);
      const numB = parseInt(b.querySelector('.catwaysNumber').dataset.number, 10);
      sortButton.textContent = "trier par date d'entrée"
      return numA - numB;
    });
  } else {
    rowsArray.sort((a, b) => {
      const dateA = a.querySelector('.startDate').dataset.start;
      const dateB = b.querySelector('.startDate').dataset.start;
      sortButton.textContent = "trier par catway"
      return dateA.localeCompare(dateB); // Comparaison alphabétique pour les dates formatées en YYYY-MM-DD
    });
  }

  // Réinsérer les lignes triées dans le tableau
  const tbody = table.querySelector('tbody');
  tbody.innerHTML = ''; // Effacez l'ancien contenu
  rowsArray.forEach(row => tbody.appendChild(row)); // Ajoutez les lignes triées
});







// boutton mise jour sur chaque ligne avec utilisation de l'id
// et affichage du formulaire de modification
document.addEventListener('DOMContentLoaded', () => {
const buttonsUpdate = document.querySelectorAll('.updateBtn');
const formReservations = document.getElementById('formReservations');
formReservations.style.display = 'none';

const divSecret_question = document.querySelector('.secret_question');



if (buttonsUpdate.length === 0) {
console.error("Aucun bouton de mise à jour trouvé.");
return;
}




//utiliser les données recuperer de catway et les ajouter dans le tableau et masquer le tableau directement
buttonsUpdate.forEach(button => {
button.addEventListener('click', () => {

  function formaterDate(date) {
    if (!date) return ''; // Si `date` est vide ou indéfinie, renvoie une chaîne vide
    const dateParsee = new Date(date);
    if (isNaN(dateParsee)) return ''; // Vérifie si la date est invalide
    return dateParsee.toISOString().split('T')[0]; // Renvoie la date au format "yyyy-MM-dd"
  };
  

const parentRow = button.closest('.ligne');
const reservationsId = parentRow.querySelector('.reservationsId').dataset.id;
const catwaysNumber = parentRow.querySelector('.catwaysNumber').dataset.number;
const clientName = parentRow.querySelector('.clientName').dataset.name;
const boatName = parentRow.querySelector('.boatName').dataset.boat;
const startDate = formaterDate(parentRow.querySelector('.startDate').dataset.start);
const endDate = formaterDate(parentRow.querySelector('.endDate').dataset.end);



const btnAddReservation = document.getElementById('btnAddReservation');


if (formReservations.style.display === 'none') {
    formReservations.style.display = 'block';
    divSecret_question.style.display = 'none';
    btnAddReservation.textContent = 'fermer modifier';

  }

update(reservationsId, catwaysNumber, clientName, boatName, startDate, endDate);
window.scrollTo(0, 0);


});
});


// masquer le formulaire apres envoi de la requete add ou update
function formInputDisplay() {
const inputSubmit = document.getElementById('btn_submit');
inputSubmit.addEventListener('click', () => {
    formReservations.style.display = 'none';
});
}
formInputDisplay();



// passer les valeur des ligne de tableau dans chaque bouton modifier avec impossibilité de changer "number"
function update(id, number, name, boat, start, end) {

document.getElementById('Id').value = id;
document.getElementById('Name').value = name;
document.getElementById('Boat').value = boat;

const selectNumber = document.getElementById('Number');
selectNumber.value = number;

const startDate = document.getElementById('Start');
startDate.value = formaterDate(start);

const endDate = document.getElementById('End');
endDate.value = formaterDate(end);


}

function formaterDate(date) {
  if (!date) return ''; // Si `date` est vide ou indéfinie, renvoie une chaîne vide
  const dateParsee = new Date(date);
  if (isNaN(dateParsee)) return ''; // Vérifie si la date est invalide
  return dateParsee.toISOString().split('T')[0]; // Renvoie la date au format "yyyy-MM-dd"
};



update();
});

const divSecret_question = document.querySelector('.secret_question');
divSecret_question.style.display = 'none';



// masquer le formulaire d'ajout ou modification et restaurer ses valeur a zéro
function formBtnAdd() {
const formReservations = document.getElementById('formReservations');
const btnAddReservation = document.getElementById('btnAddReservation');

const divSecret_question = document.querySelector('.secret_question');



btnAddReservation.addEventListener('click', () => {


  

  const selectNumber = document.getElementById('Number');
  selectNumber.value = "";
  selectNumber.disabled = false;

  document.getElementById('Id').value = "";
  document.getElementById('Name').value = "";
  document.getElementById('Boat').value = "";
  document.getElementById('Start').value = "";
  document.getElementById('End').value = "";

  if (formReservations.style.display === 'none') {
    formReservations.style.display = 'block';
    divSecret_question.style.display = 'block';
    btnAddReservation.textContent = 'Masquer formulaire';
  }
  else {
    formReservations.style.display = 'none';
    btnAddReservation.textContent = 'ajouter une reservation';
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
const reservationsId = button.dataset.id;
const catwaysNumber = button.dataset.number;
const clientName = button.dataset.name;
const boatName = button.dataset.boat;
const startDate = button.dataset.start;
const endDate = button.dataset.end;

// Injecter les valeurs dans le formulaire global
form.querySelector('#form_id').value = reservationsId;
form.querySelector('#form_catwaysNumber').value = catwaysNumber;
form.querySelector('#form_name').value = clientName;
form.querySelector('#form_boatName').value = boatName;
form.querySelector('#form_startDate').value = startDate;
form.querySelector('#form_endDate').value = endDate;

// Soumettre le formulaire
form.submit();
});
});


//  method delete
document.getElementById('globalDeleteForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Empêche l'envoi par défaut du formulaire

  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => {
      data[key] = value;
  });

  try {
      const response = await fetch('/admin/reservations/delete', {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });

      if (response.ok) {
          const result = await response.json();
          console.log('Succès:', result);

          // Rediriger vers une autre page après la suppression
          window.location.href = result.redirectUrl;
      } else {
          console.error('Erreur lors de l\'envoi du formulaire');
      }
  } catch (error) {
      console.error('Erreur:', error);
  }
});

//method put

document.querySelectorAll('.updateBtn').forEach(button => {
  button.addEventListener('click', () => {
      const formPut = document.getElementById('formReservationsPut');
      const formAdd = document.getElementById('formReservations');
      
      if (formAdd) {
              formAdd.id = 'formReservationsPut'; // Change l'ID du formulaire
              console.log('L\'ID du formulaire a été changé en :', formAdd.id);
          

          // Ajoutez l'écouteur d'événements submit après avoir changé l'ID
          document.getElementById('formReservationsPut').addEventListener('submit', async function(event) {
              event.preventDefault();

              const formData = new FormData(this);
              const data = {};
              formData.forEach((value, key) => {
                  data[key] = value;
              });

              try {
                  const response = await fetch('/admin/reservations/put', {
                      method: 'PUT',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(data)
                  });

                  if (response.ok) {
                      const result = await response.json();
                      console.log('Succès:', result);

                      // Rediriger vers une autre page après la mise à jour
                      window.location.href = result.redirectUrl;
                  } else {
                      console.error('Erreur lors de l\'envoi du formulaire');
                  }
              } catch (error) {
                  console.error('Erreur:', error);
              }
          });
      } else {
          console.error('Formulaire PUT introuvable');
      }
  });
});




btnAddReservation
//method post


document.getElementById('btnAddReservation').addEventListener('click', () => {
  const formPut = document.getElementById('formReservationsPut');
  const formAdd = document.getElementById('formReservations');
  if (formPut || formAdd) {
      if(!formAdd){
        formPut.id = 'formReservations'; // Change l'ID du formulaire
        console.log('L\'ID du formulaire a été changé en :', formPut.id);
      }
        


      // Ajoutez l'écouteur d'événements submit après avoir changé l'ID
      document.getElementById('formReservations').addEventListener('submit', async function(event) {
          event.preventDefault();

          const formData = new FormData(this);
          const data = {};
          formData.forEach((value, key) => {
              data[key] = value;
          });

          try {
              const response = await fetch('/admin/reservations/add', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(data)
              });

              if (response.ok) {
                  const result = await response.json();
                  console.log('Succès:', result);

                  // Rediriger vers une autre page après la mise à jour
                  window.location.href = result.redirectUrl;
              } else {
                  console.error('Erreur lors de l\'envoi du formulaire');
              }
          } catch (error) {
              console.error('Erreur:', error);
          }
      });
  } else {
      console.error('Formulaire POST Add introuvable');
  }
});