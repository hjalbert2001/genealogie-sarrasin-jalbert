/* Bouton BACK : ajoute en haut de chaque page un bouton "Page precedente"
   qui ramene a la page d'ou l'on vient (historique du navigateur).
   S'il n'y a pas de page precedente (page ouverte directement),
   le bouton ramene a la page principale (index.htm).
   Le libelle utilise des entites HTML pour rester lisible quelle que
   soit l'encodage de la page. */
(function () {
  var corps = document.body;
  if (!corps) return;
  var bouton = document.createElement('button');
  bouton.type = 'button';
  bouton.id = 'bouton-retour';
  bouton.innerHTML = '&larr; Page pr&eacute;c&eacute;dente';
  bouton.setAttribute('style', 'display:block;margin:14px auto;padding:10px 18px;font-size:17px;font-weight:bold;color:#004080;background:#fff8dc;border:2px solid #004080;cursor:pointer;');
  bouton.onclick = function () {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = 'index.htm';
    }
  };
  corps.insertBefore(bouton, corps.firstChild);
})();
