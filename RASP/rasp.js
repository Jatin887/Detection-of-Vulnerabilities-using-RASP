const dns=require("dns")
function xss(q)
{
  rxss=/((\%3c)|<)[^\n]+((\%3E)|>)/i;
  return rxss.test(q);

}

function ssrf(url){
  rssrf=/127.0.0.1/g;
  
  function check_private_ip(host_string) {
    var prefixes = [
        "127.", "0.",
        "10.", "172.16.", "172.17.", "172.18.", "172.19.", "172.20.", "172.21.", "172.22.", "172.23.", "172.24.",
        "172.25.", "172.26.", "172.27.", "172.28.", "172.29.", "172.30.", "172.31.", "192.168.", "169.254.",
        "fc", "fe", "ff", "::1", "localhost","2130706433"
    ];

    // Check if host is IP address or number
    var parts = host_string.split(".");
    var mod_parts = [];

    for (var i=0; i<parts.length; i++) {
        var p = parts[i];
        var mod_p = p;
        var is_int = false;

        // If hex, convert to dec
        if(p.startsWith('0x') || p.startsWith('0X')) {
            var s = p.slice(2);
            if (parseInt(s, 16).toString(16) === s) {
                is_int = true;
                mod_p = parseInt(p, 16).toString();
            }
        } else if(p.startsWith('0')) { // If octal, convert to dec
            var s = p.replace(/^0+/, '');
            if (parseInt(s).toString() === s) {
                is_int = true;
                mod_p = parseInt(p, 8).toString();
            }
        }

        if (parseInt(p).toString() === p) {
            is_int = true;
        }

        if (parts.length === 1 && is_int) {
            mod_p = int_to_ip(parseInt(mod_p))
        }

        mod_parts.push(mod_p);
    }
    var mod_host_string = mod_parts.join(".");

    var is_private = false;
    for (var i=0; i<prefixes.length; i++) {
        if (mod_host_string.startsWith(prefixes[i])) {
            is_private = true;
            break;
        }
    }

    return is_private;

}
var domain = url.replace('http://','').replace('https://','').replace('www.','').split(/[/?#]/)[0];
return check_private_ip(domain);

}

function cmd(inp){
    function get_cmdi_pattern() {
        
            var lines = require('fs').readFileSync(__dirname + '/data/cmd', 'utf-8').split('\n');
            var str_pattern = '';
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i].trim();
                if (line === '' || line.charAt(0) === '#') continue;

                // Remove trailing '+'
                str_pattern += line.replace(/\+\s*$/, "") + '|';
            }
            // Remove trailing '|'
            str_pattern = str_pattern.replace(/\|\s*$/, "");
            str_pattern = '(^|\\s|;|&&|\\|\\||&|\\|)(' + str_pattern + ')($|\\s|;|&&|\\|\\||&|\\||<)|(\\*|\\?)';
            var pattern = new RegExp(str_pattern, 'i');
            console.log(pattern)

        

        return pattern;
    }
    return get_cmdi_pattern().test(inp);



}


module.exports={xss,ssrf,cmd};

 