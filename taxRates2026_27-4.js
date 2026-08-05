/*
  MFJ Services — Pakistan Tax Rate Card
  Tax Year: 2026-27 (Finance Act 2026)
  Last reviewed: 2026-08-04

  HOW TO UPDATE FOR A NEW TAX YEAR:
  - Do NOT edit index.html for rate changes.
  - Copy this file to taxRates20XX_XX.js, update the numbers below,
    and change the <script src="..."> line in index.html to point to the new file.
  - Every table below has a comment noting its legal section and source basis.
    Numbers marked (approx) are general estimates — verify before relying on them.

  Notes on Finance Act 2026-27 structural changes (informational, not calculated here):
  - "Late Filer" is no longer a separate withholding-tax rate tier. Once a person
    appears on the Active Taxpayer List (ATL) — even via late filing with surcharge —
    they get the FILER rate. Only Filer / Non-Filer are used in these calculators.
  - Section 7E (Deemed Income Tax on property) has been abolished.
  - The 7% Federal Excise Duty (FED) on property transfer has been abolished.
*/

const TAX_RATES_2026_27 = {

  meta: {
    taxYear: '2026-27',
    financeAct: 'Finance Act 2026',
    lastReviewed: '2026-08-04'
  },

  /* Section 153 — Withholding Tax on Goods / Services / Contracts.
     Source: FBR rate card + verified public rate tables for TY2026-27. */
  withholding: {
    goods:               { filer: 5,   nonfiler: 10 },   // Company, other goods
    services_general:    { filer: 15,  nonfiler: 30 },   // Unspecified services (legal, consultancy, medical, etc.)
    services_specified:  { filer: 7,   nonfiler: 14 },   // Transport, hospitality, engineering, HR, financial services etc.
    services_it:         { filer: 4,   nonfiler: 8 },    // IT / IT-enabled services
    contract_company:    { filer: 7.5, nonfiler: 15 },   // Contracts — listed/other company (advance tax, adjustable)
    contract_individual: { filer: 8,   nonfiler: 16 },   // Contracts — individual / AOP (minimum tax)
    thresholds: { goods: 75000, services: 30000, contracts: 30000 }, // annual aggregate, Rs

    /* Section 155 — Rent of Immovable Property. Individual/AOP: progressive slabs (annual gross rent),
       non-filer = double the filer amount at every slab. Company: flat rate, no exempt threshold. */
    rent: {
      individualAop: [
        { from: 0,       upTo: 300000,   rate: 0,  base: 0 },
        { from: 300000,  upTo: 600000,   rate: 5,  base: 0 },
        { from: 600000,  upTo: 2000000,  rate: 10, base: 15000 },
        { from: 2000000, upTo: Infinity, rate: 25, base: 155000 }
      ],
      company: { filer: 15, nonfiler: 30 }
    },

    /* Section 231AB — Advance tax on cash withdrawal. Filers: exempt. Non-filers: flat rate once
       the daily aggregate crosses the threshold — applies to the whole amount, not just the excess. */
    cashWithdrawal: {
      thresholdPerDay: 50000,
      filerRate: 0,
      nonFilerRate: 0.8
    }
  },

  /* Section 231B — Advance Tax on Motor Vehicle registration/transfer/leasing.
     Rate = % of vehicle value, by engine-capacity bracket. Non-filer = 3x filer (confirmed pattern). */
  vehicle: {
    brackets: { '850':0.5, '1000':1, '1300':1.5, '1600':2, '1800':3, '2000':5, '2500':7, '3000':9, '9999':12 },
    nonFilerMultiplier: 3
  },

  /* Section 236K (buyer) & 236C (seller) — Advance Tax on Property.
     Filer rates are flat per Budget 2026-27. Non-filer 236K is banded by FBR/DC value (Tenth Schedule).
     Non-filer 236C band is an approximate reference — confirm before relying on it. */
  property: {
    purchase_236K: {
      filerRate: 1.5,
      nonFilerBands: [
        { upTo: 50000000,  rate: 10.5 },
        { upTo: 100000000, rate: 14.5 },
        { upTo: Infinity,  rate: 18.5 }
      ]
    },
    sale_236C: {
      filerRate: 2.75,
      nonFilerRate: 11 // (approx) — exact banded figure not clearly published as of last review
    }
  },

  /* DC / FBR property value lookup — official portals by province */
  dcPortals: {
    punjab: 'https://es.punjab-zameen.gov.pk/eStampCitizenPortal',
    sindh: 'https://www.estamps.gos.pk/eStampCitizenPortal',
    kpk: 'https://revenue.kp.gov.pk/',
    balochistan: 'https://balochistan.gov.pk/departments/board-of-revenue/',
    islamabad: 'https://www.fbr.gov.pk/valuation-of-immovable-properties/131220'
  },
  fbrValuationPortal: 'https://www.fbr.gov.pk/valuation-of-immovable-properties/131220',

  /* Sales Tax — Goods (federal, Sales Tax Act 1990) & Services (provincial).
     Goods: standard rate unchanged at 18% since Finance Act 2023; imported luxury goods/vehicles at 25%.
     Further Tax: extra 4% charged on top of standard rate when the buyer is not STRN-registered (Section 3(1A)).
     Services: each province runs its own revenue authority (PRA/SRB/KPRA/BRA) plus ICT for Islamabad;
     rate depends on where the service is rendered/received, not where the provider is based. */
  salesTax: {
    goods: {
      standard: 18,
      luxuryImport: 25,
      reduced: 5,
      zeroRated: 0,
      exempt: 0,
      furtherTax: 4
    },
    servicesByProvince: {
      punjab:      { label: 'Punjab (PRA)',            standard: 16,   reduced: 5 },
      sindh:       { label: 'Sindh (SRB)',              standard: 15,   reduced: 5, higher: 19.5 },
      kpk:         { label: 'Khyber Pakhtunkhwa (KPRA)', standard: 15 },
      balochistan: { label: 'Balochistan (BRA)',        standard: 15 },
      islamabad:   { label: 'Islamabad (ICT)',          standard: 15,   reduced: 5 },
      gb:          { label: 'Gilgit-Baltistan',         standard: 0 }
    }
  },

  /* Official FBR verification portals — no calculation, just direct links */
  fbrVerification: {
    atl: 'https://www.fbr.gov.pk/categ/active-taxpayer-list-income-tax/51147/30859/71169',
    iris: 'https://iris.fbr.gov.pk/'
  },

  /* Section 37(1A) — Capital Gains Tax on immovable property. Two regimes depending on
     acquisition date (Finance Act 2024 abolished the holding-period taper for NEW acquisitions
     but left it in place for property already held before the cutover).
     Non-filer (post-cutover): taxed at normal progressive rates with a floor of 15% and cap of 45%
     (exact rate depends on total taxable income/gain — left editable here rather than guessed). */
  capitalGainsProperty: {
    cutoverDate: '2024-07-01',
    postCutover: { filerRate: 15, nonFilerMin: 15, nonFilerMax: 45 },
    preCutoverTaper: {
      openPlot:            [{upTo:1,rate:15},{upTo:2,rate:12.5},{upTo:3,rate:10},{upTo:4,rate:7.5},{upTo:5,rate:5},{upTo:6,rate:2.5},{upTo:Infinity,rate:0}],
      constructedProperty: [{upTo:1,rate:15},{upTo:2,rate:10},{upTo:3,rate:7.5},{upTo:4,rate:5},{upTo:Infinity,rate:0}],
      flat:                [{upTo:1,rate:15},{upTo:2,rate:7.5},{upTo:Infinity,rate:0}]
    }
  },

  /* Sections 235 (electricity) & 236 (telecom/internet/prepaid) — advance tax on utility bills.
     Filers are exempt from the electricity deduction entirely; telecom still applies a lower filer rate.
     Gas bills currently have no equivalent domestic advance-tax provision, so it's excluded here. */
  utilityTax: {
    electricityDomestic: { filerRate: 0, nonFilerRate: 7.5, monthlyThreshold: 25000 },
    telecom:              { filerRate: 10, nonFilerRate: 15 } // mobile bill, internet bill, prepaid recharge/load
  },

  /* Vehicle Token Tax, Registration Fee, Transfer Fee, Smart Card Fee, Number Plate Fee are
     provincial (Excise & Taxation) and change often with contradictory published tables — no
     default amounts are provided. Link out to the official portal for the exact current figure. */
  provincialExcisePortals: {
    punjab: 'https://excise.punjab.gov.pk/motorvehicle_tax',
    sindh: 'https://taxportal.excise.gos.pk/',
    kpk: 'https://excise_taxation.kp.gov.pk/page/motorvehicletokentaxrates',
    balochistan: 'https://www.excise.gob.pk/',
    islamabad: 'https://ictadministration.gov.pk/excise-taxation/'
  }

};
