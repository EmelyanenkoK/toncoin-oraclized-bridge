const {funcer} = require("./funcer");

funcer({
    'path': './func/',
    'fc': [
        'stdlib.fc',
        'nonstdlib.fc',
        'text_utils.fc',
        'message_utils.fc',
        'fee_utils.fc',
        'storage.fc',
        'bridge_code.fc',
        'get_methods.fc',
    ],
    "configParams": {
        71: [
            'cell', [
                "coins", "1000000000", // flat_stake
                "uint16", 1, // min_auth_num
                "uint32", 0, //seqno
                "uint16->any", { // oracles
                    "0": [
                        "uint256", "0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8"
                    ]
                }
            ]
        ]
    },
    'data': [
        "coins", 0, // total_staked
        "coins", 0, // total_locked
        "uint256", 0, // current_set_hash
        "uint256->any", {}, // sets
        "uint256->any", {}, // candidates
        "uint256->any", {}, // external_votings
        "uint256->any", {}, // ton_votings
    ],
    'in_msgs': [
        {
            "sender": "-1:83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8",
            "amount": "10000000000",
            "body": [
                "uint32", 1, // op  deposit stake
                "uint64", 123, // query_id
                "uint256", "0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8", // ed_publey
                "uint256", "0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8" // secp_pubkey
            ],
            "new_data": [
                "coins", 0, // total_staked
                "coins", 0, // total_locked
                "uint256", 0, // current_set_hash
                "uint256->any", {}, // sets
                "uint256->any", {}, // candidates
                "uint256->any", {}, // external_votings
                "uint256->any", {}, // ton_votings
            ],
            "out_msgs": [
                {
                    "to": "-1:83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8",
                    "amount": "10000000000",
                    "sendMode": 64,
                    "body": [
                        "uint32", 1, // op  deposit stake
                        "uint64", 123, // query_id
                        "uint256", "0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8", // ed_publey
                        "uint256", "0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8" // secp_pubkey
                    ],
                },
                {
                    "to": "-1:83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8",
                    "amount": "10000000000",
                    "sendMode": 64,
                    "body": [
                        "uint32", 1, // op  deposit stake
                        "uint64", 123, // query_id
                        "uint256", "0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8", // ed_publey
                        "uint256", "0x83dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8" // secp_pubkey
                    ],
                },
            ]
        },
    ]
});