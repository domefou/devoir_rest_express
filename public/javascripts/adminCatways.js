
// Script pour gérer la déconnexion 
/**
 * Ajoute un gestionnaire d'événement au bouton de déconnexion et génère dynamiquement des options pour une liste déroulante.
 * @module scripts/userInterface
 * 
 * @description
 * Ce script gère deux fonctionnalités principales :
 * 1. Ajoute un gestionnaire d'événement au bouton de déconnexion qui redirige l'utilisateur vers la route `/logout`.
 * 2. Remplit dynamiquement une liste déroulante avec des options numériques allant de 1 à 24.
 * 
 * @function
 * Gestionnaire d'événement sur le bouton de déconnexion :
 * - Quand le bouton avec l'ID `logoutButton` est cliqué, l'utilisateur est redirigé vers la route `/logout`.
 * 
 * @function
 * Génération dynamique de la liste déroulante :
 * - La liste déroulante est ciblée par son ID `Number`.
 * - Des options numérotées de 1 à 24 sont ajoutées à cette liste.
 * - Chaque option a une `value` correspondant au numéro et un texte affiché identique.
 */
document.getElementById('logoutButton').addEventListener('click', function () {
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

/**
 * Script pour gérer les interactions de l'utilisateur avec le formulaire et les boutons de mise à jour.
 * @module scripts/formInteractions
 * 
 * @description
 * Ce script gère plusieurs fonctionnalités liées à l'interface utilisateur :
 * 1. Cacher le formulaire de modification (`formCatways`) par défaut.
 * 2. Ajouter des écouteurs d'événements sur les boutons "modifier" pour afficher le formulaire et remplir ses champs
 *    avec les données de la ligne correspondante.
 * 3. Empêcher la modification de certains champs comme `Number` et `Type`.
 * 4. Masquer le formulaire après l'envoi de la requête d'ajout ou de mise à jour.
 * 5. Assurer un défilement fluide en haut de la page lorsque le formulaire est affiché.
 * 
 * @function
 * @name DOMContentLoaded
 * Gère les actions principales après que le DOM est chargé :
 * - Cacher le formulaire de modification.
 * - Assurer l'ajout dynamique des événements pour chaque bouton "modifier".
 * - Masquer le formulaire une fois une action soumise.
 * 
 * @function update
 * Met à jour les champs du formulaire avec les données récupérées :
 * - Renseigne les champs `id`, `State`, `Number` et `Type`.
 * - Désactive les champs `Number` et `Type` pour éviter leur modification.
 */
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
            const catwaysId = parentRow.querySelector('.catwaysId').dataset.id;
            const catwaysNumber = parentRow.querySelector('.catwaysNumber').dataset.number;
            const catwaysType = parentRow.querySelector('.catwaysType').dataset.types;
            const catwaysState = parentRow.querySelector('.catwaysState').dataset.state;


            const btnAddCatway = document.getElementById('btnAddCatway');
            const btn_submit = document.getElementById('btn_submit')



            if (formCatways.style.display === 'none') {
                formCatways.style.display = 'block';
                divSecret_question.style.display = 'none';
                btnAddCatway.textContent = 'fermer modifier';
                btn_submit.textContent = 'Mettre a jour'



            }

            update(catwaysId, catwaysNumber, catwaysType, catwaysState);
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
    function update(id, number, types, state) {

        document.getElementById('id').value = id;
        document.getElementById('State').value = state;

        const selectNumber = document.getElementById('Number');
        selectNumber.value = number;
        selectNumber.disabled = true;

        const selectType = document.getElementById('Type');
        selectType.value = types;
        selectType.disabled = true;


    }

    update();
});


/**
 * Masque l'élément contenant la classe `secret_question`.
 * @function
 * @memberof module:userInterface
 * 
 * @description
 * Ce code sélectionne l'élément HTML ayant la classe `secret_question` et modifie son style
 * pour masquer l'élément (`display: 'none'`). Cela peut être utilisé pour cacher une section 
 * de formulaire ou tout autre contenu à l'utilisateur.
 */
const divSecret_question = document.querySelector('.secret_question');
divSecret_question.style.display = 'none';



// masquer le formulaire d'ajout ou modification et restaurer ses valeur a zéro

/**
 * Gère l'affichage et la réinitialisation du formulaire d'ajout ou de mise à jour des catways.
 * @function
 * @memberof module:formInteractions
 * 
 * @description
 * Cette fonction configure un gestionnaire d'événement sur le bouton `btnAddCatway` pour :
 * - Afficher ou masquer le formulaire `formCatways`.
 * - Réinitialiser les champs du formulaire (id, state, type, et number) lorsqu'il est affiché.
 * - Activer ou désactiver les sélections `Number` et `Type` en fonction du contexte.
 * - Modifier le texte du bouton pour refléter l'état actuel (`Masquer formulaire` ou `ajouter un catway`).
 * - Faire défiler la fenêtre en haut de la page lorsque le formulaire s'affiche.
 */
function formBtnAdd() {
    const formCatways = document.getElementById('formCatways');
    const btnAddCatway = document.getElementById('btnAddCatway');

    const divSecret_question = document.querySelector('.secret_question');



    btnAddCatway.addEventListener('click', () => {

        const btn_submit = document.getElementById('btn_submit')

        document.getElementById('id').value = "";
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
            btn_submit.textContent = 'Envoyer'

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

/**
 * Script pour gérer l'affichage d'un tableau de résultats.
 * @module scripts/resultToggle
 * 
 * @description
 * Ce script effectue les actions suivantes :
 * 1. Cache initialement l'élément contenant les résultats (`#allResult`).
 * 2. Ajoute un gestionnaire d'événement sur le bouton ayant la classe `.all` pour afficher ou masquer les résultats.
 * 3. Modifie dynamiquement le texte du bouton en fonction de l'état d'affichage (`Masquer tout` ou `afficher tout`).
 * 
 * @function DOMContentLoaded
 * Exécute les actions après que le DOM a été complètement chargé :
 * - Masque initialement l'élément de résultats.
 * - Appelle la fonction `listAllResult` pour gérer l'affichage dynamique des résultats.
 * 
 * @function listAllResult
 * Ajoute un écouteur d'événement sur le bouton et alterne l'affichage de l'élément de résultats :
 * - Si les résultats sont masqués (`display: 'none'`), l'élément passe en mode tableau (`display: 'table'`) et
 *   le texte du bouton est mis à jour en `Masquer tout`.
 * - Sinon, l'élément est masqué à nouveau et le texte du bouton revient à `afficher tout`.
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
                btnAllResult.textContent = 'afficher tout';
            }
        });
    }

    listAllResult();
});





//masquer ou afficher le resultats avec un bouton apres recherche d'un catwway
/**
 * Script pour gérer l'affichage des résultats de recherche et réinitialiser le champ de recherche.
 * @module scripts/searchInteraction
 * 
 * @description
 * Ce script gère deux fonctionnalités principales :
 * 1. Masque initialement l'élément contenant les résultats de recherche (`#searchResult`) ou utilise son affichage par défaut.
 * 2. Ajoute un gestionnaire d'événement sur le bouton de réinitialisation (`#btnReset`) pour :
 *    - Réinitialiser la valeur du champ de recherche (`#searchInput`) à une chaîne vide.
 *    - Afficher ou masquer les résultats de recherche en alternant leur visibilité.
 *    - Mettre à jour dynamiquement le texte du bouton (`Masquer la recherche` ou `afficher la recherche`) en fonction de l'état actuel.
 * 
 * @function DOMContentLoaded
 * Initialise les actions après le chargement complet du DOM :
 * - Définit le style d'affichage initial des résultats de recherche.
 * - Appelle la fonction `reset` pour gérer l'interaction avec le bouton.
 * 
 * @function reset
 * Ajoute un événement `click` au bouton de réinitialisation :
 * - Vide le champ de recherche.
 * - Alterne la visibilité des résultats de recherche (`#searchResult`) et met à jour le texte du bouton.
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


/**
 * Script pour gérer la suppression dynamique des catways via un formulaire global.
 * @module scripts/dynamicDeletion
 * 
 * @description
 * Ce script ajoute des gestionnaires d'événements aux boutons ayant la classe `.inputDelete` pour :
 * 1. Récupérer dynamiquement les données associées à chaque catway (ID, numéro, état, type) à partir des attributs `data-*`.
 * 2. Injecter ces données dans les champs d'un formulaire global (`#globalDeleteForm`).
 * 3. Soumettre automatiquement le formulaire pour effectuer la suppression.
 * 
 * @function
 * Ajoute un gestionnaire d'événement `click` sur chaque bouton de suppression :
 * - Lorsqu'un bouton est cliqué, les données du catway correspondant sont récupérées et insérées dans le formulaire global.
 * - Le formulaire est ensuite soumis automatiquement pour traiter la suppression.
 */
document.querySelectorAll('.inputDelete').forEach(button => {
    button.addEventListener('click', event => {
        const form = document.getElementById('globalDeleteForm');

        // Récupération des données dynamiques
        const catwaysId = button.dataset.id;
        const catwaysNumber = button.dataset.number;
        const catwaysState = button.dataset.state;
        const catwaysType = button.dataset.types;

        // Injecter les valeurs dans le formulaire global
        form.querySelector('#form_id').value = catwaysId;
        form.querySelector('#form_catwaysNumber').value = catwaysNumber;
        form.querySelector('#form_catwaysState').value = catwaysState;
        form.querySelector('#form_catwaysType').value = catwaysType;

        // Soumettre le formulaire
        form.submit();
    });
});






//  method delete
/**
 * Script pour gérer la soumission asynchrone du formulaire de suppression globale.
 * @module scripts/deleteFormHandler
 * 
 * @description
 * Ce script ajoute un gestionnaire d'événement `submit` au formulaire avec l'ID `globalDeleteForm` pour :
 * 1. Empêcher l'envoi par défaut du formulaire.
 * 2. Collecter dynamiquement les données du formulaire sous forme d'objet JSON.
 * 3. Envoyer une requête HTTP DELETE à l'endpoint `/admin/catways/delete` avec les données du formulaire.
 * 4. Gérer les réponses du serveur :
 *    - Si la suppression réussit, une redirection est effectuée vers une URL spécifiée.
 *    - Si une erreur survient, des messages d'erreur sont affichés dans la console.
 * 
 * @function
 * @name onSubmit
 * Ajoute un événement `submit` au formulaire global :
 * - Prépare les données via `FormData` et les convertit en JSON.
 * - Effectue une requête DELETE asynchrone pour supprimer une ressource sur le serveur.
 * - Gère les cas de succès ou d'erreur.
 */
document.getElementById('globalDeleteForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Empêche l'envoi par défaut du formulaire

    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    try {
        const response = await fetch('/admin/catways/delete', {
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
 * Script pour gérer la mise à jour dynamique des catways via un formulaire global.
 * @module scripts/updateCatwaysHandler
 * 
 * @description
 * Ce script ajoute un gestionnaire d'événements sur les boutons ayant la classe `.updateBtn` pour :
 * 1. Vérifier et gérer l'existence de deux formulaires (`formCatwaysPut` et `formCatways`).
 * 2. Changer dynamiquement l'ID du formulaire si nécessaire pour le rendre prêt à gérer une mise à jour.
 * 3. Configurer un gestionnaire d'événements `submit` sur le formulaire pour :
 *    - Collecter les données du formulaire en JSON.
 *    - Effectuer une requête HTTP PUT à l'endpoint `/admin/catways/put` avec les données collectées.
 *    - Gérer les réponses du serveur, avec un éventuel message de succès ou d'erreur.
 *    - Rediriger l'utilisateur après une mise à jour réussie.
 * 
 * @function
 * Ajoute un gestionnaire d'événements `click` sur chaque bouton de mise à jour :
 * - Récupère ou configure dynamiquement le formulaire destiné à la mise à jour.
 * - Ajoute un événement `submit` pour envoyer les données en PUT et traiter les retours serveur.
 */
document.querySelectorAll('.updateBtn').forEach(button => {
    button.addEventListener('click', () => {
        const formPut = document.getElementById('formCatwaysPut');
        const formAdd = document.getElementById('formCatways');

        if (formAdd || formPut) {
            if (!formPut) {
                formAdd.id = 'formCatwaysPut'; // Change l'ID du formulaire
                console.log('L\'ID du formulaire a été changé en :', formAdd.id);
            }



            // Ajoutez l'écouteur d'événements submit après avoir changé l'ID
            document.getElementById('formCatwaysPut').addEventListener('submit', async function (event) {
                event.preventDefault();

                const formData = new FormData(this);
                const data = {};
                formData.forEach((value, key) => {
                    data[key] = value;
                });

                try {
                    const response = await fetch('/admin/catways/put', {
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
 * Script pour gérer l'ajout dynamique de catways via un formulaire global.
 * @module scripts/addCatwaysHandler
 * 
 * @description
 * Ce script configure un gestionnaire d'événements sur le bouton avec l'ID `btnAddCatway` pour :
 * 1. Vérifier l'existence des formulaires `formCatwaysPut` et `formCatways`.
 * 2. Si le formulaire `formCatways` n'existe pas, changer dynamiquement l'ID du formulaire `formCatwaysPut` en `formCatways`.
 * 3. Configurer un gestionnaire `submit` sur le formulaire pour :
 *    - Collecter les données du formulaire sous forme d'objet JSON.
 *    - Envoyer une requête HTTP POST à l'endpoint `/admin/catways/add`.
 *    - Gérer la réponse du serveur :
 *      - En cas de succès, rediriger l'utilisateur vers l'URL spécifiée dans la réponse.
 *      - En cas d'échec, afficher les erreurs correspondantes dans la console.
 * 
 * @function
 * Gestionnaire d'événement `click` sur le bouton d'ajout :
 * - Active le formulaire d'ajout ou reconfigure dynamiquement un formulaire existant pour traiter une requête POST.
 * - Définit un gestionnaire `submit` pour envoyer les données saisies à l'endpoint correspondant.
 */
document.getElementById('btnAddCatway').addEventListener('click', () => {
    const formPut = document.getElementById('formCatwaysPut');
    const formAdd = document.getElementById('formCatways');
    if (formPut || formAdd) {
        if (!formAdd) {
            formPut.id = 'formCatways'; // Change l'ID du formulaire
            console.log('L\'ID du formulaire a été changé en :', formPut.id);
        }



        // Ajoutez l'écouteur d'événements submit après avoir changé l'ID
        document.getElementById('formCatways').addEventListener('submit', async function (event) {
            event.preventDefault();

            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            try {
                const response = await fetch('/admin/catways/add', {
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