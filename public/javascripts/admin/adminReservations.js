
//Script pour gérer la déconnexion

/**
 * Ajoute un gestionnaire d'événement au bouton de déconnexion pour rediriger l'utilisateur.
 * @function
 * @memberof module:userActions
 * 
 * @description
 * Ce script configure un gestionnaire d'événement `click` sur le bouton avec l'ID `logoutButton`. 
 * Lorsque le bouton est cliqué, l'utilisateur est redirigé vers la route `/logout` pour effectuer une déconnexion.
 */
document.getElementById('logoutButton').addEventListener('click', function () {
    window.location.href = '/logout'; // Redirige vers la route de déconnexion
});


/**
 * Remplit dynamiquement une liste déroulante avec des options numériques.
 * @function
 * @memberof module:dropdownHandler
 * 
 * @description
 * Ce script sélectionne un élément de type `<select>` par son ID (`Number`) et y ajoute dynamiquement des options numérotées de 1 à 24.
 * Chaque option possède une valeur (`value`) et un texte affiché (`textContent`) correspondant à son numéro.
 */
const select = document.getElementById('Number');

for (let i = 1; i <= 24; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    select.appendChild(option);
};




//bouton tri par numero ou par date

let sortByNumber = false;


/**
 * Script pour trier dynamiquement les lignes d'un tableau par numéro de catway ou par date de début.
 * @module scripts/tableSorter
 * 
 * @description
 * Ce script ajoute un gestionnaire d'événement `click` sur le bouton avec l'ID `sortButton` pour permettre le tri des lignes d'un tableau. 
 * Deux critères de tri sont disponibles :
 * 1. Tri par numéros de catway en ordre croissant.
 * 2. Tri par dates de début (format `YYYY-MM-DD`) en ordre alphabétique.
 * Après le tri, les lignes triées sont réinsérées dans le tableau.
 * 
 * @function
 * @name handleSortClick
 * Ajoute un gestionnaire au bouton pour alterner entre les deux méthodes de tri :
 * - Bascule la variable globale `sortByNumber` pour déterminer la méthode de tri.
 * - Trie les lignes soit par numéro de catway, soit par date, en mettant à jour le texte du bouton.
 * - Réinsère les lignes triées dans le tableau.
 */
document.getElementById('sortButton').addEventListener('click', () => {
    const sortButton = document.getElementById('sortButton');
    const table = document.getElementById('allResult');
    const rowsArray = Array.from(table.querySelectorAll('tbody tr'));

    sortByNumber = !sortByNumber; // Bascule la méthode de tri

    if (sortByNumber) {
        rowsArray.sort((a, b) => {
            const numA = parseInt(a.querySelector('.catwaysNumber').dataset.number, 10);
            const numB = parseInt(b.querySelector('.catwaysNumber').dataset.number, 10);
            sortButton.textContent = "Trier par date d'entrée"
            return numA - numB;
        });
    } else {
        rowsArray.sort((a, b) => {
            const dateA = a.querySelector('.startDate').dataset.start;
            const dateB = b.querySelector('.startDate').dataset.start;
            sortButton.textContent = "Trier par catway"
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

/**
 * Script pour gérer l'affichage et la modification des réservations via un formulaire dynamique.
 * @module scripts/reservationFormHandler
 * 
 * @description
 * Ce script ajoute des gestionnaires d'événements pour permettre aux utilisateurs de modifier les réservations :
 * 1. Masque initialement le formulaire de modification des réservations (`formReservations`).
 * 2. Configure des boutons de mise à jour (`.updateBtn`) pour afficher le formulaire avec les données d'une ligne de tableau sélectionnée.
 * 3. Inclut une fonction pour formater les dates en `YYYY-MM-DD`.
 * 4. Assure que le formulaire est masqué après l'envoi de la requête de mise à jour ou d'ajout.
 * 
 * @function formInputDisplay
 * Masque le formulaire après l'envoi de la requête via le bouton `btn_submit`.
 * 
 * @function update
 * Remplit les champs du formulaire avec les données récupérées de la ligne du tableau :
 * - Champ `Id` : ID de la réservation.
 * - Champ `Name` : Nom du client.
 * - Champ `Boat` : Nom du bateau.
 * - Champ `Start` : Date de début (formatée).
 * - Champ `End` : Date de fin (formatée).
 * 
 * @function formaterDate
 * Formate une date donnée au format `YYYY-MM-DD`.
 * - Si la date est vide ou invalide, renvoie une chaîne vide.
 */
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
            const inputSubmit = document.getElementById('btn_submit');


            if (formReservations.style.display === 'none') {
                formReservations.style.display = 'block';
                divSecret_question.style.display = 'none';
                btnAddReservation.textContent = 'Fermer modifier';


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


/**
 * Masque dynamiquement l'élément contenant la classe `secret_question`.
 * @function
 * @memberof module:userInterface
 * 
 * @description
 * Sélectionne l'élément avec la classe `secret_question` et modifie son style 
 * pour le masquer (`display: 'none'`). Utile pour cacher des sections de formulaire 
 * ou des éléments de l'interface utilisateur qui ne doivent pas être visibles immédiatement.
 */
const divSecret_question = document.querySelector('.secret_question');
divSecret_question.style.display = 'none';



// masquer le formulaire d'ajout ou modification et restaurer ses valeur a zéro

/**
 * Gère l'affichage et la réinitialisation du formulaire d'ajout de réservations.
 * @function
 * @memberof module:reservationFormHandler
 * 
 * @description
 * Configure un gestionnaire d'événement sur le bouton avec l'ID `btnAddReservation` pour basculer entre l'affichage et le masquage
 * du formulaire de réservation (`formReservations`). Réinitialise les champs du formulaire lorsqu'il est affiché et active 
 * les sélections si nécessaire.
 */
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
            btnAddReservation.textContent = 'Ajouter une réservation';
        }

        window.scrollTo(0, 0);
    });
}
formBtnAdd();








// masquer ou afficher avec un bouton le tableau contenant touts les resultats
/**
 * Gère l'affichage dynamique des résultats via un bouton basculant.
 * @function
 * @memberof module:resultDisplayHandler
 * 
 * @description
 * Ce script ajoute un gestionnaire d'événement `DOMContentLoaded` pour initialiser le comportement des résultats :
 * 1. Masque initialement l'élément contenant les résultats (`#allResult`).
 * 2. Configure un bouton avec la classe `.all` pour basculer entre l'affichage et le masquage des résultats.
 * 3. Change dynamiquement le texte du bouton pour refléter l'état actuel des résultats.
 */
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
                btnAllResult.textContent = 'Afficher tout';
            }
        });
    }

    listAllResult();
});





//masquer ou afficher le resultats avec un bouton apres recherche d'un catwway
/**
 * Gère l'affichage et la réinitialisation des résultats de recherche.
 * @function
 * @memberof module:searchHandler
 * 
 * @description
 * Ce script configure un gestionnaire d'événements `DOMContentLoaded` pour initialiser le comportement des résultats de recherche.
 * 1. Définit un état initial masqué pour l'élément contenant les résultats (`#searchResult`).
 * 2. Configure un bouton de réinitialisation (`#btnReset`) pour effacer le champ de recherche (`#searchInput`) et alterner entre
 *    l'affichage et le masquage des résultats.
 * 3. Met à jour dynamiquement le texte du bouton pour refléter l'état actuel des résultats.
 */
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
                btnReset.textContent = 'Afficher la recherche';
            }
        });
    }

    reset();
});


/**
 * Gère la suppression dynamique des réservations via un formulaire global.
 * @function
 * @memberof module:reservationDeleteHandler
 * 
 * @description
 * Ce script ajoute un gestionnaire d'événement `click` aux boutons avec la classe `.inputDelete`. 
 * Lorsqu'un bouton est cliqué, les données dynamiques associées à une réservation (ID, numéro de catway, nom du client, nom du bateau, date de début et de fin) 
 * sont injectées dans un formulaire global (`#globalDeleteForm`) avant de soumettre ce formulaire automatiquement.
 */
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
/**
 * Gère la soumission asynchrone du formulaire de suppression des réservations.
 * @function
 * @memberof module:reservationDeleteHandler
 * 
 * @description
 * Ce script ajoute un gestionnaire d'événement `submit` au formulaire avec l'ID `globalDeleteForm`. 
 * Il empêche l'envoi par défaut du formulaire, collecte les données de manière asynchrone, et envoie une requête HTTP DELETE 
 * vers l'endpoint `/admin/reservations/delete`. En cas de succès, l'utilisateur est redirigé vers une URL spécifiée 
 * dans la réponse du serveur. En cas d'échec, des erreurs sont affichées dans la console.
 */
document.getElementById('globalDeleteForm').addEventListener('submit', async function (event) {
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
/**
 * Gère la mise à jour dynamique des réservations via un formulaire approprié.
 * @function
 * @memberof module:reservationUpdateHandler
 * 
 * @description
 * Ce script configure un gestionnaire d'événement `click` pour chaque bouton avec la classe `.updateBtn`. 
 * Lorsque le bouton est cliqué, il vérifie l'existence des formulaires `formReservationsPut` et `formReservations`. 
 * Si nécessaire, l'ID du formulaire est modifié en `formReservationsPut`. 
 * Un gestionnaire d'événement `submit` est ensuite attaché au formulaire pour collecter les données,
 * envoyer une requête HTTP PUT à l'endpoint `/admin/reservations/put` et gérer la réponse :
 * - En cas de succès, l'utilisateur est redirigé vers l'URL spécifiée dans la réponse.
 * - En cas d'erreur, les détails sont affichés dans la console.
 */
document.querySelectorAll('.updateBtn').forEach(button => {
    button.addEventListener('click', () => {
        const formPut = document.getElementById('formReservationsPut');
        const formAdd = document.getElementById('formReservations');

        if (formAdd || formPut) {
            if (!formPut) {
                formAdd.id = 'formReservationsPut'; // Change l'ID du formulaire
                console.log('L\'ID du formulaire a été changé en :', formAdd.id);
            }
            // Ajoutez l'écouteur d'événements submit après avoir changé l'ID
            document.getElementById('formReservationsPut').addEventListener('submit', async function (event) {
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



//method post

/**
 * Gère l'ajout dynamique de réservations via un formulaire adapté.
 * @function
 * @memberof module:reservationAddHandler
 * 
 * @description
 * Ce script ajoute un gestionnaire d'événement `click` au bouton ayant l'ID `btnAddReservation`. 
 * Lorsqu'il est cliqué, le script vérifie la présence des formulaires `formReservationsPut` et `formReservations`. 
 * Si nécessaire, l'ID du formulaire existant est modifié en `formReservations`. 
 * Un gestionnaire d'événement `submit` est ensuite attaché au formulaire pour :
 * 1. Collecter les données sous forme de JSON.
 * 2. Envoyer une requête HTTP POST à l'endpoint `/admin/reservations/add`.
 * 3. Gérer la réponse :
 *    - En cas de succès, redirige l'utilisateur vers l'URL spécifiée.
 *    - En cas d'échec, affiche les erreurs dans la console.
 */
document.getElementById('btnAddReservation').addEventListener('click', () => {
    const formPut = document.getElementById('formReservationsPut');
    const formAdd = document.getElementById('formReservations');
    if (formPut || formAdd) {
        if (!formAdd) {
            formPut.id = 'formReservations'; // Change l'ID du formulaire
            console.log('L\'ID du formulaire a été changé en :', formPut.id);
        }

        // Ajoutez l'écouteur d'événements submit après avoir changé l'ID
        document.getElementById('formReservations').addEventListener('submit', async function (event) {
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