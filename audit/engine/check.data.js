/* check.data.js, The Audit page version six (November 17, 2026).
   The one file of words an owner reads in the check. It sets window.CHECK, which check.js reads.
   The eight questions, the choices, the formula, the bands and their messages are the team's words,
   copied unchanged from version five's check.js, with nothing added and nothing dropped.
   English only, on Soji's word of November 17 ("Punjabi not needed"): every line an owner reads
   lives in text.en, so another language could later be added as new words only. */
(function () {
  "use strict";

  window.CHECK = {
    version: "Version 6, November 17, 2026",

    /* The team's eight questions. area is the index into text.en.areas and text.en.areaNames. */
    questions: [
      { area: 0, title: "Safety program and accountability",
        text: "Can you show a current safety program that fits your trucking operation, identify who is responsible for safety, and prove the rules are being followed day to day?",
        followup: "Safety program is not consistently verified",
        detail: "Review the safety manual, assigned safety responsibilities and evidence of day-to-day use." },
      { area: 0, title: "Company records and renewals",
        text: "Can you quickly find your Safety Fitness Certificate, insurance, permits and key company records, and show who checks expiry dates, renewals and missing paperwork?",
        followup: "Records or renewals may be difficult to prove",
        detail: "Check permits, insurance, certificates, document storage and expiry reminders." },
      { area: 1, title: "Hiring and driver files",
        text: "For every driver, can you show a complete application, required work history and reference checks, valid licence, and hiring and ongoing driver-abstract reviews?",
        followup: "Driver qualification files may have gaps",
        detail: "Review applications, work history, checks, licence and abstracts." },
      { area: 1, title: "Training and driving-hours checks",
        text: "Can you show driver orientation and safety training, regularly reviewed logbooks or ELD records, checks of available driving hours, and written follow-up when problems are found?",
        followup: "Training or Hours of Service monitoring may be incomplete",
        detail: "Check training evidence, log reviews, hours available and written corrective action." },
      { area: 2, title: "Maintenance and inspection records",
        text: "For every truck and trailer, can you show the required current inspections, a preventive-maintenance plan, and dated records of servicing, repairs and completed inspections?",
        followup: "Equipment maintenance records may be incomplete",
        detail: "Check inspection status, preventive service schedules, work orders and repair records." },
      { area: 2, title: "Daily inspections and defects",
        text: "Do drivers complete the required trip inspections, report defects promptly, and does your company keep the reports, document repairs and prevent unsafe vehicles from being used?",
        followup: "Daily inspection and defect follow-up may be weak",
        detail: "Check trip reports, defect reporting, repair confirmation and out-of-service controls." },
      { area: 3, title: "Monitoring and follow-up",
        text: "Do you regularly review your Carrier Profile, roadside inspections, tickets and collisions, identify repeat problems, and document who fixed each issue and when?",
        followup: "Safety trends may not be followed to closure",
        detail: "Review Carrier Profile trends, inspections, incidents and corrective-action records." },
      { area: 3, title: "Ready before dispatch",
        text: "Before a truck leaves, do you verify the driver has legal hours and qualifications, the equipment is safe, and the required permits and paperwork are current, and stop dispatch if any key item is missing?",
        followup: "Pre-dispatch checks may not reliably prevent violations",
        detail: "Confirm driver, equipment and trip requirements are checked before dispatch." }
    ],

    units: ["1 to 4", "5 to 20", "21 to 70", "More than 70"],

    bands: [
      { min: 85, name: "Strong Start!",
        msg: ["Great job! Your company appears to have a solid foundation. Having safety procedures and records is one thing; being able to show they are current and followed every day is another. Even well-managed trucking companies can miss small details during an audit.",
              "You are doing well. Let's make sure your records tell the same story."],
        next: "Ask Prime Compliance for a second look at your audit readiness." },
      { min: 60, name: "Almost There!",
        msg: ["You are on the right track, but a few important pieces may be missing. During an audit, it is not just about what your company does; it is about what you can prove. Missing driver records, incomplete maintenance files or overlooked follow-ups can raise unexpected questions.",
              "The good news? You can work on these gaps before they become bigger problems."],
        next: "Let Prime Compliance help you identify what needs attention." },
      { min: 0, name: "Time for a Closer Look!",
        msg: ["Your trucking business works hard every day. Let's make sure your compliance records keep up. Your answers suggest that several important safety and compliance controls may be incomplete or not yet verified. An audit could bring these gaps to light unexpectedly.",
              "You have already taken a useful first step by checking where you stand."],
        next: "Talk to Prime Compliance about where to start." }
    ],

    text: {
      en: {
        /* the four areas, numbered for the question head and named for the result cards */
        areas: ["01 Company administration", "02 Drivers", "03 Equipment", "04 Compliance"],
        areaNames: ["Company administration", "Drivers", "Equipment", "Compliance"],
        stateWord: { ready: "Ready", look: "Needs a look", gap: "Gap to close" },

        /* the four answer choices, in the order the page shows them: Yes, Partly, No, Not sure */
        choiceLabels: ["Yes, all of it", "Partly", "No", "Not sure"],
        choiceShort: ["Yes", "Partly", "No", "Not sure"],

        /* the question head: it counts questions only, with no time left (no countdown) */
        countQuestion: "Question %n%",
        countOf: "of %total%",

        /* the one power units tap */
        unitsOneMore: "One more tap",
        unitsBeforeResult: "before your result",
        unitsArea: "Your fleet",
        unitsTitle: "How many power units do you run?",
        unitsText: "This does not change your result. It tells us how to set up the review for a fleet your size.",

        /* the small encouragements between questions */
        toastGoodStart: "Good start",
        toastHalfway: "Halfway. Four to go.",
        toastAllDone: "All eight done",

        /* the result, written by check.js from these lines */
        tally: "Yes %yes%, Partly %partly%, No %no%, Not sure %notsure%. Points %pts% of 16. Power units: %units%.",
        keptOpen: "From your answers we pick the one area to start with, and we keep it for our meeting, where we open it on your own file. It is drawn only from what you told us.",
        keptAllYes: "At our meeting we take one of your Yes answers and check it against your own file, starting with your driver files, because a formal review may still find gaps.",
        readReport: "Read your full report",
        readReportWithOne: "Read your full report, with %n% more item",
        readReportWithMany: "Read your full report, with %n% more items",
        itemQ: "Q",
        youAnswered: "You answered: ",
        summaryAllYes: "With %units% power units and every area marked Yes, your next step is to check those answers against your own records.",
        summaryOneGap: "With %units% power units, 1 of your 4 areas needs attention, and %area% is where your answers point first.",
        summarySomeGaps: "With %units% power units, %n% of your 4 areas need attention, and %area% is where your answers point first.",
        prizesAllYes: "We start with your driver files and check one of your Yes answers against your own records.",
        prizesGaps: "We start with %area%, the area your answers point to, and open it on your own file.",

        /* layer 2: the area chart, the calm start-with question and day one */
        areaChartLabel: "Your readiness by area, drawn as bars",
        startwithQuestion: "Which area matters most to you right now?",
        waMattersMost: "What matters most to me right now: %area%",
        dayone: "Your first result was %first%% on %date%, and now it is %now%.",

        /* layer 3: the first screen knows who is reading; the words stay in text.en */
        greetPreparedFor: "Prepared for %company%",
        greetTown: ", %town%",

        /* the WhatsApp message the owner reads and sends himself */
        waHello: "Hello Prime Compliance, I took the Are you audit ready? check.",
        waMyName: " My name is %name%.",
        waPowerUnits: "Power units: %units%",
        waScore: "My readiness result: %shown%% (%band%)",
        waTally: "Yes %yes%, Partly %partly%, No %no%, Not sure %notsure%",
        waItems: "Items to review:",
        waAllYes: "I answered Yes to all eight.",
        waListItem: "- ",
        waGap: "Q%n% %title% (%short%)",
        waAreaStart: "Area to start with: %area%",
        waRequest: "I would like to request my audit readiness review."
      }
    }
  };
})();
