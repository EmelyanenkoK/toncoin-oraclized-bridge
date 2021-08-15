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
        "uint14", 100, // factor
    ];
}

const bridgeAddress = "0x13dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8";
const multisigAddress = "0x23dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8";
const outAddress = "0x55dfd552e63729b472fcbcc8c45ebcc6691702558b68ec7527e1ba403a0f31a8"
const contractBalance = 108.2374e9;
const swapAmount = 10e9;


funcer({}, {
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
            "body": [
                "uint32", 4, // execute_voting
                "uint8", 0, // swap
                "uint256", "0xbba57dF6B628803C445d27e8904BE49C69A95ff3", // ext_chain_hash
                "uint16", 3, // internal_index
                "int8", 0, // wc
                "uint256", outAddress, // address
                "uint64", swapAmount, // swap_amount
            ],
            "new_data": makeStorage(contractBalance - swapAmount),
            "out_msgs": [
                {
                    "type":"Internal",
                    "to": `0:${outAddress.slice(2)}`,
                    "amount": (swapAmount-5e9)*0.99,
                    "sendMode": 0,
                    "body": [
                        "uint256", "0xbba57dF6B628803C445d27e8904BE49C69A95ff3", // ext_chain_hash
                        "uint16", 3, // internal_index
                    ],
                },
            ]
        },
        {
            "sender": `-1:${outAddress.slice(2)}`,
            "amount": 0.1*1e9,
            "body": [
                "uint32", 4, // execute_voting
                "uint8", 0, // swap
                "uint256", "0xbba57dF6B628803C445d27e8904BE49C69A95ff3", // ext_chain_hash
                "uint16", 3, // internal_index
                "int8", 0, // wc
                "uint256", outAddress, // address
                "uint64", swapAmount, // swap_amount
            ],
            exit_code: 305
        },

    ]
});
