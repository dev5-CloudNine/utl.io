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

STATUSES = ["draft", "pending", "active", "flagged", "inactive", "deactivated"];

APPLICATION_STATUSES = ["open", "frozen", "assigned", "completed", 'pending_payment', "paid", "deactivated"];

RATE_BASIS = ['Fixed Pay', 'Per Hour', 'Per Device', 'Blended'];

MOBILE_CARRIERS = function() {
  return [
    {label: "AirFire Mobile", value: "@sms.airfiremobile.com"},
    {label: "Aio Wireless", value: "@mms.aiowireless.net"},
    {label: "Alaska Communications", value: "@msg.acsalaska.com"},
    {label: "Alltel (Allied Wireless)", value: "@mms.alltelwireless.com"},
    {label: "Ameritech", value: "@paging.acswireless.com"},
    {label: "Assurance Wireless", value: "@vmobl.com"},
    {label: "AT & T  Mobility", value: "@mms.att.net"},
    {label: "AT & T Enterprise Paging", value: "@page.att.net"},
    {label: "BellSouth", value: "@bellsouth.cl"},
    {label: "Bluegrass Cellular", value: "@mms.myblueworks.com"},
    {label: "Bluesky Communications", value: "@psms.bluesky.as"},
    {label: "Boost Mobile", value: "@myboostmobile.com"},
    {label: "Carolina West", value: "@cwwsms.com"},
    {label: "Cell Com", value: "@cellcom.quiktxt.com"},
    {label: "Cellular South", value: "@csouth1.com"},
    {label: "Centennial Wireless", value: "@cwemail.com"},
    {label: "Chariton Valley Wireless", value: "@sms.cvalley.net"},
    {label: "Chat Mobility", value: "@mail.msgsender.com"},
    {label: "Cincinnati Bell", value: "@mms.gocbw.com"},
    {label: "Cleartalk", value: "@sms.cleartalk.us"},
    {label: "Cricket", value: "@mms.mycricket.com"},
    {label: "C Spire Wireless", value: "@cspire1.com"},
    {label: "DTC", value: "@sms.advantagecell.net"},
    {label: "Edge Wireless", value: "@sms.edgewireless.com"},
    {label: "Element Mobile", value: "@SMS.elementmobile.net"},
    {label: "General Communications Inc.", value: "@mobile.gci.net"},
    {label: "Golden State Cellular", value: "@gscsms.com"},
    {label: "Greatcall", value: "@vtxt.com"},
    {label: "Hawaiian Telcom", value: "@hawaii.sprintpcs.com"},
    {label: "I-wireless(T-Mobile)", value: "@iwspcs.net"},
    {label: "I-wireless(Sprint PCS)", value: "@iwirelesshometext.com"},
    {label: "Inland Cellular", value: "@inlandlink.com"},
    {label: "Kajeet", value: "@mobile.kajeet.net"},
    {label: "LongLines", value: "@text.longlines.com"},
    {label: "Metro PCS", value: "@mymetropcs.com"},
    {label: "Ntelos", value: "pcs.ntelos.com"},
    {label: "Nextech", value: "@sms.ntwls.net"},
    {label: "Page Plus Cellular (Verizon)", value: "@vzwpix.com"},
    {label: "Pioneer Cellular", value: "@zsend.com"},
    {label: "Pocket Wireless", value: "@sms.pocket.com"},
    {label: "Qwest Wireless", value: "@qwestmp.com"},
    {label: "Rogers Wireless", value: "@mms.rogers.com"},
    {label: "Simple Mobile", value: "@smtext.com"},
    {label: "Southern LINC", value: "@page.southernlinc.com"},
    {label: "South Central Communications", value: "@rinasms.com"},
    {label: "Sprint", value: "@pm.sprint.com"},
    {label: "Syringa Wireless", value: "@rinasms.com"},
    {label: "Sun Com", value: "@tms.suncom.com"},
    {label: "T-Mobile", value: "@tmomail.net"},
    {label: "Teleflip", value: "@teleflip.com"},
    {label: "Telus Mobility", value: "@mms.telusmobility.com"},
    {label: "Ting", value: "@message.ting.com"},
    {label: "TracFone (prepaid)", value: "@mmst5.tracfone.com"},
    {label: "Unicel", value: "@utext.com"},
    {label: "Union Wireless", value: "@union-tel.com"},
    {label: "USCellular", value: "@mms.uscc.net"},
    {label: "USA Mobility", value: "@usamobility.net"},
    {label: "Verizon", value: "@vtext.com"},
    {label: "Verizon Wireless", value: "@vzwpix.com"},
    {label: "Viaero", value: "@mmsviaero.com"},
    {label: "Virgin Mobile", value: "@vmpix.com"},
    {label: "Voyager Mobile", value: "@text.voyagermobile.com"},
    {label: "Voice stream", value: "@voicestream.net"},
    {label: "West Central Wireless", value: "@sms.wcc.net"},
    {label: "XIT Communications", value: "@sms.xit.net"},
  ]
},

SKILL_SET = function() {
  return [
    {label: "eBook Design", value: "eBook Design"},
    {label: "FL Studio", value: "FL Studio"},
    {label: "Final Cut Pro X", value: "Final Cut Pro X"},
  ]
},

CATEGORIES = function() {
  return Categories.find().fetch();
}

S3_FILEUPLOADS = "utl";

URL = "https://utl-59972.onmodulus.net";