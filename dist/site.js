'use strict';
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const modelName={dent:'Remplacer une dent',multiple:'Remplacer plusieurs dents',eclat:'Explorer le blanchiment',alignement:'Explorer l’alignement',avis:'Comprendre mes possibilités'};
const flow=$('#evaluation-dialog'),info=$('#info-dialog');
const comparisonMarkup='<div class="comparison" data-comparison style="--split:50%"><div class="comparison-base" role="img" aria-label="Aperçu fictif avec une dent remplacée"></div><div class="comparison-before" role="img" aria-label="Exemple fictif avec une dent manquante"></div><div class="comparison-labels"><span>Avant · exemple</span><span>Aperçu illustratif</span></div><div class="comparison-line"><span>↔</span></div><input type="range" min="0" max="100" value="50" aria-label="Comparer l’exemple avant et l’aperçu"></div>';
const guides=[
 {name:'De face',title:'Votre sourire de face',text:'Placez votre visage au centre du cadre. Une lumière naturelle, un sourire détendu.',svg:'<ellipse cx="65" cy="72" rx="40" ry="53"/><path d="M12 176c0-35 23-53 53-53s53 18 53 53M49 65h2m28 0h2M49 93q16 15 32 0"/>'},
 {name:'Votre sourire',title:'Une vue rapprochée',text:'Rapprochez le téléphone de votre sourire. Montrez vos dents, sans forcer.',svg:'<path d="M8 55q57-46 114 0v46q-57 47-114 0ZM8 79h114M28 50v58m20-64v74m20-75v74m20-67v60m20-52v42"/>'},
 {name:'De profil',title:'Votre profil',text:'Tournez légèrement la tête sur le côté. Le profil est facultatif.',svg:'<path d="M36 127V98c-20-13-21-56-1-73 18-15 49-10 54 20l18 25-18 7v18c0 15-11 24-28 24v13M16 179c0-25 14-46 45-47 25 1 42 15 48 40M74 48h3"/>'}
];
const state={view:'photos',phase:0,photoIndex:0,photos:[null,null,null],need:location.pathname.includes('implants')?'dent':'avis',answers:[null,null,null],question:0,contact:{name:'',phone:'',email:'',preference:'SMS',message:'',consent:false,reminders:true},date:null,time:null,week:0,done:false};
let stream=null,photoBusy=false;
const dates=(()=>{const result=[];const next=new Date();next.setHours(12,0,0,0);next.setDate(next.getDate()+1);while(result.length<15){if(next.getDay()!==0&&next.getDay()!==6)result.push(new Date(next));next.setDate(next.getDate()+1)}return result})();
const fmtDate=date=>date?.toLocaleDateString('fr-CA',{weekday:'long',day:'numeric',month:'long',year:'numeric'})??'';
const btn=(text,id,outline=false,disabled=false)=>'<button type="button" class="btn '+(outline?'outline':'')+'" id="'+id+'" '+(disabled?'disabled':'')+'>'+text+' '+arrow+'</button>';
function syncBody(){document.body.classList.toggle('dialog-open',flow.open||info.open)}
function stopCamera(){if(stream){stream.getTracks().forEach(track=>track.stop());stream=null}}
function clearPhotos(){state.photos.forEach(photo=>{if(photo)URL.revokeObjectURL(photo.url)});state.photos=[null,null,null]}
function error(text){const item=$('#flow-error');item.textContent=text;item.hidden=!text}
function setView(view){stopCamera();state.view=view;renderFlow();flow.scrollTo({top:0,behavior:'instant'})}
function openFlow(goal){
 if(info.open)info.close();
 if(goal&&modelName[goal]){state.need=goal;if(state.answers[0]&&state.answers[0]!==modelName[goal]){state.answers=[null,null,null];state.question=0;state.view='quiz'}}
 if(!flow.open)flow.showModal();syncBody();renderFlow();
}
function renderPhoto(){
 const guide=guides[state.photoIndex],photo=state.photos[state.photoIndex],count=state.photos.filter(Boolean).length;
 return '<h2>Votre sourire,<br><em>si vous le souhaitez.</em></h2><p class="flow-intro">Deux à trois photos peuvent donner du contexte à votre projet. Vous pouvez aussi continuer sans photo.</p>'+
 '<div class="camera-layout"><div class="camera-frame" id="camera-frame">'+(photo?'<img src="'+photo.url+'" alt="Votre photo '+esc(guide.name)+'">':'<svg viewBox="0 0 130 190" fill="none" stroke="#8b7c66" stroke-width="1.5" aria-hidden="true">'+guide.svg+'</svg>')+'<div class="camera-overlay"></div><span class="camera-view-label">'+(state.photoIndex+1)+' / 3 · '+esc(guide.name)+'</span></div><div class="photo-guide-copy"><p class="eyebrow">UNE CONSIGNE À LA FOIS</p><h3>'+esc(guide.title)+'</h3><p>'+esc(guide.text)+'</p><div class="photo-actions"><button type="button" id="camera-button">'+(photo?'Reprendre':'Ouvrir la caméra')+'</button><button type="button" id="import-button">Importer</button>'+(photo?'<button type="button" id="remove-photo">Retirer</button>':'')+'</div><input type="file" id="photo-input" accept="image/*" hidden><input type="file" id="camera-input" accept="image/*" capture="user" hidden></div></div>'+
 '<div class="photo-thumbs">'+guides.map((item,index)=>'<button type="button" class="photo-thumb '+(index===state.photoIndex?'active ':'')+(state.photos[index]?'filled':'')+'" data-photo-index="'+index+'">'+(state.photos[index]?'<img src="'+state.photos[index].url+'" alt="">':'<span>0'+(index+1)+'</span>')+'<span>'+esc(item.name)+'</span></button>').join('')+'</div>'+
 '<p class="flow-note">Vos photos restent dans cette session du navigateur. Aucun fichier n’est envoyé. Vous pouvez les retirer à tout moment.</p>'+
 '<div class="flow-cta-row">'+btn(state.photoIndex===2?'Voir l’aperçu illustratif':'Photo suivante','photo-next',false,!photo)+(state.photoIndex===2&&count>=2?'<button type="button" class="text-button" id="skip-profile">Passer le profil</button>':'')+'<button type="button" class="text-button" id="skip-photos">Continuer sans photos</button></div>';
}
function renderPreview(){
 return '<div class="preview-flow"><h2>Un aperçu pour<br><em>ouvrir la conversation.</em></h2><p class="flow-intro">Explorez une possibilité en déplaçant le curseur.</p>'+comparisonMarkup+'<p class="flow-note">Exemple fictif : cet aperçu n’est pas généré à partir de vos photos. Il ne constitue ni un diagnostic ni une prédiction de résultat.</p><div class="flow-cta-row">'+btn('Parler de mon projet','preview-next')+'</div></div>';
}
function quizDefinition(){
 return [
 {topic:'VOTRE BESOIN',title:'Qu’aimeriez-vous explorer ?',intro:'Choisissez ce qui correspond le mieux à votre projet.',choices:state.need==='multiple'?['Remplacer plusieurs dents','Remplacer une dent','Comprendre mes possibilités']:state.need==='dent'?['Remplacer une dent','Remplacer plusieurs dents','Comprendre mes possibilités']:state.need==='eclat'?['Explorer le blanchiment','Explorer l’alignement','Remplacer une dent','Comprendre mes possibilités']:state.need==='alignement'?['Explorer l’alignement','Explorer le blanchiment','Remplacer une dent','Comprendre mes possibilités']:['Remplacer une dent','Remplacer plusieurs dents','Explorer le blanchiment','Explorer l’alignement','Comprendre mes possibilités']},
 {topic:'VOTRE ÉCHÉANCE',title:'Quand aimeriez-vous avancer ?',intro:'Votre rythme compte. Il n’y a pas de bonne ou de mauvaise réponse.',choices:['Dès que possible','Dans les prochains mois','Je prends le temps de m’informer']},
 {topic:'VOTRE BUDGET',title:'Où en êtes-vous avec le budget ?',intro:'Une indication pour préparer la discussion, sans vous engager.',choices:['Moins de 5 000 $ CAD','De 5 000 à 10 000 $ CAD','De 10 000 à 25 000 $ CAD','Plus de 25 000 $ CAD','J’ai besoin d’un devis']}
 ];
}
function renderQuiz(){
 const question=quizDefinition()[state.question];
 return '<div class="quiz-subprogress" aria-label="Question '+(state.question+1)+' sur 3">'+[0,1,2].map(i=>'<span class="'+(i<=state.question?'active':'')+'"></span>').join('')+'</div><h2>'+esc(question.title)+'</h2><p class="flow-intro">'+esc(question.intro)+'</p><div class="quiz-options">'+question.choices.map((choice,index)=>'<button type="button" class="quiz-option '+(state.answers[state.question]===choice?'chosen':'')+'" data-answer="'+index+'"><span>'+esc(choice)+'</span><span aria-hidden="true">↗</span></button>').join('')+'</div><p class="flow-note">Vos réponses préparent l’échange. Elles ne déterminent pas votre admissibilité à un traitement.</p>';
}
function renderContact(){
 const c=state.contact;
 return '<h2>Comment pouvons-nous<br><em>vous joindre ?</em></h2><p class="flow-intro">Quelques coordonnées pour préparer la suite de votre demande.</p><form class="contact-form" id="contact-form"><label class="field">Votre nom<input name="name" autocomplete="name" required maxlength="80" placeholder="Prénom et nom" value="'+esc(c.name)+'"></label><div class="form-grid"><label class="field">Téléphone<input name="phone" type="tel" autocomplete="tel" maxlength="30" placeholder="514 555 0000" value="'+esc(c.phone)+'"></label><label class="field">Email<input name="email" type="email" autocomplete="email" maxlength="254" placeholder="vous@exemple.ca" value="'+esc(c.email)+'"></label></div><label class="field">Votre préférence de contact<select name="preference">'+['SMS','Email','Appel'].map(value=>'<option '+(c.preference===value?'selected':'')+'>'+value+'</option>').join('')+'</select></label><label class="field">Une question à ajouter ? <span>(facultatif)</span><textarea name="message" maxlength="500" placeholder="Ce que vous aimeriez aborder pendant votre évaluation…">'+esc(c.message)+'</textarea></label><label class="check-label"><input type="checkbox" name="consent" required '+(c.consent?'checked':'')+'><span>J’accepte d’être contacté au sujet de ma demande. Le créneau souhaité devra être confirmé par l’équipe.</span></label><label class="check-label"><input type="checkbox" name="reminders" '+(c.reminders?'checked':'')+'><span>Je souhaite recevoir les rappels de mon rendez-vous une fois confirmé.</span></label><p class="flow-note">Site modèle : vos réponses restent dans cette session. Aucun message n’est envoyé et aucune donnée n’est conservée après rechargement.</p><button type="submit" class="btn">Choisir mon créneau '+arrow+'</button></form>';
}
function renderBooking(){
 const subset=dates.slice(state.week*5,state.week*5+5),month=subset[0].toLocaleDateString('fr-CA',{month:'long',year:'numeric'});
 return '<h2>Un moment<br><em>qui vous convient.</em></h2><p class="flow-intro">Proposez un créneau pour votre évaluation. La réception devra ensuite vérifier le planning et vous confirmer le rendez-vous.</p><span class="booking-demo">Créneaux illustratifs · aucune réservation réelle</span><div class="date-navigation"><strong>'+esc(month)+'</strong><div><button type="button" id="week-prev" aria-label="Dates précédentes" '+(state.week===0?'disabled':'')+'>‹</button><button type="button" id="week-next" aria-label="Dates suivantes" '+(state.week===2?'disabled':'')+'>›</button></div></div><div class="date-options">'+subset.map((date,i)=>'<button type="button" class="date-button '+(state.date===state.week*5+i?'chosen':'')+'" data-date="'+(state.week*5+i)+'" aria-pressed="'+(state.date===state.week*5+i)+'"><span>'+esc(date.toLocaleDateString('fr-CA',{weekday:'short'}))+'</span><strong>'+date.getDate()+'</strong><span>'+esc(date.toLocaleDateString('fr-CA',{month:'short'}))+'</span></button>').join('')+'</div><p class="time-label">VOTRE PRÉFÉRENCE HORAIRE</p><div class="time-options">'+['9 h 00','11 h 00','14 h 30','16 h 00'].map(time=>'<button type="button" class="time-button '+(state.time===time?'chosen':'')+'" data-time="'+time+'" aria-pressed="'+(state.time===time)+'" '+(state.date===null?'disabled':'')+'>'+time+'</button>').join('')+'</div><p class="slot-summary">'+(state.date!==null?'<strong>'+esc(fmtDate(dates[state.date]))+'</strong>'+(state.time?' · '+esc(state.time):' · choisissez une heure'):'Choisissez un jour pour découvrir les heures.')+'</p><p class="booking-note">Le choix d’un créneau est une demande. Le rendez-vous est confirmé uniquement après validation par la réception.</p><div class="flow-cta-row">'+btn('Vérifier ma demande','booking-next',false,state.date===null||!state.time)+'</div>';
}
function recapMarkup(){
 const c=state.contact;
 const rows=[['Votre projet',state.answers[0]],['Votre échéance',state.answers[1]],['Votre budget',state.answers[2]],['Photos ajoutées',state.photos.filter(Boolean).length+' / 3'],['Votre nom',c.name],['Contact préféré',c.preference==='Email'?c.email:c.phone],['Créneau souhaité',fmtDate(dates[state.date])+' · '+state.time]];
 if(c.message)rows.push(['Votre question',c.message]);
 rows.push(['Rappels après confirmation',c.reminders?'Souhaités':'Non souhaités']);
 return '<dl class="recap-list">'+rows.map(([key,value])=>'<div><dt>'+esc(key)+'</dt><dd>'+esc(value)+'</dd></div>').join('')+'</dl>';
}
function renderRecap(){return '<h2>Votre projet,<br><em>en quelques mots.</em></h2><p class="flow-intro">Vérifiez votre demande avant de terminer le parcours.</p>'+recapMarkup()+'<p class="recap-small">Le créneau devra être confirmé par la réception. Dans cette démonstration, aucune demande n’est transmise et aucun rendez-vous n’est réservé.</p><div class="flow-cta-row">'+btn('Terminer ma demande simulée','finish-request')+'<button type="button" id="edit-contact" class="text-button">Modifier mes coordonnées</button></div>'}
function renderSuccess(){return '<div class="success-view"><span class="success-symbol" aria-hidden="true">✓</span><h2>Votre premier pas<br><em>est fait.</em></h2><span class="success-status">Demande simulée · aucun rendez-vous réservé</span><p>Votre récapitulatif est prêt. Vous pouvez le conserver pour préparer une conversation avec le cabinet.</p>'+recapMarkup()+'<div class="flow-cta-row">'+btn('Conserver mon récapitulatif','download-summary')+'<button type="button" class="text-button" id="restart-flow">Recommencer le parcours</button></div><div class="success-next"><strong>La prochaine étape, dans le parcours prévu :</strong><br>La réception vérifie la demande et confirme le rendez-vous ou propose un autre créneau. Les rappels interviennent après cette confirmation.</div></div>'}
function renderFlow(){
 error('');
 const phase={photos:0,preview:0,quiz:1,contact:2,booking:3,recap:3,success:3}[state.view];state.phase=phase;
 $$('#flow-steps li').forEach((item,i)=>{item.classList.toggle('active',i===phase);item.classList.toggle('complete',i<phase)});
 $('#flow-counter').textContent=state.view==='success'?'PARCOURS TERMINÉ':'ÉTAPE '+(phase+1)+' SUR 4';
 $('#flow-topic').textContent=state.view==='quiz'?'QUESTION '+(state.question+1)+' / 3':['VOS PHOTOS','VOTRE PROJET','VOS COORDONNÉES','VOTRE CRÉNEAU'][phase];
 const renderers={photos:renderPhoto,preview:renderPreview,quiz:renderQuiz,contact:renderContact,booking:renderBooking,recap:renderRecap,success:renderSuccess};
 $('#flow-view').innerHTML=renderers[state.view]();
 const title=$('h2',$('#flow-view'));title.id='flow-title';title.tabIndex=-1;title.focus({preventScroll:true});
 $('#flow-back').hidden=state.view==='success'||(state.view==='photos'&&state.photoIndex===0);
 if(state.view==='contact'){$('#contact-form').addEventListener('input',saveContact);$('#contact-form').addEventListener('change',saveContact);$('#contact-form').addEventListener('submit',submitContact)}
 if(state.view==='photos'){$('#photo-input').addEventListener('change',event=>readPhoto(event.target.files[0]));$('#camera-input').addEventListener('change',event=>readPhoto(event.target.files[0]))}
}
function saveContact(){
 const form=$('#contact-form');if(!form)return;
 const formData=new FormData(form);state.contact={name:String(formData.get('name')??'').trim(),phone:String(formData.get('phone')??'').trim(),email:String(formData.get('email')??'').trim(),preference:String(formData.get('preference')??'SMS'),message:String(formData.get('message')??'').trim(),consent:formData.has('consent'),reminders:formData.has('reminders')};
}
function submitContact(event){
 event.preventDefault();saveContact();const c=state.contact;
 if(!c.name){error('Veuillez indiquer votre nom.');return}
 if(c.preference==='Email'&&!c.email){error('Indiquez un email pour être contacté par email.');$('[name=email]').focus();return}
 const digits=c.phone.replace(/\D/g,'');
 if(c.preference!=='Email'&&(digits.length<10||digits.length>15)){error('Indiquez un numéro complet pour être contacté par téléphone ou SMS.');$('[name=phone]').focus();return}
 if(!c.consent){error('Veuillez confirmer votre accord pour être contacté au sujet de votre demande.');return}
 setView('booking');
}
async function readPhoto(file){
 if(!file||photoBusy)return;
 if(!file.type.startsWith('image/')){error('Choisissez un fichier image JPG, PNG ou WebP.');return}
 if(file.size>12*1024*1024){error('Cette photo est trop volumineuse. Choisissez une image de moins de 12 Mo.');return}
 photoBusy=true;const index=state.photoIndex,url=URL.createObjectURL(file);
 try{
  await new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=reject;image.src=url});
  if(state.view!=='photos'||!flow.open){URL.revokeObjectURL(url);return}
  if(state.photos[index])URL.revokeObjectURL(state.photos[index].url);
  state.photos[index]={url,name:file.name};stopCamera();renderFlow();
 }catch{URL.revokeObjectURL(url);error('Ce format ne peut pas être affiché ici. Essayez une photo JPG, PNG ou WebP.')}
 finally{photoBusy=false}
}
async function camera(){
 if(stream){const video=$('video',$('#camera-frame'));if(!video||!video.videoWidth){error('La caméra se prépare. Attendez un instant.');return}
  const canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;canvas.getContext('2d').drawImage(video,0,0);canvas.toBlob(blob=>{if(blob)readPhoto(new File([blob],'photo-'+state.photoIndex+'.jpg',{type:'image/jpeg'}))},'image/jpeg',.9);return;
 }
 if(!navigator.mediaDevices?.getUserMedia){$('#camera-input').click();return}
 try{
  const index=state.photoIndex,newStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});
  if(!flow.open||state.view!=='photos'||index!==state.photoIndex){newStream.getTracks().forEach(track=>track.stop());return}
  stopCamera();stream=newStream;const frame=$('#camera-frame');frame.innerHTML='<video autoplay muted playsinline></video><div class="camera-overlay"></div><span class="camera-view-label">Placez votre sourire dans le cadre</span>';
  const video=$('video',frame);video.srcObject=stream;await video.play();$('#camera-button').textContent='Prendre la photo';error('');
 }catch{stopCamera();error('La caméra n’est pas accessible. Vous pouvez importer une photo ou continuer sans photos.')}
}
function back(){
 if(state.view==='photos'&&state.photoIndex>0){stopCamera();state.photoIndex--;renderFlow();return}
 if(state.view==='quiz'&&state.question>0){state.question--;renderFlow();return}
 const prev={preview:'photos',quiz:state.photos.some(Boolean)?'preview':'photos',contact:'quiz',booking:'contact',recap:'booking'};
 if(prev[state.view])setView(prev[state.view]);
}
function restart(){stopCamera();clearPhotos();Object.assign(state,{view:'photos',phase:0,photoIndex:0,need:location.pathname.includes('implants')?'dent':'avis',answers:[null,null,null],question:0,contact:{name:'',phone:'',email:'',preference:'SMS',message:'',consent:false,reminders:true},date:null,time:null,week:0,done:false});renderFlow();flow.scrollTo({top:0,behavior:'instant'})}
function download(){
 const c=state.contact,lines=['ÉPURE — RÉCAPITULATIF DE DÉMONSTRATION','Aucune demande envoyée. Aucun rendez-vous réservé.','',...state.answers.map((value,i)=>['Besoin','Échéance','Budget'][i]+': '+value),'Nom: '+c.name,'Téléphone: '+c.phone,'Email: '+c.email,'Contact préféré: '+c.preference,'Créneau souhaité: '+fmtDate(dates[state.date])+' · '+state.time,'Photos ajoutées: '+state.photos.filter(Boolean).length+' (non incluses dans ce fichier)','Rappels souhaités: '+(c.reminders?'Oui':'Non'),c.message?'Question: '+c.message:'','', 'Le créneau devra être vérifié et confirmé par la réception.'];
 const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='mon-projet-de-sourire.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function showInfo(kind){
 const treatment={
 eclat:{eyebrow:'UN SOURIRE PLUS LUMINEUX',title:'Parlons de l’éclat<br><em>de votre sourire.</em>',copy:'<p>La couleur de vos dents vous préoccupe ? Une évaluation est un point de départ pour exprimer vos attentes et comprendre les possibilités.</p><p>Le professionnel pourra vous expliquer les options, leurs limites et les coûts avant que vous preniez une décision.</p><p>Vous pouvez préparer votre projet en quelques étapes, avec ou sans photos.</p>'},
 alignement:{eyebrow:'UN SOURIRE PLUS HARMONIEUX',title:'Comprendre<br><em>vos possibilités.</em>',copy:'<p>Vous aimeriez parler de l’alignement de vos dents ? Commencez par ce qui vous gêne ou ce que vous souhaitez comprendre.</p><p>L’évaluation avec le professionnel permettra d’examiner votre situation et de discuter des options, du calendrier et des coûts.</p><p>Le questionnaire en ligne prépare cet échange et ne remplace pas un examen.</p>'},
 privacy:{eyebrow:'CONFIDENTIALITÉ DE CETTE DÉMONSTRATION',title:'Vos informations<br><em>restent ici.</em>',copy:'<p>Ce site représente une clinique fictive. Les formulaires, les photos et le choix de créneau fonctionnent uniquement dans la mémoire de cette session du navigateur.</p><p>Aucune donnée de formulaire ni photo n’est envoyée à un cabinet, à un moteur IA ou à un service de messagerie. Aucun rendez-vous réel n’est créé. Recharger la page efface le parcours.</p><p>La caméra n’est activée qu’à votre demande et se ferme lorsque vous changez d’étape ou fermez le parcours. Les illustrations générées ne représentent pas des patients ou un cabinet réels.</p><p>Les liens externes et le chargement des polices peuvent contacter leurs fournisseurs. Enregistrer le récapitulatif crée un fichier uniquement sur votre appareil.</p>'}
 }[kind];
 $('#info-eyebrow').textContent=treatment.eyebrow;$('#info-title').innerHTML=treatment.title;$('#info-content').innerHTML=treatment.copy;$('#info-dialog').dataset.kind=kind;$('[data-info-start]').hidden=kind==='privacy';info.showModal();syncBody();
}
document.addEventListener('click',event=>{
 const start=event.target.closest('[data-start]');if(start){event.preventDefault();$('.mobile-menu').hidden=true;$('.menu-button').setAttribute('aria-expanded','false');openFlow(start.dataset.start);return}
 const treatment=event.target.closest('[data-treatment]');if(treatment){showInfo(treatment.dataset.treatment);return}
 if(event.target.closest('[data-privacy]')){showInfo('privacy');return}
 if(event.target.closest('[data-close-info]')){info.close();return}
 if(event.target.closest('[data-info-start]')){const kind=info.dataset.kind;info.close();openFlow(kind);return}
 if(event.target.closest('#close-flow')){saveContact();flow.close();return}
 if(!flow.open)return;
 const photoIndex=event.target.closest('[data-photo-index]');if(photoIndex){stopCamera();state.photoIndex=Number(photoIndex.dataset.photoIndex);renderFlow();return}
 const answer=event.target.closest('[data-answer]');if(answer){state.answers[state.question]=quizDefinition()[state.question].choices[Number(answer.dataset.answer)];if(state.question===0){const match=Object.entries(modelName).find(([,label])=>label===state.answers[0]);if(match)state.need=match[0]}if(state.question<2){state.question++;renderFlow()}else setView('contact');return}
 const date=event.target.closest('[data-date]');if(date){state.date=Number(date.dataset.date);state.time=null;renderFlow();return}
 const time=event.target.closest('[data-time]');if(time){state.time=time.dataset.time;renderFlow();return}
 const actions={
 'camera-button':camera,'import-button':()=>$('#photo-input').click(),
 'remove-photo':()=>{const p=state.photos[state.photoIndex];if(p)URL.revokeObjectURL(p.url);state.photos[state.photoIndex]=null;renderFlow()},
 'photo-next':()=>{if(state.photoIndex<2){stopCamera();state.photoIndex++;renderFlow()}else setView('preview')},
 'skip-profile':()=>setView('preview'),
 'skip-photos':()=>{clearPhotos();state.photoIndex=0;setView('quiz')},
 'preview-next':()=>setView('quiz'),
 'booking-next':()=>{if(state.date!==null&&state.time)setView('recap')},
 'week-prev':()=>{state.week=Math.max(0,state.week-1);renderFlow()},
 'week-next':()=>{state.week=Math.min(2,state.week+1);renderFlow()},
 'finish-request':()=>{state.done=true;setView('success')},
 'edit-contact':()=>setView('contact'),
 'download-summary':download,'restart-flow':restart,'flow-back':back
 };
 const button=event.target.closest('button');if(button&&actions[button.id])actions[button.id]();
});
document.addEventListener('input',event=>{if(event.target.matches('[data-comparison] input'))event.target.closest('[data-comparison]').style.setProperty('--split',event.target.value+'%')});
$('.menu-button').addEventListener('click',()=>{const menu=$('.mobile-menu');menu.hidden=!menu.hidden;$('.menu-button').setAttribute('aria-expanded',String(!menu.hidden))});
$$('.mobile-menu a').forEach(link=>link.addEventListener('click',()=>{$('.mobile-menu').hidden=true;$('.menu-button').setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('.mobile-menu').hidden){$('.mobile-menu').hidden=true;$('.menu-button').setAttribute('aria-expanded','false')}});
flow.addEventListener('close',()=>{stopCamera();syncBody()});flow.addEventListener('cancel',saveContact);info.addEventListener('close',syncBody);
for(const dialog of [flow,info])dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});
window.addEventListener('pagehide',stopCamera);
$$('[data-year]').forEach(item=>item.textContent=new Date().getFullYear());
