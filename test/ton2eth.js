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
    'data': makeStorage(0),
    'in_msgs': [
        {
            "sender": "-1:43dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8",
            "amount": 10*1e9,
            "body": [
                "uint32", 3, // swap
                "uint64", 123, // query_id
                "uint160", "0xbba57dF6B628803C445d27e8904BE49C69A95ff3", // destination_address
            ],
            "new_data": makeStorage(5*1e9),
            // "out_msgs": [
            //     {
            //         "to": "0",
            //         "amount": "1000000000",
            //         "sendMode": 64,
            //         "body": [
            //             "uint32", 1, // op  deposit stake
            //             "uint64", 123, // query_id
            //             "uint256", "0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8", // ed_publey
            //             "uint256", "0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8" // secp_pubkey
            //         ],
            //     },
            //     {
            //         "to": "-1:83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8",
            //         "amount": "10000000000",
            //         "sendMode": 64,
            //         "body": [
            //             "uint32", 1, // op  deposit stake
            //             "uint64", 123, // query_id
            //             "uint256", "0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8", // ed_publey
            //             "uint256", "0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8" // secp_pubkey
            //         ],
            //     },
            // ]
        },
    ]
});