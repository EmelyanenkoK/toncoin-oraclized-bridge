const {funcer} = require("./funcer");

const makeStorage = (totalLocked) => {
    return [
        "uint8", 0, // state_flags
        "coins", totalLocked, // total_locked
        "uint3", 4, // collector_address, prefix
        "int8", 0, // collector_address, wc
        "uint256", "0xe53bddefb065373732ec25d5f9af0b3f7a3be358ea87ec285b4b6330a67d8c6a", // collector_address
        "coins", 1*1e9, // flat_reward
        "coins", 3*1e9, // network_fee
        "uint14", 200, // factor
    ];
}
const ethAddress = "0x0123456789abcdefABCDEFe8904BE49C69A95ff3";

funcer({},{
    'path': './func/',
    'fc': [
        'stdlib.fc',
        'text_utils.fc',
        'message_utils.fc',
        'bridge-config.fc',
        'bridge_code.fc',
    ],
    "configParams": {
        71: [
            'cell', [
                "uint256", "0x13dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8", // bridge_address
                "uint256", "0x23dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8", // oracles_address
                "uint256->any", { // oracles
                    "0x33dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8": []
                }
            ]
        ]
    },
    'data': makeStorage(0),
    'in_msgs': [
        {
            "sender": "-1:43dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8",
            "amount": 10*1e9,
            "body": [
                "comment", `swapTo#${ethAddress}`
            ],
            "new_data": makeStorage(6*1e9*0.98),
            "out_msgs": [
                {
                    "type": "External",
                    "to": "0x00000000000000000000000000000000000000000000000000000000c0470ccf",
                    "sendMode": 0,
                    "body": [
                        "uint160", ethAddress, // destination_address
                        "uint64", 6*1e9*0.98 // amount - fees
                    ],
                },
                {
                    "type": "Internal",
                    "to": "-1:43dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8", // sender
                    "amount": 100000000,
                    "sendMode": 3,
                    "body": [
                      "comment", `OK ${6*1e9*0.98} `
                    ],
                }
            ]
        },
        { // from oracles
            "sender": "-1:23dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8",
            "amount": 10*1e9,
            "body": [
                "comment", `swapTo#${ethAddress}`
            ],
            exit_code: 306
        },
    ]
});
