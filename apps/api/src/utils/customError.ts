export class CustomError extends Error {
    public statusCode: number;

    constructor(message: string, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends CustomError {
    constructor(message = '내용을 찾을 수 없습니다.') {
    super(message, 404);
    }
}

class NotFoundUserError extends CustomError {
	constructor(message = "유저를 찾을 수 없습니다.") {
		super(message, 404);
	}
}

class BadRequestError extends CustomError {
    constructor(message = '잘못된 요청입니다.') {
    super(message, 400);
    }
}

class UnauthorizedError extends CustomError {
    constructor(message = '인증이 필요합니다.') {
    super(message, 401);
    }
}

class ExistsError extends CustomError {
    constructor(message = '이미 존재하는 리소스 입니다.') {
    super(message, 409);
    }
}

class InternalServerError extends CustomError {
    constructor(message = '서버 에러') {
    super(message, 500);
    }
}

class KakaoError extends CustomError {
    constructor(message = '카카오 관련 에러') {
        super(message, 501)
    }
}

export {
    NotFoundError,
    NotFoundUserError,
    BadRequestError,
    UnauthorizedError,
    InternalServerError,
    KakaoError,
    ExistsError
};