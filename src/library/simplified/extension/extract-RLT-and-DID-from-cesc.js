// does the expedia rlt server cesc cookie exist?
if (typeof b['cp.cesc'] != "undefined" && (b['cp.cesc'].toLowerCase().indexOf('rlt'.toLowerCase()) > -1 || b['cp.cesc'].toLowerCase().indexOf('{}'.toLowerCase()) > -1)) {

    // store the cesc temporarily
    var tempMC = b['cp.cesc'].toLowerCase().indexOf('rlt'.toLowerCase()) > -1 ? b['cp.cesc'].split("rlt\":[")[1].split("[")[0].split(",")[0].replace(/\"/g, "") : "{}";

    // does the tealium generated rlt cookie already exist (visitor - see following extension), is it equal to the cesc server cookie,
    // AND is this the first landing page after the marketing click?
    if (typeof b['cp.rlt_marketing_code_cookie'] != "undefined" && b['cp.rlt_marketing_code_cookie'] != "" && b['cp.rlt_marketing_code_cookie'] === tempMC && b['dom.referrer'].indexOf(b['dom.domain']) < 0 || (b['dom.referrer'].indexOf(b['dom.domain']) > -1 && tempMC == "{}")) {


        // keep the marketing code the same as the existing cookie and set the log_attribution to false
        if(checkIfEmailInString(b['cp.rlt_marketing_code_cookie'])){
            b.rlt_marketing_code = "{}";
            b['cp.rlt_marketing_code_cookie'] = '{}';
        }else{
            b.rlt_marketing_code = b['cp.rlt_marketing_code_cookie'];
        }
        b.log_attribution = "false";

    } else if (b['dom.referrer'].indexOf(b['dom.domain']) < 0 || (b['dom.referrer'].indexOf(b['dom.domain']) > -1 && tempMC == "{}")) {
        // here, the cesc is different than the existing cookie and this is the first landing page after the marketing click,
        //  so update the rlt value and set log_attribution to true
        if(!checkIfEmailInString(tempMC)) {
            b.rlt_marketing_code = tempMC;
        }else{
            b.rlt_marketing_code = '{}';
        }
        b.log_attribution = "true";
    } else {
        // if none of the above is true, set the log_attribution value to false as a safety measure
        // rlt_marketing_code will be set to the cesc cookie, which is what we want for the following extensions
        if(!checkIfEmailInString(tempMC)) {
            b.rlt_marketing_code = tempMC;
        }else{
            b.rlt_marketing_code = '{}';
        }
        b.log_attribution = "false";
    }
} else if (typeof b['cp.cesc'] == "undefined" && b['dom.referrer'].indexOf(b['dom.domain'] < 0)) {
    b.rlt_marketing_code = "{}";
    b.log_attribution = "true";
}

// this is for a different tag (cruise critic - travelocity) - extract DID value from cesc cookie
if (typeof b['cp.cesc'] != "undefined" && b['cp.cesc'].indexOf('DID') > -1) {
    b.did_code = "DID" + b['cp.cesc'].split(",")[0].split("DID")[1].replace(/\"/g, "");;
}

function  checkIfEmailInString (text) {
    var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
    return re.test(decodeURIComponent(decodeURIComponent(text)));
}