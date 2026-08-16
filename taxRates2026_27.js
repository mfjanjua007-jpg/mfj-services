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
    lastReviewed: '2026-08-13'
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
     New registration/leasing: % of vehicle value, by engine-capacity bracket. Non-filer = 3x filer.
     Used vehicle TRANSFER is different: a flat Rupee amount by bracket (not % of value), reduced
     10% for every full year since first registration, and zero after 5 years. Verified 2026-08-13
     against mytaxcalculator.pk (FBR Withholding Tax Rate Card). */
  vehicle: {
    brackets: { '850':0.5, '1000':1, '1300':1.5, '1600':2, '1800':3, '2000':5, '2500':7, '3000':9, '9999':12 },
    nonFilerMultiplier: 3,
    usedTransferFlatFee: {
      '850':0, '1000':5000, '1300':7500, '1600':12500, '1800':18750, '2000':25000, '2500':37500, '3000':50000, '9999':62500
    },
    usedTransferNonFilerMultiplier: 3,
    usedTransferAgeReductionPerYear: 10, // % reduction for each full year since first registration
    usedTransferMaxAgeYears: 5 // no tax collected once the vehicle is older than this
  },

  /* Section 236K (buyer) & 236C (seller) — Advance Tax on Property.
     Filer rates are flat per Finance Act 2026. Non-filer 236K/236C are banded/flat (Tenth Schedule).
     Verified 2026-08-13 against mytaxcalculator.pk, which cites the Finance Act 2026 PDF directly. */
  property: {
    purchase_236K: {
      filerRate: 1.25,
      nonFilerBands: [
        { upTo: 50000000,  rate: 10.5 },
        { upTo: 100000000, rate: 14.5 },
        { upTo: Infinity,  rate: 18.5 }
      ]
    },
    sale_236C: {
      filerRate: 2.75,
      nonFilerRate: 11.5
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
     Filers are exempt from the domestic electricity deduction entirely. Commercial/industrial
     electricity meters are NOT filer-dependent — same slab for everyone. Telecom/internet/prepaid
     is also NOT filer-dependent — flat 15% for everyone, except a rare 75% rate that applies only
     to people the FBR has publicly named in an order for not filing a return (a different, narrower
     category than ordinary "non-filer"). Gas bills have no equivalent domestic advance-tax provision.
     Verified 2026-08-13 against mytaxcalculator.pk (FBR Withholding Tax Rate Card). */
  utilityTax: {
    electricityDomestic: { filerRate: 0, nonFilerRate: 7.5, monthlyThreshold: 25000 },
    electricityCommercial: {
      // Shop/office and factory meters — same for filers and non-filers.
      exemptUpTo: 500,
      slab1UpTo: 20000, slab1Rate: 10,           // 501–20,000: 10% of the bill
      aboveBase: 1950,                            // above 20,000: Rs 1,950 + rate% of the amount above 20,000
      aboveRateShopOffice: 12,
      aboveRateFactory: 5
    },
    telecom: { flatRate: 15, fbrNamedNonFilerRate: 75 } // mobile bill, internet bill, prepaid recharge/load — flat for everyone; landline is separate (10% above Rs 1,000, not calculated here)
  },

  /* Vehicle Token Tax (yearly, provincial) + Section 234 (federal, collected alongside the token).
     Registration Fee, Transfer Fee, Smart Card Fee, Number Plate Fee remain manual-entry only —
     those are one-off, change often, and no reliable current table was found for them.
     Verified 2026-08-13 against mytaxcalculator.pk, which cites each province's own excise
     department schedule + the FBR WHT Rate Card + Finance Act 2026 directly. */
  vehicleTokenTax: {
    punjab: {
      lifetimeUpTo1000cc: 20000,           // one-off, for the life of the vehicle
      yearlyPctBands: [ { upTo: 2000, pct: 0.3 }, { upTo: Infinity, pct: 0.4 } ], // % of invoice value
      earlyPaymentDiscountPct: 10          // if paid in full by 31 August
    },
    islamabad: {
      lifetimeUpTo1000cc: 20000,
      yearlyPctBands: [ { upTo: 2000, pct: 0.25 }, { upTo: Infinity, pct: 0.35 } ]
    },
    sindh: {
      // flat Rupee amount per year, by engine cc — not a % of value
      yearlyFlatBands: [ { upTo: 1000, amt: 1500 }, { upTo: 1300, amt: 2000 }, { upTo: 1600, amt: 4000 }, { upTo: 2000, amt: 4500 }, { upTo: 2500, amt: 5000 }, { upTo: Infinity, amt: 7000 } ]
    },
    kpk: {
      yearlyFlatBands: [ { upTo: 1000, amt: 2000 }, { upTo: 1300, amt: 3000 }, { upTo: 1500, amt: 4000 }, { upTo: 2500, amt: 5000 }, { upTo: Infinity, amt: 8000 } ]
    },
    balochistan: {
      // Up to 1,000cc: one-off amount while under 5 years old, then a smaller yearly amount after.
      lifetimeUnder5yrsBands: [ { upTo: 660, amt: 10500 }, { upTo: 1000, amt: 12000 } ],
      yearlyFlatBands: [ { upTo: 660, amt: 1000 }, { upTo: 1000, amt: 1100 }, { upTo: 1500, amt: 1400 }, { upTo: 2000, amt: 1700 }, { upTo: Infinity, amt: 2000 } ]
    }
  },
  section234Federal: {
    // Collected alongside the token, based on engine cc. Non-filer = 2x filer. Exempt once the
    // vehicle is more than 10 years old (counted from first registration).
    yearlyBands: [
      { upTo: 1000, filer: 800,   nonfiler: 1600 },
      { upTo: 1199, filer: 1500,  nonfiler: 3000 },
      { upTo: 1299, filer: 1750,  nonfiler: 3500 },
      { upTo: 1499, filer: 2500,  nonfiler: 5000 },
      { upTo: 1599, filer: 3750,  nonfiler: 7500 },
      { upTo: 1999, filer: 4500,  nonfiler: 9000 },
      { upTo: Infinity, filer: 10000, nonfiler: 20000 }
    ],
    exemptAfterYears: 10
  },

  /* Registration Fee, Transfer Fee, Smart Card Fee, Number Plate Fee are provincial (Excise &
     Taxation) and change often with contradictory published tables — no default amounts are
     provided. Link out to the official portal for the exact current figure. */
  provincialExcisePortals: {
    punjab: 'https://excise.punjab.gov.pk/motorvehicle_tax',
    sindh: 'https://taxportal.excise.gos.pk/',
    kpk: 'https://excise_taxation.kp.gov.pk/page/motorvehicletokentaxrates',
    balochistan: 'https://www.excise.gob.pk/',
    islamabad: 'https://ictadministration.gov.pk/excise-taxation/'
  },

  /* PTA Mobile Registration Tax — six FBR charges on registering an imported/unregistered phone
     (none of it goes to PTA; PTA only checks the IMEI). Brackets are by the phone's official
     Customs (C&F) value in US$, not its retail price. Smartphones are exempt from Customs Duty
     and Additional Customs Duty; a flat Rs 250 Customs Duty applies to a basic/non-smart phone.
     Income Tax (Section 148) only applies on the CNIC route — the Passport route (device carried
     in personal baggage, registered within 60 days) is exempt from it. The CNIC route also adds an
     unpublished fine, so any CNIC total here is a minimum, not a final figure.
     Verified 2026-08-13 against mytaxcalculator.pk, which cites SRO 1064(I)/2026, the Sales Tax Act
     1990 Ninth Schedule, Income Tax Ordinance 2001 First Schedule Part II, and Finance Act 2026. */
  ptaTax: {
    basicPhoneCustomsDuty: 250, // flat Rs, non-smartphones only (smartphones are exempt)
    bands: [
      { upTo: 30,  regDuty: 240,   salesTaxPct: 18, incomeTax: 100,   levy: 100   },
      { upTo: 100, regDuty: 2400,  salesTaxPct: 18, incomeTax: 100,   levy: 200   },
      { upTo: 200, regDuty: 6000,  salesTaxPct: 18, incomeTax: 100,   levy: 200   },
      { upTo: 350, regDuty: 8800,  salesTaxPct: 18, incomeTax: 970,   levy: 1800  },
      { upTo: 500, regDuty: 12000, salesTaxPct: 18, incomeTax: 5000,  levy: 4000  },
      { upTo: 700, regDuty: 17600, salesTaxPct: 25, incomeTax: 11500, levy: 8000  },
      { upTo: Infinity, regDuty: 17600, salesTaxPct: 25, incomeTax: 11500, levy: 16000 }
    ],
    bands2025_26: [
      { upTo: 30,  regDuty: 300,   salesTaxPct: 18, incomeTax: 100,   levy: 100   },
      { upTo: 100, regDuty: 3000,  salesTaxPct: 18, incomeTax: 100,   levy: 200   },
      { upTo: 200, regDuty: 7500,  salesTaxPct: 18, incomeTax: 930,   levy: 600   },
      { upTo: 350, regDuty: 11000, salesTaxPct: 18, incomeTax: 970,   levy: 1800  },
      { upTo: 500, regDuty: 15000, salesTaxPct: 18, incomeTax: 5000,  levy: 4000  },
      { upTo: 700, regDuty: 22000, salesTaxPct: 25, incomeTax: 11500, levy: 8000  },
      { upTo: Infinity, regDuty: 22000, salesTaxPct: 25, incomeTax: 11500, levy: 16000 }
    ]
  }

};
