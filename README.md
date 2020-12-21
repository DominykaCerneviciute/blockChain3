# Ethereum

## Verslo modelis

![Contract](contract.jpg)

##### Verslo modelyje dalyvauja dvi šalys: pardavėjas(aukciono savininkas) ir aukciono dalyviai. Aukciono veikimo principas:
1. Pardavėjas sukuria aukcijoną nustatydamas jo vykimo trukmę ir pradinę kainą.
2. Aukciono dalyviai stato pasirinktas sumas.
3. Kol nepasibaigė aukciono laikas, pardavėjas gali atšaukti aukcioną, tuo atveju:
    - Pardavėjas nebegali atlikti jokių veiksmų
    - Pirkėjai atsiima savo statytas sumas
4. Kai pasibaigia aukciono laikas, niekas statyti sumų nebegali ir tolesni veiksmai yra:
    - Pardavėjas išsitraukia laimėtojo sumą
    - Pralaimėtojai susigražina statytas sumas
    
##### Įgyvendinimas
1. Kontraktas kurtas ir testuotas Remix IDE
2. Sukūrimui ir testavimui lokaliame tinkle naudotas Ganache 
3. Sąsajos įgalinimui su Ethereum tinklu naudotas metamask
4. Testavimui testiniame tinkle naudojau Ropstan


##### Paleidimas
1. truffle migrate --reset
2. npm run dev
