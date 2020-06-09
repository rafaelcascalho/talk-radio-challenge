import Router from 'express';
import gamesRoutes from './gamesRoutes';

const routes = Router();

routes.use('/games', gamesRoutes);

export default routes;
