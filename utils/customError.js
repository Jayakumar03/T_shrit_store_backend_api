class CustomerError extends Error{
    constructor(message, code){
        super(this.message)
        this.code = code
    }
}

module.exports = CustomerError