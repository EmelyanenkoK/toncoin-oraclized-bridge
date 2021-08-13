const {exec} = require('child_process');
const fs = require('fs')

const makeType = (key) => {
    if (key === 'coins') {

        return 'Gram,';

    } else if (key === 'address') {

        return 'parse-smc-addr drop addr,'

    }  else if (key === 'Address') {

        return 'parse-smc-addr drop Addr,'

    } else if (key.startsWith('uint')) {

        const bits = key.substr(4);
        if (!Number(bits)) throw new Error('invalid uint bits "' + bits + '"');
        return bits + ' u,';

    } else if (key.startsWith('int')) {

        const bits = key.substr(3);
        if (!Number(bits)) throw new Error('invalid int bits "' + bits + '"');
        return bits + ' i,';

    } else {
        throw new Error('unsupported type "' + key + '"');
    }
}

const makeValue = (key, value) => {
    if (key === 'address' || key === 'Address') {
        return '"' + value + '"';
    } else {
        return value;
    }
}

const makeMapKey = (key, value) => {
    if (key.startsWith('uint')) {

        const bits = key.substr(4);
        if (!Number(bits)) throw new Error('invalid uint bits "' + bits + '"');
        return value + ' rot ' + bits + ' udict! drop';

    } else if (key.startsWith('int')) {

        const bits = key.substr(3);
        if (!Number(bits)) throw new Error('invalid int bits "' + bits + '"');
        return value + ' rot ' + bits + ' idict! drop';

    } else {
        throw new Error('unsupported map type "' + key + '"');
    }
}

const makeMap = (key, value) => {
    const mapIndex = key.indexOf('->');
    const mapKey = key.substr(0, mapIndex);
    const mapValueKey = key.substr(mapIndex);

    let s = 'dictnew\n';
    let i = 0;
    for (let _key in value) {
        const _value = value[_key];
        s += makeParams(_value) + ' <s ' + makeMapKey(mapKey, _key) + '\n';
        i += 2;
    }

    return s;
}

const makeParam = (key, value) => {
    if (key.indexOf('->') > -1) {
        return makeMap(key, value) + ' dict,';
    }

    if (key === 'cell') {
        return makeParams(value) + ' ref,';
    }

    return makeValue(key, value) + ' ' + makeType(key);
}

const makeParams = (arr) => {
    let s = '<b\n';
    let i = 0;
    while (i < arr.length) {
        const key = arr[i];
        const value = arr[i + 1];
        s += makeParam(key, value) + '\n';
        i += 2;
    }
    s += 'b>';
    return s;
}

const makeInMsg = (i, inMsg) => {
    return `
"${inMsg.sender}" // sender address
parse-smc-addr drop 2constant sender_address${i}

${inMsg.amount} constant msg_value${i} // in_msg amount

${makeParams(inMsg.body)} constant in_msg_body${i}

<b b{0110} s,
   sender_address${i} Addr,
   // TODO: add other data
b> constant in_msg${i}

0x076ef1ea           // magic
0                    // actions
0                    // msgs_sent
1628090356           // unixtime
1                    // block_lt
1                    // trans_lt
239                  // randseed
1000000000 null pair // balance_remaining
contract_address     // myself
global_config        // global_config
10 tuple 1 tuple constant c7

msg_value${i} in_msg${i} in_msg_body${i} <s 0 code storage c7 0x75 runvmx
// returns ...values exit_code new_c4 c5

${inMsg.new_data ? makeCheckStorage(inMsg.new_data) : ''}

${inMsg.out_msgs ? makeCheckOutMessages(inMsg.out_msgs) : ''}
`;
}

const makeCheckStorage = (newStorage) => {
    return `
${makeParams(newStorage)} constant correct_new_storage

rot { ."Error: non-zero exit code" cr 1 halt } if
swap hashu correct_new_storage hashu <> { ."Error: incorrect resulting storage" cr 2 halt } if
`;
}

const makeCheckOutMessages = (outMessages) => {
    return `
<s dup 0 swap { dup empty? not } {
  ref@ <s swap 1+ swap
} while drop
${outMessages.length} <> { ."Error: incorrect number of actions" cr 3 halt } if

${outMessages.reverse().map(outMsg => makeCheckOutMsg(outMsg)).join('\n')}
    `
}

const makeExtDest = (dest) => {
  if (dest.startsWith('0x')) {
    return 'x{' + dest.substr(2) + '}';
  }
  throw new Error('ExtMsg.to: hex string expected instead of "' + dest + '"');
}

const makeCheckOutExtMsg = (outMsg) => {
    return `
4 B@+ swap B{0EC3C86D} B= not abort"Unsupported action"
8 u@+ swap =: send-mode
ref@+ <s swap ref@ <s parse-msg

\`ext msg.type eq? not { ."Error: external message expected" cr 13 halt } if
msg.body hashu ${makeParams(outMsg.body)} hashu <> { ."Error: incorrect message body" cr 8 halt } if
${makeExtDest(outMsg.to)} shash msg.dest shash B= not { ."Error: incorrect message destination" cr 9 halt } if
send-mode ${outMsg.sendMode || 2} <> { ."Error: incorrect message sendmode" cr 11 halt } if
`
}

const makeCheckOutIntMsg = (outMsg) => {
    return `
4 B@+ swap B{0EC3C86D} B= not abort"Unsupported action"
8 u@+ swap =: send-mode
ref@+ <s swap ref@ <s parse-msg

\`int msg.type eq? not { ."Error: internal message expected" cr 12 halt } if
msg.body hashu ${makeParams(outMsg.body)} hashu <> { ."Error: incorrect message body" cr 8 halt } if
"${outMsg.to}" parse-smc-addr drop msg.dest 2<> { ."Error: incorrect message destination" cr 9 halt } if
msg.value ${outMsg.amount} <> { ."Error: incorrect message value" cr 10 halt } if
send-mode ${outMsg.sendMode || 3} <> { ."Error: incorrect message sendmode" cr 11 halt } if
`
}

const makeCheckOutMsg = (outMsg) => {
    if (outMsg.type == "Internal") {
        return makeCheckOutIntMsg(outMsg);
    } else if (outMsg.type == "External") {
        return makeCheckOutExtMsg(outMsg);
    } else {
        throw new Error('unsupported outMsg type "' + outMsg.type + '"');
    }
};

const makeInMessages = (inMsgs) => {
    let s = '';
    for (let i in inMsgs) {
        s += makeInMsg(i, inMsgs[i]);
    }
    return s;
}

const makeConfigParams = (configParams) => {
    return makeMap('int32->any', configParams);
}

const makeTestFif = (data) => {
    return `
"TonUtil.fif" include
"Asm.fif" include

{ rot = -rot = and } : 2=
{ 2= not } : 2<>

// s -- wc addr s'
{ 1 i@+ swap not abort"Internal address expected"
  1 i@+
  1 i@+ swap { 4 u@+ swap u@+ nip } if
  swap { 9 u@+ 32 } { 256 swap 8 } cond
  i@+ rot u@+
} : addr@+
{ addr@+ drop } : addr@

// s len -- res s'
{ tuck u@+ -rot swap
  <b -rot u, b> <s swap
} : s@+ // TODO: support for more than 256 bits or rather add C++ code for it
{ s@+ drop } : s@

// s -- addr s'
{ 1 i@+ swap abort"External address expected"
  1 i@+ swap
  { 9 u@+ swap s@+ }
  { x{} swap } cond
} : ext-addr@+
{ ext-addr@+ drop } : ext-addr@

// s --
{
  1 i@+ swap { ."not an internal message" cr 1 halt } if
  1 i@+ swap =: msg.ihr-disabled
  1 i@+ swap =: msg.bounce
  1 i@+ nip
  2 u@+ swap 0 <> { ."src = none expected" cr 1 halt } if
  addr@+ -rot 2=: msg.dest
  Gram@+ swap =: msg.value
  1 i@+ swap { ref@+ swap } { null } cond =: msg.extra
  Gram@+ nip Gram@+ nip
  64 u@+ nip 32 u@+ nip
  1 i@+ swap abort"StateInit is not supported"
  1 i@+ swap { ref@ } { s>c } cond =: msg.body
} : parse-int-msg

// s --
{
  2 u@+ swap 3 <> { ."not an outbound external message" cr 1 halt } if
  2 u@+ swap 0 <> { ."src = none expected" cr 1 halt } if
  ext-addr@+ swap =: msg.dest
  64 u@+ nip 32 u@+ nip
  1 i@+ swap abort"StateInit is not supported"
  1 i@+ swap { ref@ } { s>c } cond =: msg.body
 } : parse-ext-msg

// s --
{
  dup 1 i@
  { \`ext =: msg.type parse-ext-msg }
  { \`int =: msg.type parse-int-msg } cond
} : parse-msg

"compiled.fif" include <s constant code

${makeParams(data.data)} constant storage

${makeConfigParams(data.configParams)} constant global_config

<b <b b{00110} s, <b code s, b> ref, storage ref, b>
hashu -1 swap addr, b> constant contract_address

${makeInMessages(data.in_msgs)}
`;
}

const funcer = (data) => {
    const path = data.path;

    const compileFuncCmd = 'func -SP ' + ' -o ' + path + 'compiled.fif ' + data.fc.map(fc => path + fc).join(' ');
    const runFiftCmd = 'fift ' + path + 'test.fif';
    const testFif = makeTestFif(data);

    console.log(compileFuncCmd);
    exec(compileFuncCmd, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            // node couldn't execute the command
            return;
        }

        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);

        console.log(testFif);

        fs.writeFile(path + 'test.fif', testFif, err => {
            if (err) {
                console.error(err)
                return
            }
            console.log('test.fif OK')

            console.log(runFiftCmd);

            exec(runFiftCmd, (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    // node couldn't execute the command
                    return;
                }

                // the *entire* stdout and stderr (buffered)
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            });
        })
    });
}

module.exports = {funcer};
