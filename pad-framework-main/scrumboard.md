# Scrum & GitLab documentatie

## 1 Uitleg

### 1.1 Stappenplan Product Backlog 
1. Ga naar 'Issues > Boards'.
2. Links bovenin staat een dropdown menu. Selecteer hier 'Sprint Backlog'.
3. Druk op het '+'-symbool in de lijst 'state:to do'. Hiermee maak wordt een nieuwe story aangemaakt.
4. Geef het een correcte naam, voeg een omschrijving toe en gebruik hiervoor [MarkDown](https://www.markdownguide.org/).
5. Als al de ideeën zijn toegevoegd, sleep de belangrijkste dan naar 'state:requirements gathering' Het label past zich dan automatisch aan in het kaartje van de story. 
6. Dubbelklik op het kaartje om deze te wijzigen. Denk met het team na over de story en voeg met MarkDown alle requirements toe in de omschrijving. Voeg dan ook eventuele designs toe met de upload optie. 
7. Mocht een story heel groot van omvang zijn. Voeg dan in de story onder labels het label 'type:epic' toe. Sleep deze terug naar ideas. Deze story moet namelijk eerst worden opgedeeld in kleinere userstories. 
8. Als de user story de benodigde requirements heeft, sleep deze naar 'state:ready for estimating'. Klaar met al de user stories in deze lijst? Ga dan door naar de volgende stap. 
9. Ga sprint-pokeren met elke story, ken ze een 'weight' toe. Als je stories klaar zijn sleep deze dan naar 'state:ready for sprint'.  Klaar met al de user stories in deze lijst? Ga dan door naar de volgende stap.
10. Zijn al je stories gereed. Open het kaartje, geef ze de correcte milestone (sprint 1, 2, 3 of 4). Als nu al bekend is dat een story in een latere sprint gemaakt gaat worden, dan kan dit nu al aan die sprint worden toegewezen. Verander ook de state naar 'state:to do'. __Let op__: Stop pas met bewerken als beide zijn gedaan! Anders is de story niet langer zichtbaar op je boards. 

### 1.2 Stappenplan Sprint Board
1. Als je een User Story gaat ontwikkelen. Dubbelklik dan op de story. Controleer de requirements en voeg eventueel technische taken toe die uitgevoerd moeten worden onder 'tasks'.
2. Voeg jezelf toe als Assignee onder Assignees. 
3. Je kunt de story verder aanpassen aan eigen wensen:
  * Een due date toevoegen, zodat het op tijd is voor oplevering.
  * Tracken hoe lang iets duurt? Dan kun dit worden bijgehouden in 'Time tracking'.
  * Een D.O.D. nalopen. Je kunt hiervoor een checklist maken in de omschrijving. 
4. Is de userstory klaar voor ontwikkelen, stop met bewerken en sleep hem naar 'state:doing'. 
5. Als al het ontwikkel werk aan een story klaar is, sleep hem dan naar 'state:verify. 
6. Voor je een nieuwe story oppakt. Kijk of de sprint nog stories in verify heeft staan die niet van jou zijn. Ga deze dan eerst wegwerken.
7. Afhankelijk van de teamafspraken zal het stappenplan iets afwijken, maar een story kan van 'state:verify' naar 'state:done' als:
  * Gecontroleerd is of de vereiste requirements ook werken. 
  * De bijbehorende code is gecontroleerd doormiddel van een code review. 
  * (Vanaf sprint 3) De unit tests voor de code zijn geschreven.
8. Als bij het controleren van een story blijkt dat iets niet klopt. Schrijf dan onderin de story in een comment duidelijk wat mis is. Verwijs duidelijk naar de coderegels die aanpassing nodig hebben, of requirements die missen, incorrect en/of incompleet zijn. 

### 1.3 F.A.Q.
* __Een story kan ik op geen enkele board vinden?__ --> Ga naar 'Issues > Lists'. Hier kun je zoeken op de naam van een story of bijvoorbeeld een specifieke 'type' of 'state'. Onder het tabblad 'closed' staan user stories die per ongeluk zijn afgesloten. 
* __Hoe kan worden bijgehouden in het kaartje van een user story welke commits hierbij horen?__ --> Onderin elk kaar staat een # met nummer. Als een commit message subject hiermee start. Dan koppelt GitLab dit automatisch aan het bijbehorende kaartje. 
* __Per ongeluk is een 'Board', 'Label', 'List' en/of 'Milestone' verwijderd, hoe kan ik dit herstellen?__ --> :
  * Board: Je kunt nieuwe boards maken onderin de drowdown van boards. Je kunt bij het aanmaken aangeven of deze moet filteren op een milestone. Dus bij welke sprint deze hoort. 
  * List: Rechtsbovenin het board overview staat de knop 'create list'. Bij aanmaken kun je het correcte label weergeven. ,
  * Milestone: Onder 'Issues > Milestones' kun je Milestones toevoegen en aanpassen.
  * Labels: Onder 'Project information > Labels' kun je Labels toevoegen en aanpassen. Wil je ook categoriën in je label? Dan is de syntax zo: '[catergorie]:[naam]'.

## 2 Labels
Voor een aantal vastgestelde elementen die we gebruiken uit Scrum labels gemaakt.

### 2.1 Priority
Vier labels gemaakt om prioriteit vast te stellen. Categorie is "priority":
* Critical
* High
* Medium
* Low

### 2.2 Product backlog & (Current) Sprint
Voor de verschillende fases van product analyse naar user story labels gemaakt. Categorie is "status":
* Ideas
* Requirements gathering
* Ready for estimating
* To do
* Doing
* Verify
* Done

### 2.3 Issue types
Voor de verschillende soorten issues labels gemaakt. Categorie is "type":
* Epic
* User story

## 3 Milestones
Voor elke sprint een milestone aangemaakt. 
* Sprint 1
* Sprint 2
* Sprint 3
* Sprint 4

## 4 Boards
Boards aangemaakt voor de volgende onderdelen"
* Product Backlog
* Sprint 1
* Sprint 2
* Sprint 3
* Sprint 4

### 4.1 Product Backlog
Filtered op No Milestone. Dan zijn aan milestone toegewezen stories meteen niet langer zichtbaar op het bord. De board heeft een totaal van vier lijsten:
* Ideas
* Requirements gathering
* Ready for estimating
* Ready for sprint

### 4.2 Sprint 1, 2, 3 en 4
Geeft een overzicht van de aan de desbetreffende milestone toegewezen User Stories. Vier lijsten zijn toegevoegd:
* To do
* Doing
* Verify
* Done
  

