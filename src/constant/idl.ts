export const IDL: any = {
    "version": "0.1.0",
    "name": "solana_dapp",
    "constants": [{"name": "USER_ID", "type": "bytes", "value": "[85, 83, 69, 82, 95, 73, 68]"}, {
        "name": "COMMENT_ID",
        "type": "bytes",
        "value": "[67, 79, 77, 77, 69, 78, 84, 95, 73, 68]"
    }],
    "instructions": [{
        "name": "createUser",
        "accounts": [{"name": "authority", "isMut": true, "isSigner": true}, {
            "name": "userProfile",
            "isMut": true,
            "isSigner": false
        }, {"name": "systemProgram", "isMut": false, "isSigner": false}],
        "args": [{"name": "userName", "type": "string"}]
    }, {
        "name": "writeComment",
        "accounts": [{"name": "userProfile", "isMut": true, "isSigner": false}, {
            "name": "comment",
            "isMut": true,
            "isSigner": false
        }, {"name": "authority", "isMut": true, "isSigner": true}, {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
        }],
        "args": [{"name": "data", "type": "string"}]
    }],
    "accounts": [{
        "name": "User",
        "type": {
            "kind": "struct",
            "fields": [{"name": "authority", "type": "publicKey"}, {
                "name": "userName",
                "type": "string"
            }, {"name": "comments", "type": "u8"}]
        }
    }, {
        "name": "Comment",
        "type": {
            "kind": "struct",
            "fields": [{"name": "authority", "type": "publicKey"}, {"name": "data", "type": "string"}]
        }
    }]
}