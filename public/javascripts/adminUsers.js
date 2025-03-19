
//   Script pour gérer la déconnexion

/**
 * Ajoute un gestionnaire d'événement au bouton de déconnexion pour rediriger l'utilisateur vers la route de déconnexion.
 * @function
 * @memberof module:userActions
 * 
 * @description
 * Ce script configure un gestionnaire d'événement `click` sur l'élément avec l'ID `logoutButton`. Lorsqu'il est cliqué,
 * l'utilisateur est redirigé vers la route `/logout` pour effectuer la déconnexion.
 */
document.getElementById('logoutButton').addEventListener('click', function () {
    window.location.href = '/logout'; // Redirige vers la route de déconnexion
});







// boutton mise jour sur chaque ligne avec utilisation de l'id
// et affichage du formulaire de modification

/**
 * Gère l'affichage et la modification des utilisateurs via un formulaire dynamique.
 * @function
 * @memberof module:userFormHandler
 * 
 * @description
 * Ce script configure des gestionnaires d'événements pour permettre aux utilisateurs de modifier les informations d'autres utilisateurs :
 * 1. Masque initialement le formulaire de modification des utilisateurs (`userForm`).
 * 2. Configure les boutons avec la classe `.updateBtn` pour afficher le formulaire et remplir ses champs avec les données de la ligne sélectionnée.
 * 3. Masque les sections "question secrète" et "réponse secrète", et désactive leurs champs requis.
 * 4. Assure que le formulaire est masqué après l'envoi de la requête d'ajout ou de modification.
 */
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
            const usersId = parentRow.querySelector('.usersId').dataset.id;
            const usersName = parentRow.querySelector('.usersName').dataset.name;
            const usersFirstname = parentRow.querySelector('.usersFirstname').dataset.firstname;
            const usersEmail = parentRow.querySelector('.usersEmail').dataset.email;

            const question = document.getElementById('question');
            question.required = false;

            const response = document.getElementById('response');
            response.required = false;


            const btnAddUser = document.getElementById('btnAddUser');
            const btn_submit = document.getElementById('btn_submit');



            if (userForm.style.display === 'none') {
                userForm.style.display = 'block';
                divSecret_question.style.display = 'none';
                btnAddUser.textContent = 'fermer modifier';
                btn_submit.textContent = 'Modifier';

            }

            update(usersId, usersName, usersFirstname, usersEmail);
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
    function update(id, name, firstname, email) {

        document.getElementById('id').value = id;
        document.getElementById('name').value = name;
        document.getElementById('firstname').value = firstname;
        document.getElementById('email').value = email;
    }

    update();
});

/**
 * Masque dynamiquement l'élément avec la classe `secret_question`.
 * @function
 * @memberof module:userInterface
 * 
 * @description
 * Sélectionne l'élément ayant la classe `secret_question` et applique un style pour le masquer (`display: 'none'`). 
 * Cette opération peut être utilisée pour cacher des sections d'interface utilisateur qui ne doivent pas être visibles immédiatement.
 */
const divSecret_question = document.querySelector('.secret_question');
divSecret_question.style.display = 'none';


// masquer le formulaire d'ajout ou modification et restaurer ses valeur a zéro

/**
 * Gère l'affichage et la réinitialisation du formulaire d'ajout d'utilisateur.
 * @function
 * @memberof module:userFormHandler
 * 
 * @description
 * Ce script configure un gestionnaire d'événement sur le bouton avec l'ID `btnAddUser` pour basculer entre l'affichage 
 * et le masquage du formulaire d'utilisateur (`userForm`). Lorsqu'il est affiché, le formulaire est réinitialisé, et le texte 
 * du bouton est mis à jour pour refléter l'état actuel. Le bouton de soumission (`btn_submit`) est également modifié pour 
 * indiquer l'action "Ajouter".
 */
function formBtnAdd() {
    const userForm = document.getElementById('userForm');
    const btnAddUser = document.getElementById('btnAddUser');

    const divSecret_question = document.querySelector('.secret_question');


    btnAddUser.addEventListener('click', () => {

        const formId = document.getElementById('id');
        formId.value = "";

        const formName = document.getElementById('name');
        formName.value = "";

        const formFirstname = document.getElementById('firstname');
        formFirstname.value = "";

        const formEmail = document.getElementById('email');
        formEmail.value = "";

        const btn_submit = document.getElementById('btn_submit');

        if (userForm.style.display === 'none') {
            userForm.style.display = 'block';
            divSecret_question.style.display = 'block';
            btnAddUser.textContent = 'Masquer formulaire';
            btn_submit.textContent = 'Ajouter';

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
/**
 * Gère l'affichage dynamique de tous les résultats via un bouton basculant.
 * @function
 * @memberof module:resultDisplayHandler
 * 
 * @description
 * Ce script configure un gestionnaire d'événement `DOMContentLoaded` pour initialiser le comportement des résultats. 
 * 1. Définit initialement le style d'affichage de l'élément avec l'ID `allResult` sur `none`.
 * 2. Configure un bouton avec la classe `.all` pour basculer entre l'affichage (`table`) et le masquage (`none`) des résultats.
 * 3. Met à jour dynamiquement le texte du bouton pour refléter l'état actuel de l'affichage.
 */
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

/**
 * Gère l'affichage et la réinitialisation des résultats de recherche.
 * @function
 * @memberof module:searchHandler
 * 
 * @description
 * Ce script configure un gestionnaire d'événement `DOMContentLoaded` pour initialiser le comportement des résultats de recherche.
 * 1. Définit le style d'affichage initial de l'élément contenant les résultats (`#searchResult`).
 * 2. Ajoute un gestionnaire d'événement au bouton avec l'ID `btnReset` pour :
 *    - Réinitialiser le champ de recherche (`#searchInput`) en le vidant.
 *    - Alterner entre l'affichage et le masquage des résultats de recherche.
 * 3. Met à jour dynamiquement le texte du bouton pour indiquer l'état actuel de l'affichage des résultats.
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
                btnReset.textContent = 'afficher la recherche';
            }
        });
    }

    reset();
});






//bouton supprimer global 

/**
 * Gère la suppression dynamique des utilisateurs via un formulaire global.
 * @function
 * @memberof module:userDeleteHandler
 * 
 * @description
 * Ce script ajoute un gestionnaire d'événement `click` aux boutons portant la classe `.inputDelete`. 
 * Lorsqu'un bouton est cliqué, les données associées à un utilisateur (ID, nom, prénom, email) sont récupérées 
 * dynamiquement depuis les attributs `data-*` du bouton, puis injectées dans un formulaire global (`#globalDeleteForm`).
 * Enfin, le formulaire est automatiquement soumis pour traiter la suppression.
 */
document.querySelectorAll('.inputDelete').forEach(button => {
    button.addEventListener('click', event => {
        const form = document.getElementById('globalDeleteForm');

        // Récupération des données dynamiques
        const usersId = button.dataset.id;
        const usersName = button.dataset.name;
        const usersFirstname = button.dataset.firstname;
        const usersEmail = button.dataset.email;

        // Injecter les valeurs dans le formulaire global
        form.querySelector('#form_id').value = usersId;
        form.querySelector('#form_name').value = usersName;
        form.querySelector('#form_firstname').value = usersFirstname;
        form.querySelector('#form_email').value = usersEmail;

        // Soumettre le formulaire
        form.submit();
    });
});






//  method delete

/**
 * Gère la soumission asynchrone du formulaire de suppression des utilisateurs.
 * @function
 * @memberof module:userDeleteHandler
 * 
 * @description
 * Ce script ajoute un gestionnaire d'événement `submit` au formulaire avec l'ID `globalDeleteForm`. 
 * Lors de la soumission, il empêche l'envoi par défaut du formulaire, collecte les données dynamiques, 
 * et envoie une requête HTTP DELETE à l'endpoint `/admin/user/delete`. En cas de succès, l'utilisateur 
 * est redirigé vers une URL spécifiée dans la réponse du serveur. En cas d'échec, des messages d'erreur 
 * sont affichés dans la console.
 */
document.getElementById('globalDeleteForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Empêche l'envoi par défaut du formulaire

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch('/admin/user/delete', {
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
 * Gère la mise à jour des données utilisateur via un formulaire dynamique.
 * @function
 * @memberof module:userUpdateHandler
 * 
 * @description
 * Ce script configure un gestionnaire d'événement `click` pour les boutons ayant la classe `.updateBtn`. 
 * Lorsqu'un bouton est cliqué, il vérifie l'existence des formulaires `formPut` et `userForm`. 
 * Si le formulaire avec l'ID `formPut` n'existe pas, l'ID de `userForm` est changé en `formPut`. 
 * Un gestionnaire d'événement `submit` est ensuite attaché pour :
 * 1. Collecter les données du formulaire sous forme de JSON.
 * 2. Envoyer une requête HTTP PUT à l'endpoint `/admin/user/put`.
 * 3. Gérer la réponse :
 *    - Affiche un message de succès et redirige l'utilisateur en cas de réussite.
 *    - Log les erreurs dans la console en cas d'échec.
 */
document.querySelectorAll('.updateBtn').forEach(button => {
    button.addEventListener('click', () => {
        const formPut = document.getElementById('formPut');
        const formAdd = document.getElementById('userForm');

        if (formAdd || formPut) {
            formAdd.id = 'formPut'; // Change l'ID du formulaire
            console.log('L\'ID du formulaire a été changé en :', formAdd.id);


            // Ajoutez l'écouteur d'événements submit après avoir changé l'ID
            document.getElementById('formPut').addEventListener('submit', async function (event) {
                event.preventDefault();

                const formData = new FormData(this);
                const data = {};
                formData.forEach((value, key) => {
                    data[key] = value;
                });

                try {
                    const response = await fetch('/admin/user/put', {
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
 * Gère l'ajout d'utilisateurs via un formulaire dynamique.
 * @function
 * @memberof module:userAddHandler
 * 
 * @description
 * Ce script configure un gestionnaire d'événement `click` pour le bouton ayant l'ID `btnAddUser`. 
 * Lorsqu'il est cliqué, le script vérifie si un formulaire existant avec l'ID `formPut` est présent.
 * Si nécessaire, l'ID de ce formulaire est modifié en `userForm`. Ensuite, un gestionnaire 
 * d'événement `submit` est attaché pour :
 * 1. Empêcher l'envoi par défaut du formulaire.
 * 2. Collecter les données utilisateur depuis les champs du formulaire sous forme d'objet JSON.
 * 3. Envoyer une requête HTTP POST à l'endpoint `/admin/user/add`.
 * 4. Gérer la réponse :
 *    - En cas de succès, redirige l'utilisateur vers une URL spécifiée.
 *    - En cas d'échec, affiche les erreurs dans la console.
 */
document.getElementById('btnAddUser').addEventListener('click', () => {
    const formPut = document.getElementById('formPut');
    const formAdd = document.getElementById('userForm');
    if (formPut) {
        formPut.id = 'userForm'; // Change l'ID du formulaire
        console.log('L\'ID du formulaire a été changé en :', formPut.id);
    }
    if (formAdd || formPut) {
        console.log('Formulaire trouvé, ajout de l\'écouteur d\'événements submit');

        document.getElementById('userForm').addEventListener('submit', async function (event) {
            event.preventDefault();
            console.log('Formulaire soumis');

            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            console.log('Données du formulaire :', data);

            try {
                const response = await fetch('/admin/user/add', {
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

