import express from 'express'
import { testing } from '../controller/index.js';
const router  =  express.Router();


router.get('/', testing)


export default router;