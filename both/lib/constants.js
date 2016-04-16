INDUSTRY_TYPES = function() {
  return [
    {
      optgroup: "Web Development, Web Design, Web Content",
      options: [
        {label: "PHP", value: "PHP"},
        {label: "Java", value: "Java"},
        {label: "Wordpress", value: "Wordpress"},
        {label: "HTML", value: "HTML"},
        {label: "Python", value: "Python"},
        {label: "Ruby on Rails", value: "Ruby on Rails"},
        {label: "Others", value: "Others"}
      ]
    },
    {
      optgroup: "Softwre Variations",
      options: [
        {label: "Apps", value: "Apps"},
        {label: "Program Installation", value: "Program Installation"},
        {label: "Backup Data", value: "Backup Data"},
        {label: "Imaging", value: "Imaging"},
        {label: "Migration", value: "Migration"},
        {label: "Virul/Malware Removal", value: "Virul/Malware Removal"},
        {label: "Others", value: "Others"},
      ]
    },
    {
      optgroup: "Network and System Administrator",
      options: [
        {label: "Network Setup", value: "Network Setup"},
        {label: "Helpdesk", value: "Helpdesk"},
        {label: "Server", value: "Server"},
        {label: "Management", value: "Management"},
        {label: "Network Security", value: "Network Security"},
      ]
    },
    {
      optgroup: "Hardware Systems",
      options: [
        {label: "Hard Drive", value: "Hard Drive"},
        {label: "RAM Memory", value: "RAM Memory"},
        {label: "Fans", value: "Fans"},
        {label: "CPU Processors", value: "CPU Processors"},
        {label: "Motherboards", value: "Motherboards"},
        {label: "Sound Cards", value: "Sound Cards"},
        {label: "Graphic Cards", value: "Graphic Cards"},
        {label: "SSD", value: "SSD"},
        {label: "CMOS", value: "CMOS"},
        {label: "REM", value: "REM"},
        {label: "FEM", value: "FEM"},
        {label: "Air Duct", value: "Air Duct"},
        {label: "CF", value: "CF"},
        {label: "Others", value: "Others"},
      ]
    },
    {
      optgroup: "Audio and Visual",
      options: [
        {label: "HD TV, LED TV, LCD TV, 4K TV", value: "HD TV, LED TV, LCD TV, 4K TV"},
        {label:"Computer Monitors", value:"Computer Monitors"},
        {label:"Home Theaters", value:"Home Theaters"},
        {label:"Media Player", value:"Media Player"},
        {label: "Audio Programming", value: "Audio Programming"},
        {label: "Audio Production", value: "Audio Production"},
        {label: "Audio Forensics", value: "Audio Forensics"},
      ]
    },
    {
      optgroup: "Retail Systems",
      options: [
        {label: "IBM", value: "IBM"},
        {label: "Dell", value: "Dell"},
        {label: "Toshiba", value: "Toshiba"},
        {label: "Panasonic", value: "Panasonic"},
        {label: "NCR", value: "NCR"},
        {label: "Casio", value: "Casio"},
        {label: "Cybertill", value: "Cybertill"},
        {label: "Others", value: "Others"},
      ]
    },
    {
      optgroup: "KIOSK SYSTEM",
      options: [
        {label: "Retail", value: "Retail"},
        {label: "Bill Payment", value: "Bill Payment"},
        {label: "Human Resources", value: "Human Resources"},
        {label: "Health Care", value: "Health Care"},
        {label: "Airport Security", value: "Airport Security"},
        {label: "Government", value: "Government"},
        {label: "Green", value: "Gre_iden"},
        {label: "Gaming", value: "Gaming"},
      ]
    },
    {
      optgroup: "PRINTING SYSTEMS",
      options: [
        {label: "Laser Unit", value: "Laser Unit"},
        {label: "Photoreceptor Drum", value: "Photoreceptor Drum"},
        {label: "Fuser", value: "Fuser"},
        {label: "Mirror/Lenses", value: "Mirror/Lenses"},
        {label: "Discharge Lamp", value: "Discharge Lamp"},
        {label: "Sensors", value: "Sensors"},
        {label: "Others", value: "Others"},
      ]
    },
    {
      optgroup: "VOIP (Voice Over Internet Protocol) Installation",
      options: [
        {label: "Vonage", value: "Vonage"},
        {label: "Ring Central", value: "Ring Central"},
        {label: "Fonality", value: "Fonality"},
        {label: "Nextiva", value: "Nextiva"},
        {label: "CBX Server", value: "CBX Server"},
        {label: "Cloud Setup", value: "Cloud Setup"},
        {label: "Phone Setup", value: "Phone Setup"},
        {label: "Others", value: "Others"},
      ]
    },
    {
      optgroup: "Satellite Systems",
      options: [
        {label: "Installation", value: "Installation"},
        {label: "Repair", value: "Repair"},
        {label: "Swap", value: "Swap"}
      ]
    },
    {
      optgroup: "Security Systems",
      options: [
        {label: "Wireless Systems", value: "Wireless Systems"},
        {label: "Motion Detectors", value: "Motion Detectors"},
        {label: "Sirens", value: "Sirens"},
        {label: "Intercom System", value: "Intercom System"},
        {label: "Door and Window Sensors", value: "Door and Window Sensors"},
        {label: "Bullet Cameras", value: "Bullet Cameras"},
        {label: "Dome Cameras", value: "Dome Cameras"},
        {label: "Covert Cameras", value: "Covert Cameras"},
        {label: "Discreet Cameras", value: "Discreet Cameras"},
        {label: "Night Vision Cameras", value: "Night Vision Cameras"},
        {label: "Varifocal Cameras", value: "Varifocal Cameras"},
        {label: "Network IP Cameras", value: "Network IP Cameras"},
        {label: "Others", value: "Others"},
      ]
    },
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

MOBILE_CARRIERS = function() {
  return [
    {label: "Alltel", value: "Alltel"},
    {label: "ATT", value: "ATT"},
    {label: "Boost Mobile", value: "Boost Mobile"},
    {label: "Cellcom", value: "Cellcom"},
    {label: "Cellular South", value: "Cellular South"},
    {label: "Cincinnati Bell Wireless", value: "Cincinnati Bell Wireless"},
    {label: "Cingular", value: "Cingular"},
    {label: "Cricket", value: "Cricket"},
    {label: "Inland Cellular", value: "Inland Cellular"},
    {label: "IWireless", value: "IWireless"},
    {label: "MetroPCS", value: "MetroPCS"},
    {label: "Nextel", value: "Nextel"},
    {label: "Ntelos", value: "Ntelos"},
    {label: "Project Fi", value: "Project Fi"},
    {label: "Quest", value: "Quest"},
    {label: "Republic Wireless", value: "Republic Wireless"},
    {label: "Simple Mobile", value: "Simple Mobile"},
    {label: "Southern LINC", value: "Southern LINC"},
    {label: "Spring", value: "Spring"},
    {label: "Straight Talk", value: "Straight Talk"},
    {label: "T-Mobile", value: "T-Mobile"},
    {label: "US Cellular", value: "US Cellular"},
    {label: "Verizon", value: "Verizon"},
    {label: "Virgin Mobile", value: "Virgin Mobile"},
  ]
},

SKILL_SET = function() {
  return [
    {label: "eBook Design", value: "eBook Design"},
    {label: "FL Studio", value: "FL Studio"},
    {label: "Final Cut Pro X", value: "Final Cut Pro X"},
  ]
}