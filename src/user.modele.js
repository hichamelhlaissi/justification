const Validator = require('jsonschema').Validator;
const v = new Validator();
const schema = {
    "type": "object",
    "properties": {
        "token": {"type": "string"},
        "user_ip": {"type": "string"},
        "user_id": {"type": "string"},
        "email": {"type": "string"},
        "rate": {
            "type": "object",
            "items":  {
                "properties": {
                    "limit": { "type": "integer" },
                    "timestamp": { "type": "integer" }
                     },
        },
            "required": ["limit", "timestamp"]
            },
        "required": ["token", "user_id","rate"]

        }
};

exports.userValidator=(user)=> {
    const res  = v.validate(user,schema);
    return res.valid;
}
