INDUSTRY_TYPES = function() {
  return [
    {
      optgroup: "IT/Networking",
      options: [
        {label: "Network & System Admininstration", value: "Network & System Admininstration"},
        {label: "Server", value: "Server"},
        {label: "Information Security", value: "Information Security"},
        {label: "ERP-CRM Software", value: "ERP-CRM Software"},
        {label: "Helpdesk", value: "Helpdesk"},
        {label: "Database Administration", value: "Database Administration"},
        {label: "Network Setup", value: "Network Setup"},
        {label: "Management", value: "Management"},
        {label: "Network Security", value: "Network Security"}
      ]
    },
    {
      optgroup: "Wiring Installment",
      options: [
        {label: "CAT 3-5-6", value: "CAT 3-5-6"},
        {label: "Fiber Optic", value: "Fiber Optic"},
        {label: "Coax", value: "Coax"}
      ]
    }
  ]
}

SUB_INDUSTRY_TYPES = ['Network and System Administration', 'Server', 'Information Security', 'Cat 3-5-6', 'Fiber optics'];

SUMMERNOTE_OPTIONS = {
  type: 'summernote',
  height: 300,
  minHeight: 300,
  toolbar: [
    ['style', ['style']],
    ['font', ['bold', 'italic', 'underline', 'clear']],
    ['para', ['ul', 'ol']],
    ['insert', ['link','hr']],
    ['misc', ['codeview']]
  ],
  styleWithSpan: false
};

STATUSES = ["pending","active","flagged","inactive","filled"];

RATE_BASIS = ['Fixed Pay', 'Per Hour', 'Per Device', 'Blended'];