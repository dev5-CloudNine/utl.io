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

STATUSES = ["active", "deactivated"];

APPLICATION_STATUSES = ["open", "frozen", "assigned", "paid"];

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

URL = "https://utl-95476.app.xervo.io";