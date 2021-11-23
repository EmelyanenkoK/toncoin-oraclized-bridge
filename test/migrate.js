const {funcer} = require("./funcer");

const makeStorage = (totalLocked) => {
    return [
        "uint8", 0, // state_flags
        "coins", totalLocked, // total_locked
        "uint3", 4, // collector_address, prefix
        "int8", 0, // collector_address, wc
        "uint256", "0xe53bddefb065373732ec25d5f9af0b3f7a3be358ea87ec285b4b6330a67d8c6a", // collector_address
        "coins", 2*1e9, // flat_reward
        "coins", 3*1e9, // network_fee
        "uint14", 0, // factor
    ];
}
const bridgeAddress = "0x13dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8";
const multisigAddress = "0x23dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8";
const contractBalance = 10.2374e9;
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
        72: [
            'cell', [
                "uint256", bridgeAddress, // bridge_address
                "uint256", multisigAddress, // oracles_address
                "uint256->any", { // oracles
                    "0x33dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8": []
                }
            ]
        ]
    },
    'data': makeStorage(contractBalance),
    'in_msgs': [
        {
            "sender": `-1:${multisigAddress.slice(2)}`,
            "amount": 0.1*1e9,
            "contract_balance": 11*1e9,
            "body": [
                "uint32", 4, // execute_voting
                "uint8", 4, // migrate
            ],
            "new_data":makeStorage(contractBalance), //total_locked is not updated
            "out_msgs": [
                {
                    "type": "Internal",
                    "to": `-1:${bridgeAddress.slice(2)}`,
                    "amount": contractBalance,
                    "sendMode": 1,
                    "body": [
                        'uint32', '0xf00d'
                    ],
                },
            ]
        },
        {
            "sender": `-1:0000000000000000000000000000000000000000000000000000000000000000`,
            "amount": 0.1*1e9,
            "contract_balance": 11*1e9,
            "body": [
                "uint32", 4, // execute_voting
                "uint8", 4, // migrate
            ],
            "exit_code": 305
        },
    ]
});
