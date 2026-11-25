/* The Audit, Look E. This is the only file to edit.
   Put the address of the CRM's web form between the quotes after endpoint. Until then the page still works:
   the visitor's tap opens WhatsApp to 780-209-1000 with the result written in. */
window.AUDIT_CRM = {
  endpoint: "",
  /* "form" sends like a normal web form (most CRMs). Use "json" only if the CRM asks for JSON. */
  as: "form",
  /* The CRM's own names for the three fields the page sends. Change the right side only. */
  names: { phone: "Phone", email: "Email", result: "Description" },
  /* Hidden fields the CRM's form code carries, copied exactly as they are, for example "Last Name": "Audit visitor". */
  fixed: {}
};
