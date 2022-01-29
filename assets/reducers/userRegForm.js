import {
    USER_REG_FORM_REQUEST,
    USER_REG_FORM_SUCCESS,
    USER_REG_FORM_FAIL
} from '../constants/UserRegForm'

const initialState = {}

export default function userRegFormState(state = initialState, action) {
    switch (action.type) {
        case USER_REG_FORM_REQUEST:
            // TODO
            return {}

        case USER_REG_FORM_SUCCESS:
            // TODO
            return {}

        case USER_REG_FORM_FAIL:
            // TODO
            return {}

        default:
            return state
    }
}