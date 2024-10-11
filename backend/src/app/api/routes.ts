import { Router, Request, Response } from 'express';
import config from '@/configs/env';
import { validateVersionTag, forwardVersionTag as ver } from '@/middlewares/versionTag.middleware';
import { validateAccessToken, validateRefreshToken} from '@/middlewares/token.middleware';
import authAccess from './authAccess/authAccess.handlers';
import authRefresh from './authRefresh/authRefresh.handlers';
import signIn from './signIn/signIn.handlers';
import { validateSignIn } from './signIn/signIn.middlewares';
import signUp from './signUp/signUp.handlers';
import { validateSignUp } from './signUp/signUp.middlewares';
import signOut from './signOut/signOut.handlers';
import verifyEmail from './verifyEmail/verifyEmail.handlers';
import { validateVerifyEmail } from './verifyEmail/verifyEmail.middlewares';
import forgotPassword from './forgotPassword/forgotPassword.handlers';
import { validateForgotPassword } from './forgotPassword/forgotPassword.middlewares';
import resetPassword from './resetPassword/resetPassword.handlers';
import { validateResetPassword } from './resetPassword/resetPassword.middlewares';
import changePassword from './changePassword/changePassword.handlers';
import { validateChangePassword } from './changePassword/changePassword.middlewares';
import listRoom from './listRoom/listRoom.handlers';
import { validateListRoom } from './listRoom/listRoom.middlewares';
import createRoom from './createRoom/createRoom.handlers';
import joinRoom from './joinRoom/joinRoom.handlers';
import { validateJoinRoom } from './joinRoom/joinRoom.middlewares';
import createMessage from './createMessage/createMessage.handlers';
import { validateCreateMessage } from './createMessage/createMessage.middlewares';


const tokenValidators = [validateAccessToken, validateRefreshToken];

const router = Router();

router.get('/auth', ver('1.0'), ...tokenValidators, authAccess.v1_0);

router.get('/auth/refresh', ver('1.0'), validateRefreshToken, authRefresh.v1_0);

router.post('/sign-in', ver('1.0'), validateSignIn, signIn.v1_0);

router.post('/sign-up', ver('1.0'), validateSignUp, signUp.v1_0);

router.post('/sign-out', ver('1.0'), ...tokenValidators, signOut.v1_0);

router.get('/verify/:token', ver('1.0'), validateVerifyEmail, verifyEmail.v1_0);

router.post('/forgot-password', ver('1.0'), validateForgotPassword, forgotPassword.v1_0);

router.get('/reset-password/:token', ver('1.0'), validateResetPassword, resetPassword.v1_0);

router.post('/change-password/:token', ver('1.0'), validateChangePassword, changePassword.v1_0);

router.get('/room', ver('1.0'), ...tokenValidators, validateListRoom, listRoom.v1_0);

router.post('/room', ver('1.0'), ...tokenValidators, createRoom.v1_0);

router.post('/room/join/:roomName', ver('1.0'), ...tokenValidators, validateJoinRoom, joinRoom.v1_0);

router.post('/room/leave/:roomName', ver('1.0'), ...tokenValidators, validateJoinRoom, joinRoom.v1_0);

router.post('/message', ver('1.0'), ...tokenValidators, validateCreateMessage, createMessage.v1_0);

const apiRouter = Router();
apiRouter.use('/:version', validateVersionTag, router);

export default apiRouter;
