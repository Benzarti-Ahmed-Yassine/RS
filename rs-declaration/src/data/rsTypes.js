export const RS_CATEGORIES = [
  { value: 'RS1',  label: 'RS1 – Loyers' },
  { value: 'RS2',  label: 'RS2 – Rémunération BNC' },
  { value: 'RS3',  label: 'RS3 – Revenus capitaux mobiliers' },
  { value: 'RS4',  label: 'RS4 – Cession valeurs mobilières' },
  { value: 'RS5',  label: 'RS5 – Dividendes' },
  { value: 'RS6',  label: 'RS6 – Cessions FC et immeubles' },
  { value: 'RS7',  label: 'RS7 – Acquisitions marchandises' },
  { value: 'RS8',  label: 'RS8 – Jetons de présence' },
  { value: 'RS9',  label: 'RS9 – Autres rémunérations non-résidents' },
  { value: 'RS11', label: 'RS11 – Jeux de pari et loterie' },
]

export const RS_TYPES = {
  RS1: [
    { id: 'RS1_000001', desc: 'Loyers d\'hôtels servis aux PM et PP soumises à l\'IR (régime réel)', taux: 5 },
    { id: 'RS1_000002', desc: 'Loyers servis à des résidents établis', taux: 5 },
  ],
  RS2: [
    { id: 'RS2_000001', desc: 'Honoraires BNC — forfait d\'assiette, commissions, courtages, rémunérations non commerciales', taux: 3 },
    { id: 'RS2_000002', desc: 'Honoraires BNC régime réel — résidents établis', taux: 3 },
    { id: 'RS2_000003', desc: 'Rémunérations en contrepartie de la performance', taux: 3 },
    { id: 'RS2_000004', desc: 'Rémunérations artistes, créateurs soumis à l\'IR régime réel ou PM (production, diffusion, œuvres)', taux: 3 },
  ],
  RS3: [
    { id: 'RS3_000001', desc: 'Revenus capitaux mobiliers (hors dépôts devise/dinars convertibles) aux résidents soumis IS/IRPP', taux: 20 },
    { id: 'RS3_000003', desc: 'Revenus capitaux mobiliers aux non-résidents autres que banques', taux: 20 },
    { id: 'RS3_000004', desc: 'Revenus capitaux mobiliers aux banques non établies', taux: 20 },
    { id: 'RS3_000005', desc: 'Revenus capitaux mobiliers aux non-établis résidant dans un État à régime fiscal privilégié', taux: 25 },
  ],
  RS4: [
    { id: 'RS4_000001', desc: 'Cession d\'actions, parts sociales et parts de fonds — PM non-résidentes non établies', taux: 5 },
    { id: 'RS4_000002', desc: 'Cession d\'actions, parts sociales et parts de fonds — PP non-résidentes non établies', taux: 5 },
  ],
  RS5: [
    { id: 'RS5_000001', desc: 'Dividendes servis à des personnes physiques résidentes', taux: 10 },
    { id: 'RS5_000002', desc: 'Dividendes servis à des PP et PM non-résidentes', taux: 10 },
    { id: 'RS5_000003', desc: 'Dividendes servis à PP/PM résidentes dans un État à régime fiscal privilégié', taux: 25 },
  ],
  RS6: [
    { id: 'RS6_000001', desc: 'Cession de fonds de commerce par les PM et PP résidentes', taux: 5 },
    { id: 'RS6_000002', desc: 'Cession d\'immeubles dans sociétés immobilières — PM et PP résidentes', taux: 2.5 },
    { id: 'RS6_000003', desc: 'Cession d\'immeubles dans sociétés immobilières — PP non-résidentes', taux: 5 },
    { id: 'RS6_000005', desc: 'Cession d\'immeubles — PM non-résidentes non établies en Tunisie', taux: 5 },
  ],
  RS7: [
    { id: 'RS7_000001', desc: 'Acquisitions ≥ 1 000 D (TVA incluse) — PP et PM IS taux autres que 15% et 10%', taux: 1.5 },
    { id: 'RS7_000002', desc: 'Acquisitions ≥ 1 000 D (TVA incluse) — PP et PM soumises IS taux 15%', taux: 1.5 },
    { id: 'RS7_000003', desc: 'Acquisitions ≥ 1 000 D (TVA incluse) — PP (déduction 2/3) et PM IS taux 10%', taux: 1 },
    { id: 'RS7_000004', desc: 'Commission distributeurs agréés opérateurs télécommunications (personne physique)', taux: 1.5 },
    { id: 'RS7_000005', desc: 'Commission distributeurs agréés opérateurs télécommunications (personne morale)', taux: 1.5 },
  ],
  RS8: [
    { id: 'RS8_000001', desc: 'Jetons de présence et tantièmes — membres conseils, directoires, comités SA résidents', taux: 20 },
    { id: 'RS8_000002', desc: 'Jetons de présence et tantièmes — membres conseils SA non-résidents', taux: 20 },
    { id: 'RS8_000003', desc: 'Jetons de présence SA — résidents dans un État à régime fiscal privilégié', taux: 25 },
  ],
  RS9: [
    { id: 'RS9_000001', desc: 'Rémunérations servis à des non-résidents non établis en Tunisie', taux: 15 },
    { id: 'RS9_000002', desc: 'Redevances servis à des non-résidents non établis en Tunisie', taux: 15 },
    { id: 'RS9_000003', desc: 'Rémunérations aux résidents dans un État à régime fiscal privilégié', taux: 25 },
    { id: 'RS9_000004', desc: 'Rémunérations non-résidents établis ≤ 6 mois — travaux de construction', taux: 3 },
    { id: 'RS9_000005', desc: 'Rémunérations non-résidents établis ≤ 6 mois — opérations de montage', taux: 3 },
    { id: 'RS9_000006', desc: 'Rémunérations non-résidents établis ≤ 6 mois — autres services', taux: 3 },
    { id: 'RS9_000007', desc: 'Rémunérations non-résidents ne procédant pas au dépôt déclaration d\'existence (résidents pays à régime privilégié)', taux: 25 },
    { id: 'RS9_000008', desc: 'Rémunérations non-résidents résidant dans pays à régime fiscal privilégié sans déclaration d\'existence', taux: 25 },
  ],
  RS11: [
    { id: 'RS11_000001', desc: 'Jeux de pari et loterie (hors paris mutuels courses de chevaux et concours de pronostics sportifs)', taux: 20 },
  ],
}
