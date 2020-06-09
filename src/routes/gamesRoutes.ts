import path from 'path';
import Router from 'express';
import Parser from '../models/Parser';
import GameController from '../controllers/GameController';

const routes = Router();
const parser = new Parser();
const logPath = path.join(__dirname, '../data/game.log');
const controller = new GameController(parser, logPath);

routes.get('/', controller.index);
routes.get('/:id', controller.show);
routes.get('/all/ranking', controller.rank);

export default routes;
