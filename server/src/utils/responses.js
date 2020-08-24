class Exception {
    constructor(name, message){
        this.name = name;
        this.message = message;
    }
}

class Response {

    constructor(success, error = null){
        let validator = this.#validateParams(success, error);
        console.log(validator);
        if(validator !== null){
            throw validator;
        }
        this._success = success;
        this._error = error;
    }

    #validateParams(success, error){
        if( typeof success !== "boolean" ){
            return new Exception("ERROR", "The success object must be a boolean");
        }
        if(!(error instanceof Exception) && error!==null){
            return new Exception("ERROR", "The error object must be of type Exception");
        }
        if(success && error!==null){
            return new Exception("ERROR", "If success is true error must be null");
        }
        if(!success && error === null){
            return new Exception("ERROR", "If success is false error must not be null");
        }
        return null;
    }

    get success(){
        return this._success;
    }

    get error(){
        return this._error;
    }

    set success(success){
        this._success = success;
    }

    set error(error){
        this._error = error;
    }

}