import auth from './auth.middleware.js';
import awaitHF  from './awaitHandlerFactory.middleware.js';
import {
    registerShema,
    loginSchema,

} from './validation.middleware.js'

export default {
    auth,
    awaitHF,
    registerShema,
    loginSchema,
} 