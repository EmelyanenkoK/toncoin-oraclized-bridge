const {funcer} = require("./funcer");

funcer({
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
    'data': [
        "uint8", 0, // state_flags
        "coins", 0, // total_locked
        "uint3", 4, // collector_address, prefix
        "int8", 0, // collector_address, wc
        "uint256", "0xe53bddefb065373732ec25d5f9af0b3f7a3be358ea87ec285b4b6330a67d8c6a", // collector_address
        "coins", 2*1e9, // flat_reward
        "coins", 3*1e9, // network_fee
        "uint14", 0, // factor
    ],
    'in_msgs': [
        {
            "sender": "-1:23dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8",
            "amount": 0.1*1e9,
            "body": [
                "uint32", 4, // execute_voting
                "uint8", 3, // update state flags
                "uint8", 1, // state_flags
            ],
            "new_data": [
                "uint8", 1, // state_flags
                "coins", 0, // total_locked
                "uint3", 4, // collector_address, prefix
                "int8", 0, // collector_address, wc
                "uint256", "0xe53bddefb065373732ec25d5f9af0b3f7a3be358ea87ec285b4b6330a67d8c6a", // collector_address
                "coins", 2*1e9, // flat_reward
                "coins", 3*1e9, // network_fee
                "uint14", 0, // factor
            ],
            "out_msgs": [ // no out_msg
            ]
        },
    ]
});