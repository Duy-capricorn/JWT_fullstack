import express from 'express';

import homeController from '../controller/homeController';
import apiController from '../controller/apiController';

const router = express.Router();

// express app
const initWebRoutes = (app) => {
    router.get('/', homeController.handleHelloWorld);

    router.get('/user', homeController.handleUserPage);

    router.get('/about', (req, res) => {
        return res.send('Tran Thai Duy - B2000104');
    });

    router.post('/users/created-user', homeController.handleCreatedUser);

    router.post('/delete-user/:id', homeController.handleDeleteUser);
    router.get('/update-user/:id', homeController.handleUpdateUserPage);

    // rest API
    router.get('/api/test_api', apiController.testAPI);

    return app.use('/', router);
};

export default initWebRoutes;
